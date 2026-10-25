# TaskNote 网页关闭后提醒：Supabase 上线步骤

这份说明用于把 TaskNote 的 Web Push 后端接入现有 Supabase 项目。网页端代码已经准备好，但在迁移、Edge Functions、密钥和 Cron 全部完成以前，“网页关闭后提醒”不能工作，也不应发布为已启用状态。

本项目当前 Supabase Project Ref：`guplutkrbjsauqijdiia`（来自项目 URL `https://guplutkrbjsauqijdiia.supabase.co`）。运行命令前先确认 Supabase Dashboard 右上角项目和该 ID 一致。

## 重要安全边界

- 只把 `sb_publishable_...` 公钥放在浏览器端；它不能代替 RLS。不要把 Supabase Secret key、旧版 `service_role` key、VAPID 私钥或 Cron 密钥放进网页、Git、Issue 或聊天。
- 本功能不会把待办标题或正文复制到推送数据库或通知内容。数据库只保存待办 ID、提醒时间、每设备 Push 订阅和投递状态。
- 推送是尽力送达：浏览器、操作系统、省电模式和推送服务都可能延迟或丢弃通知；无法保证准点或绝对不重复。
- 迁移依赖现有 `public.user_data(user_id, data)` 表。应用应继续只允许用户访问自己的 `user_data` 行；新建的三个推送表仅由服务端 `service_role` 管理。

## 1. 安装并连接 Supabase CLI

安装方式按 Supabase 官方 [CLI 安装说明](https://supabase.com/docs/guides/local-development/cli/getting-started)选择。进入 TaskNote 仓库根目录后：

```sh
supabase login
supabase link --project-ref guplutkrbjsauqijdiia
supabase migration list
```

`link` 会要求数据库密码；只在本机 Supabase CLI 提示中输入。执行 `migration list` 后确认目标项目正确，且没有尚未处理的历史迁移分歧。

## 2. 预览并应用数据库迁移

仓库中的迁移文件为 [`supabase/migrations/20261025000000_task_reminders.sql`](../supabase/migrations/20261025000000_task_reminders.sql)。先预览：

```sh
supabase db push --dry-run
```

确认只会应用预期迁移后再执行：

```sh
supabase db push
```

不要在生产项目运行 `supabase db reset --linked`；该命令会重建远端数据库。若选择在 Dashboard 的 SQL Editor 手动执行迁移文件，就不要再把同一迁移当作未记录的变更重复推送；应先按 Supabase 的迁移历史说明核对并修复迁移记录。

完成后可在 Database → Tables 确认 `push_subscriptions`、`task_reminders`、`push_deliveries` 已建立；Database → Policies 或 SQL Editor 确认三张表启用了 RLS，且 `anon`、`authenticated` 没有直接读取权限。函数和触发器会从 `user_data` 的 JSON 快照维护待提醒索引。

## 3. 生成 Web Push 与 Cron 密钥

VAPID 密钥只生成一次，并保存在密码管理器临时记录中：

```sh
npx --yes web-push@3.6.7 generate-vapid-keys --json
```

另生成一个独立的 Cron 共享密钥：

```sh
openssl rand -hex 32
```

不要把这两个命令的输出贴到聊天或提交到 Git。`VAPID_SUBJECT` 使用可联系到项目维护者的值，例如 `mailto:你的维护邮箱`。

在 Supabase Dashboard → Edge Functions → Secrets 新增以下四项：

| 名称 | 值从哪里来 |
| --- | --- |
| `VAPID_PUBLIC_KEY` | VAPID 生成结果的 `publicKey` |
| `VAPID_PRIVATE_KEY` | 同一结果的 `privateKey` |
| `VAPID_SUBJECT` | 维护者联系地址，如 `mailto:...` |
| `TASK_REMINDER_CRON_SECRET` | 上面单独生成的随机 Cron 密钥 |

Supabase 会自动向 Edge Functions 注入项目 URL 和服务端密钥；不要手动把这些值加到前端环境变量中。Dashboard 保存 Edge Function secrets 后即可供函数读取。

## 4. 部署两个 Edge Functions

在仓库根目录运行：

```sh
supabase functions deploy manage-push-subscription --project-ref guplutkrbjsauqijdiia
supabase functions deploy send-task-reminders --project-ref guplutkrbjsauqijdiia --no-verify-jwt
```

第一个函数保留 JWT 校验，只能由已登录用户管理自己的设备订阅。第二个函数关闭平台 JWT 校验，但代码会要求 `x-task-reminder-secret` 与 `TASK_REMINDER_CRON_SECRET` 匹配；这个共享密钥不能放在网页端。配置见 [`supabase/config.toml`](../supabase/config.toml)。

在 Edge Functions 页面确认两个函数均已部署。可用 Supabase Dashboard Functions 日志检查启动错误；不要把完整 Push endpoint 或订阅密钥复制到公开日志/工单。

## 5. 在 Vault 建立 Cron 所需的机密

Dashboard → Database → Vault → Add Secret，创建以下名称：

| Vault 名称 | 值 |
| --- | --- |
| `task_note_project_url` | `https://guplutkrbjsauqijdiia.supabase.co` |
| `task_note_supabase_secret_key` | Dashboard → Settings → API Keys 中的 Secret key（不要用 Publishable key） |
| `task_note_cron_secret` | 必须与 Edge Function secret `TASK_REMINDER_CRON_SECRET` 完全相同 |

将 Secret key 放入 Vault，而不是 SQL 文本、Git 或浏览器。Supabase 文档说明 Vault 会加密保存 secret，并通过 `vault.decrypted_secrets` 在 SQL 中按需读取。

确认 Database → Extensions 已启用 `pg_cron`、`pg_net` 与 Supabase Vault。然后在 SQL Editor 执行以下脚本。它先删除同名 Cron job，再建立每分钟调用，避免重复创建调度任务：

```sql
select cron.unschedule(jobid)
from cron.job
where jobname = 'task-note-send-task-reminders';

select cron.schedule(
  'task-note-send-task-reminders',
  '* * * * *',
  $$
    select net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'task_note_project_url'
      ) || '/functions/v1/send-task-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'task_note_supabase_secret_key'
        ),
        'x-task-reminder-secret', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'task_note_cron_secret'
        )
      ),
      body := jsonb_build_object('scheduled_at', now())
    ) as request_id;
  $$
);
```

查看是否只存在一个启用的 job：

```sql
select jobname, schedule, active
from cron.job
where jobname = 'task-note-send-task-reminders';
```

预期 `schedule` 为 `* * * * *`，`active` 为 `true`。可在 `cron.job_run_details` 查看每分钟调度的执行结果。

## 6. 检查登录跳转域名

Supabase Dashboard → Authentication → URL Configuration：

- Site URL 设置为 `https://task-note-public-20261025.deep-dune-0765.chatgpt.site/`。
- Redirect URLs 加入 `https://task-note-public-20261025.deep-dune-0765.chatgpt.site/**`。
- 如果要从本机测试，再单独加入本机开发地址；不要用通配符开放不相关域名。

## 7. 端到端验收与发布

1. 先确认迁移、Secrets、两个函数、Cron job 和 Auth URL 均已完成。
2. 在支持 Web Push 的 HTTPS 浏览器打开 TaskNote，登录并等待“数据同步完成”。
3. 进入“数据管理”→“网页关闭后提醒”，点击“开启本设备提醒”并接受浏览器通知权限。每台设备和每个浏览器分别授权。
4. 新建一条几分钟后到期、选择“到期时”提醒的临时待办；确认它已完成云端同步。关闭 TaskNote 页面，等待通知。Cron 每分钟运行，因此可晚于设定时间一到数分钟；通知只显示“有一项待办即将到期”。
5. 点击通知应打开或聚焦 TaskNote。再回到设置中关闭提醒，确认本设备订阅已移除。
6. 通过验收后，再把最新静态文件发布到公开 Site。通知授权、已登录账号和所有待办标题都留在用户的浏览器/Supabase 用户数据里；推送不广播给 Site 的其他访客。

如果测试时函数返回 401，检查 `verify_jwt` 是否与两个函数的配置一致、`TASK_REMINDER_CRON_SECRET` 与 Vault 中的同名共享值是否相同，以及 Cron 请求是否带有 `apikey` 和 `x-task-reminder-secret` 两个头。若通知没有到达，先看 `cron.job_run_details`、Edge Function 日志和浏览器/操作系统通知设置。

## 官方参考

- [Supabase CLI 安装与使用](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Supabase 数据库迁移与 `db push`](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Supabase Edge Function 部署](https://supabase.com/docs/guides/functions/deploy)
- [Edge Function Secrets](https://supabase.com/docs/guides/functions/secrets)
- [使用 pg_cron 与 pg_net 调度 Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [Supabase Vault](https://supabase.com/docs/guides/database/vault)
- [web-push VAPID 密钥和 CLI](https://github.com/web-push-libs/web-push#command-line)
