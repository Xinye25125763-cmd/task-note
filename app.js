// ================================================================
//  SVG ICON HELPERS
// ================================================================
const ICONS = {
  check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  sun: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  edit: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  target: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  // Stat icons
  clipboard: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  pin: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  zap: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  party: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="M22 2l-2.24.75a2.9 2.9 0 00-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="M22 13l-3.26-1.09a2.97 2.97 0 00-3.58 1.47l-.37.7"/></svg>',
  // OKR icons per type
  okr_target: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  okr_rocket: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3"/></svg>',
  okr_bulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>',
  okr_chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  okr_star: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  okr_trophy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>',
};

const OKR_ICONS_KEYS = ['okr_target','okr_rocket','okr_bulb','okr_chart','okr_star','okr_trophy'];

// ================================================================
//  SUPABASE CONFIG
//  ⚠️  SECURITY NOTE: The anon key below is safe for client-side use
//  (Row Level Security must be enabled in Supabase dashboard).
//  For production, consider using environment variables via a build step.
// ================================================================
const SUPABASE_URL = 'https://pvnhxijfvjidfudqvyzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bmh4aWpmdmppZGZ1ZHF2eXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1OTE5NjIsImV4cCI6MjEwMTE2Nzk2Mn0.jVbhFo7FnPSTv5dZLcT7gJLLUaL0Vd7uh8y7llwEo5M';
let supa = null;
let currentUser = null;
let saveTimer = null;
let localSaveTimer = null;

try {
  supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch(e) {
  console.warn('Supabase init failed:', e);
  // Defer toast — DOM may not be ready yet
  setTimeout(() => {
    if (typeof showToast === 'function') showToast('云端同步服务初始化失败，数据将仅保存在本地', 'warning', 5000);
  }, 2000);
}

// ================================================================
//  DATA LAYER
// ================================================================
const STORAGE_KEY = 'tasknote_data';
const DATA_VERSION = 2; // Increment when schema changes; migration runs on load

function getDefaultData() {
  return { version: DATA_VERSION, todos: [], okrs: [], notes: [], categories: [], heatmap: {}, nextId: 1 };
}

/**
 * Migrate data to current DATA_VERSION.
 * Each case upgrades from version N to N+1.
 */
function migrateData(d) {
  const v = d.version || 1;

  // v1 → v2: add flag to todos, ensure note fields, add categories
  if (v < 2) {
    if (!d.categories) d.categories = [];
    d.notes.forEach(n => {
      if (n.pinned === undefined) n.pinned = false;
      if (n.starred === undefined) n.starred = false;
      if (n.categoryId === undefined) n.categoryId = null;
    });
    d.todos.forEach(t => {
      if (t.flag === undefined) {
        if (t.urgent && t.important) t.flag = 1;
        else if (t.urgent || t.important) t.flag = 2;
        else if (t.priority === 'high') t.flag = 1;
        else if (t.priority === 'medium') t.flag = 2;
        else t.flag = 4;
      }
    });
  }

  // Future migrations: if (v < 3) { ... }

  d.version = DATA_VERSION;
  return d;
}

function loadData() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) {
      const d = JSON.parse(r);
      return migrateData(d);
    }
  } catch(e) {
    console.error('Failed to load local data:', e);
    if (typeof showToast === 'function') showToast('本地数据读取失败，已重置为默认数据', 'error', 5000);
  }
  return getDefaultData();
}

function saveData() {
  // Debounce localStorage writes to avoid excessive I/O on every keystroke
  clearTimeout(localSaveTimer);
  localSaveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem('tasknote_last_save', Date.now().toString());
    } catch(e) {
      console.error('Local save failed:', e);
      if (typeof showToast === 'function') showToast('本地保存失败，请检查浏览器存储空间', 'error', 5000);
    }
  }, 300);

  // Debounce cloud sync
  if (currentUser && supa) {
    clearTimeout(saveTimer);
    showSyncIndicator(true);
    saveTimer = setTimeout(async () => {
      try {
        await supa.from('user_data').upsert({
          user_id: currentUser.id,
          data: data,
          updated_at: new Date().toISOString()
        });
        showSyncIndicator(false);
      } catch(e) {
        console.warn('Cloud save failed:', e);
        showSyncIndicator(false);
        showToast('云端同步失败，数据已保存到本地', 'error');
      }
    }, 800);
  }
}

let data = loadData();
function genId() { return data.nextId++; }

// ================================================================
//  AUTH
// ================================================================
let authMode = 'login';

async function loadCloudData() {
  if (!supa || !currentUser) return null;
  try {
    const { data: row, error } = await supa.from('user_data')
      .select('data').eq('user_id', currentUser.id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return row ? row.data : null;
    } catch(e) {
    console.warn('Cloud load failed:', e);
    showToast('云端数据加载失败，请检查网络连接', 'error');
    return null;
  }
}

async function syncLocalToCloud() {
  if (!supa || !currentUser) return null;
  try {
    const localData = loadData();
    const { data: row, error } = await supa.from('user_data')
      .select('data, updated_at').eq('user_id', currentUser.id).single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!row) {
      // No cloud data yet — push local
      await supa.from('user_data').upsert({
        user_id: currentUser.id,
        data: localData,
        updated_at: new Date().toISOString()
      });
      return localData;
    }

    const cloudData = row.data;
    const cloudTime = new Date(row.updated_at).getTime();
    const localTime = parseInt(localStorage.getItem('tasknote_last_save') || '0', 10);

    // Conflict detection: if cloud is newer than last local save, cloud wins
    if (cloudTime > localTime && localTime > 0) {
      showToast('检测到云端有更新的数据，已自动同步', 'info', 4000);
      return migrateData(cloudData);
    }

    return cloudData;
  } catch(e) {
    console.warn('Sync failed:', e);
    showToast('数据同步失败，请稍后重试', 'error');
    return null;
  }
}

function showAuthModal() {
  document.getElementById('auth-overlay').classList.add('show');
  setTimeout(() => document.getElementById('auth-email').focus(), 100);
}

function hideAuthModal() {
  document.getElementById('auth-overlay').classList.remove('show');
  document.getElementById('auth-error').classList.remove('show');
}

function switchAuthTab(mode) {
authMode = mode;
const isLogin = mode === 'login';
const loginTab = document.getElementById('auth-tab-login');
const registerTab = document.getElementById('auth-tab-register');
loginTab.classList.toggle('active', isLogin);
loginTab.setAttribute('aria-selected', isLogin ? 'true' : 'false');
registerTab.classList.toggle('active', !isLogin);
registerTab.setAttribute('aria-selected', !isLogin ? 'true' : 'false');
document.getElementById('auth-title').textContent = isLogin ? '登录' : '注册';
document.getElementById('auth-subtitle').textContent = isLogin ? '登录后数据将在所有设备间同步' : '注册新账号，开启云端同步';
document.getElementById('auth-confirm-field').classList.toggle('open', !isLogin);
document.getElementById('auth-submit').textContent = isLogin ? '登录' : '注册';
document.getElementById('auth-error').classList.remove('show');
}

async function handleAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl = document.getElementById('auth-error');
  const btn = document.getElementById('auth-submit');
  
  if (!email || !password) { errEl.textContent = '请填写邮箱和密码'; errEl.classList.add('show'); return; }
  if (password.length < 6) { errEl.textContent = '密码至少 6 位'; errEl.classList.add('show'); return; }
  
  if (authMode === 'register') {
    const confirm = document.getElementById('auth-confirm').value;
    if (password !== confirm) { errEl.textContent = '两次密码不一致'; errEl.classList.add('show'); return; }
  }
  
  btn.disabled = true; btn.textContent = '处理中…';
  errEl.classList.remove('show');
  
  try {
    let result;
    if (authMode === 'login') {
      result = await supa.auth.signInWithPassword({ email, password });
    } else {
      result = await supa.auth.signUp({ email, password });
      if (result.data.user && !result.data.session) {
        errEl.textContent = '注册成功！请检查邮箱验证后登录。';
        errEl.style.color = 'var(--success)'; errEl.classList.add('show');
        btn.disabled = false; btn.textContent = '注册';
        return;
      }
    }
    if (result.error) throw result.error;
    hideAuthModal();
  } catch(e) {
    errEl.textContent = e.message || '操作失败'; errEl.style.color = ''; errEl.classList.add('show');
  }
  btn.disabled = false; btn.textContent = authMode === 'login' ? '登录' : '注册';
}

async function handleLogout() {
  if (!confirm('确认登出？登出后数据将保存在本地。')) return;
  await supa.auth.signOut();
}

function updateSidebarUser() {
  const el = document.getElementById('sidebar-user');
  if (currentUser) {
    const email = currentUser.email || '';
    const name = email.split('@')[0] || '用户';
    const initial = name.charAt(0).toUpperCase();
    el.innerHTML = `
      <div class="sidebar-user-avatar">${initial}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${name}</div>
        <div class="sidebar-user-email">${email}</div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="handleLogout()" title="登出" style="color:var(--text-tertiary);padding:4px 8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>`;
  } else {
    el.innerHTML = '<button class="sidebar-login-btn" onclick="showAuthModal()">登录 / 注册</button>';
  }
}

async function onAuthChange(event, session) {
  const wasLoggedIn = !!currentUser;
  currentUser = session?.user || null;
  
  if (currentUser) {
    if (!wasLoggedIn) {
      showToast('登录成功，正在同步数据…', 'info');
      showSyncIndicator(true);
      const cloudData = await syncLocalToCloud();
      if (cloudData) {
data = migrateData(cloudData);
}
      showSyncIndicator(false);
      showToast('数据同步完成', 'success');
    }
  } else {
    if (wasLoggedIn) {
      data = loadData();
      showToast('已退出登录', 'info');
    }
  }
  updateSidebarUser();
  renderDashboard();
}

// Close auth modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('auth-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'auth-overlay') hideAuthModal();
  });
  document.getElementById('auth-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && authMode === 'login') handleAuth();
  });
  document.getElementById('auth-confirm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAuth();
  });
});

// ================================================================
//  SIDEBAR TOGGLE (mobile)
// ================================================================
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

// ================================================================
//  TOAST SYSTEM
// ================================================================
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('show'); }); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ================================================================
//  SYNC INDICATOR
// ================================================================
function showSyncIndicator(syncing) {
  const el = document.getElementById('sync-indicator');
  if (!currentUser) { el.style.display = 'none'; return; }
  el.style.display = 'inline-flex';
  el.classList.toggle('syncing', syncing);
  document.getElementById('sync-text').textContent = syncing ? '同步中…' : '已同步';
}

// ================================================================
//  UTILS
// ================================================================
function formatDate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}
function today() { return formatDate(new Date()); }

function getWeekRange() {
  const now = new Date(); const day = now.getDay() || 7;
  const start = new Date(now); start.setDate(now.getDate() - day + 1);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  return { start: formatDate(start), end: formatDate(end) };
}
function getMonthRange() {
  const now = new Date();
  return { start: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)), end: formatDate(new Date(now.getFullYear(), now.getMonth()+1, 0)) };
}
function getYearRange() {
  const y = new Date().getFullYear();
  return { start: `${y}-01-01`, end: `${y}-12-31` };
}
function isInRange(d, s, e) { return d >= s && d <= e; }

function escHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

// ================================================================
//  NAVIGATION
// ================================================================
const pageTitles = {
  dashboard: ['仪表盘', '全局概览你的任务与目标'],
  todo: ['待办事项', '高效管理你的每一项任务'],
  calendar: ['日历视图', '以日历形式查看任务分布'],
  heatmap: ['人生热力图', '记录你每一天的努力'],
  okr: ['OKR 目标', '年/季/月/周目标管理与追踪'],
  knowledge: ['知识库', '沉淀你的知识与想法'],
  settings: ['数据管理', '导入导出与系统设置']
};

function switchPage(page) {
document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
document.querySelectorAll('.nav-item').forEach(n => {
  n.classList.remove('active');
  n.setAttribute('aria-selected', 'false');
});
const pageEl = document.getElementById('page-' + page);
pageEl.classList.add('active');
const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
navItem.classList.add('active');
navItem.setAttribute('aria-selected', 'true');
const [title, sub] = pageTitles[page] || ['', ''];
document.getElementById('topbar-title').textContent = title;
document.getElementById('topbar-subtitle').textContent = sub;
if (page === 'dashboard') renderDashboard();
if (page === 'todo') renderTodos();
if (page === 'calendar') renderCalendar();
if (page === 'heatmap') renderHeatmap();
if (page === 'okr') renderOkrs();
if (page === 'knowledge') renderNotes();
// Close sidebar on mobile
if (window.innerWidth <= 768) closeSidebar();
// Scroll content to top
document.querySelector('.content').scrollTop = 0;
}

// ================================================================
//  DASHBOARD
// ================================================================
function renderDashboard() {
  const todayStr = today();
  const todayTodos = data.todos.filter(t => t.date === todayStr);
  const doneTodos = todayTodos.filter(t => t.done);
  const totalPending = data.todos.filter(t => !t.done).length;

  let streak = 0;
  const d = new Date();
  while(true) { const ds = formatDate(d); if ((data.heatmap[ds]||0) > 0) { streak++; d.setDate(d.getDate()-1); } else break; }

  const allDone = doneTodos.length === todayTodos.length && todayTodos.length > 0;

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon" style="background:${allDone ? 'var(--success-light);color:var(--success)' : 'var(--primary-light);color:var(--primary)'}">
        ${allDone ? ICONS.party : ICONS.clipboard}
      </div>
      <div class="stat-value">${doneTodos.length}/${todayTodos.length}</div>
      <div class="stat-label">今日完成</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:var(--warning-light);color:var(--warning)">${ICONS.pin}</div>
      <div class="stat-value">${totalPending}</div>
      <div class="stat-label">待办总数</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:var(--success-light);color:var(--success)">${ICONS.zap}</div>
      <div class="stat-value">${streak}</div>
      <div class="stat-label">连续打卡</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:var(--primary-light);color:var(--primary)">${ICONS.book}</div>
      <div class="stat-value">${data.notes.length}</div>
      <div class="stat-label">知识笔记</div>
    </div>`;

  // Today todos preview
  const el = document.getElementById('today-todos');
  if (todayTodos.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.sun}</div><p>今天还没有待办</p><p class="empty-sub">去待办页面添加任务吧</p></div>`;
  } else {
    el.innerHTML = todayTodos.slice(0,5).map(t => {
      const flagColors = {1:'#dc2626',2:'#f59e0b',3:'#3b82f6',4:'#94a3b8'};
      const fc = flagColors[t.flag||4];
      return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;${t.done?'opacity:0.4':''}">
        <div style="width:8px;height:8px;border-radius:50%;background:${t.done?'var(--success)':fc};flex-shrink:0"></div>
        <span style="flex:1;font-size:13px;font-weight:500;${t.done?'text-decoration:line-through;color:var(--text-tertiary)':''}">${escHtml(t.text)}</span>
        ${t.flag && t.flag < 4 ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="${fc}" stroke="${fc}" stroke-width="1.5" style="flex-shrink:0"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>` : ''}
      </div>`;
    }).join('');
  }

  // OKR preview
  const okrEl = document.getElementById('current-okrs');
  const active = data.okrs.filter(o => o.level==='month'||o.level==='quarter').slice(0,3);
  if (active.length === 0) {
    okrEl.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.target}</div><p>暂无进行中的目标</p><p class="empty-sub">去 OKR 页面创建目标</p></div>`;
  } else {
    okrEl.innerHTML = active.map(o => {
      const pct = o.krs.length ? Math.round(o.krs.reduce((s,k)=>s+k.progress,0)/o.krs.length) : 0;
      return `<div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:600">${escHtml(o.objective)}</span>
          <span style="font-size:12px;font-weight:700;color:var(--primary)">${pct}%</span>
        </div>
        <div class="okr-progress-bar" style="margin:0"><div class="okr-progress-fill" style="width:${pct}%"></div></div>
      </div>`;
    }).join('');
  }

  // Mini heatmap
  const mc = document.getElementById('mini-heatmap');
  const weeks = 16; const end2 = new Date();
  const dow = (end2.getDay()+6)%7; end2.setDate(end2.getDate()+(6-dow));
  let mh = '<div style="display:flex;gap:3px;justify-content:center">';
  for (let w = weeks-1; w >= 0; w--) {
    mh += '<div style="display:flex;flex-direction:column;gap:3px">';
    for (let dd = 0; dd < 7; dd++) {
      const date2 = new Date(end2); date2.setDate(end2.getDate() - w*7 - (6-dd));
      const ds2 = formatDate(date2); const c2 = data.heatmap[ds2]||0;
      const lv = c2===0?0:c2<=2?1:c2<=4?2:c2<=6?3:4;
      if (date2 > new Date()) mh += '<div style="width:11px;height:11px;border-radius:3px;background:transparent"></div>';
      else mh += `<div style="width:11px;height:11px;border-radius:3px;background:var(--heatmap-${lv})" title="${ds2}: ${c2}"></div>`;
    }
    mh += '</div>';
  }
  mh += '</div>';
  mc.innerHTML = mh;
}

// ================================================================
//  TODO — TickTick Style
// ================================================================
let currentTodoFilter = 'all';
let currentFlag = 4; // 1=high(red), 2=mid(orange), 3=low(blue), 4=none

const FLAG_COLORS = { 1: '#dc2626', 2: '#f59e0b', 3: '#3b82f6', 4: '#94a3b8' };
const FLAG_LABELS = { 1: '高', 2: '中', 3: '低', 4: '无' };
const FILTER_TITLES = { all: '所有', today: '今天', week: '最近 7 天', inbox: '收集箱', done: '已完成' };

function switchTodoFilter(filter) {
  currentTodoFilter = filter;
  document.querySelectorAll('.todo-sidebar-item').forEach(el => el.classList.toggle('active', el.dataset.filter === filter));
  document.getElementById('todo-filter-title').textContent = FILTER_TITLES[filter] || '所有';
  renderTodos();
}

function toggleFlagPopover(e) {
  e && e.stopPropagation();
  document.getElementById('flag-popover').classList.toggle('open');
}

function selectFlag(f) {
  currentFlag = f;
  document.querySelectorAll('.todo-flag-opt').forEach(el => el.classList.toggle('active', +el.dataset.priority === f));
  // Update the button icon color
  const btnIcon = document.getElementById('flag-btn-icon');
  if (f < 4) { btnIcon.setAttribute('fill', FLAG_COLORS[f]); btnIcon.setAttribute('stroke', FLAG_COLORS[f]); }
  else { btnIcon.setAttribute('fill', 'none'); btnIcon.setAttribute('stroke', 'currentColor'); }
  document.getElementById('flag-popover').classList.remove('open');
}

// ================================================================
//  DATE PICKER
// ================================================================
let dpYear, dpMonth; // datepicker calendar state
let dpSelectedDate = null; // selected date string 'YYYY-MM-DD'
let dpSelectedTime = null; // selected time string 'HH:mm' or null
let dpPeriodStart = null;
let dpPeriodEnd = null;
let dpCurrentTab = 'date';

function initDatePicker() {
  const n = new Date();
  dpYear = n.getFullYear();
  dpMonth = n.getMonth();
  updateDateBtnDay();
}

function updateDateBtnDay() {
  const el = document.getElementById('date-btn-day');
  if (el) el.textContent = new Date().getDate();
}

function toggleDatePicker(e) {
  e && e.stopPropagation();
  const dp = document.getElementById('todo-datepicker');
  const isOpen = dp.classList.toggle('open');
  if (isOpen) {
    // Close flag popover if open
    document.getElementById('flag-popover').classList.remove('open');
    initDatePicker();
    renderDpCalendar();
  }
}

function switchDpTab(tab) {
  dpCurrentTab = tab;
  document.querySelectorAll('.dp-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('dp-tab-date').style.display = tab === 'date' ? '' : 'none';
  document.getElementById('dp-tab-period').style.display = tab === 'period' ? '' : 'none';
  if (tab === 'period') {
    // Pre-fill period inputs
    const todayStr = today();
    if (!dpPeriodStart) document.getElementById('dp-period-start').value = todayStr;
    else document.getElementById('dp-period-start').value = dpPeriodStart;
    if (!dpPeriodEnd) document.getElementById('dp-period-end').value = todayStr;
    else document.getElementById('dp-period-end').value = dpPeriodEnd;
  }
}

function dpChangeMonth(delta) {
  dpMonth += delta;
  if (dpMonth < 0) { dpMonth = 11; dpYear--; }
  if (dpMonth > 11) { dpMonth = 0; dpYear++; }
  renderDpCalendar();
}

function dpGoToday() {
  const n = new Date();
  dpYear = n.getFullYear();
  dpMonth = n.getMonth();
  renderDpCalendar();
}

function dpShortcut(type) {
  const n = new Date();
  switch (type) {
    case 'today':
      dpSelectedDate = formatDate(n);
      break;
    case 'tomorrow': {
      const t = new Date(n); t.setDate(t.getDate() + 1);
      dpSelectedDate = formatDate(t);
      break;
    }
    case 'nextweek': {
      const t = new Date(n); t.setDate(t.getDate() + (8 - t.getDay()) % 7 || 7);
      dpSelectedDate = formatDate(t);
      break;
    }
    case 'evening':
      dpSelectedDate = formatDate(n);
      dpSelectedTime = '20:00';
      document.getElementById('dp-time-value').textContent = '20:00';
      break;
  }
  // Navigate calendar to selected month
  if (dpSelectedDate) {
    const parts = dpSelectedDate.split('-');
    dpYear = +parts[0];
    dpMonth = +parts[1] - 1;
  }
  renderDpCalendar();
  // Update shortcut highlight
  document.querySelectorAll('.dp-shortcut').forEach(el => el.classList.remove('active'));
}

function renderDpCalendar() {
  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  document.getElementById('dp-month-label').textContent = `${dpYear}年${months[dpMonth]}`;
  const container = document.getElementById('dp-days');
  const first = new Date(dpYear, dpMonth, 1);
  const last = new Date(dpYear, dpMonth + 1, 0);
  const startWd = first.getDay(); // Sunday = 0
  const todayStr = today();
  let html = '';

  // Previous month days
  const prevLast = new Date(dpYear, dpMonth, 0);
  for (let i = startWd - 1; i >= 0; i--) {
    const d = prevLast.getDate() - i;
    const ds = formatDate(new Date(dpYear, dpMonth - 1, d));
    const sel = ds === dpSelectedDate ? ' selected' : '';
    html += `<button class="dp-day other-month${sel}" onclick="dpSelectDay('${ds}')">${d}</button>`;
  }
  // Current month days
  for (let d = 1; d <= last.getDate(); d++) {
    const ds = formatDate(new Date(dpYear, dpMonth, d));
    let cls = 'dp-day';
    if (ds === todayStr) cls += ' today';
    if (ds === dpSelectedDate) cls += ' selected';
    html += `<button class="${cls}" onclick="dpSelectDay('${ds}')">${d}</button>`;
  }
  // Next month padding
  const total = startWd + last.getDate();
  const rem = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= rem; d++) {
    const ds = formatDate(new Date(dpYear, dpMonth + 1, d));
    const sel = ds === dpSelectedDate ? ' selected' : '';
    html += `<button class="dp-day other-month${sel}" onclick="dpSelectDay('${ds}')">${d}</button>`;
  }
  container.innerHTML = html;
}

function dpSelectDay(dateStr) {
  dpSelectedDate = dateStr;
  renderDpCalendar();
}

function toggleDpTimeInput() {
  const el = document.getElementById('dp-time-value');
  if (dpSelectedTime) {
    // Clear time
    dpSelectedTime = null;
    el.textContent = '';
  } else {
    // Set default time
    dpSelectedTime = '09:00';
    el.textContent = '09:00';
  }
}

function dpClear() {
  dpSelectedDate = null;
  dpSelectedTime = null;
  dpPeriodStart = null;
  dpPeriodEnd = null;
  document.getElementById('dp-time-value').textContent = '';
  document.getElementById('todo-date-btn').classList.remove('has-date');
  document.getElementById('todo-datepicker').classList.remove('open');
  renderDpCalendar();
}

function dpConfirm() {
  if (dpCurrentTab === 'period') {
    dpPeriodStart = document.getElementById('dp-period-start').value;
    dpPeriodEnd = document.getElementById('dp-period-end').value;
    if (dpPeriodStart) dpSelectedDate = dpPeriodStart;
  }
  // Update button appearance
  const btn = document.getElementById('todo-date-btn');
  if (dpSelectedDate) {
    btn.classList.add('has-date');
  } else {
    btn.classList.remove('has-date');
  }
  document.getElementById('todo-datepicker').classList.remove('open');
}

// Close popovers on outside click
document.addEventListener('click', e => {
const pop = document.getElementById('flag-popover');
const dp = document.getElementById('todo-datepicker');
if (pop && !e.target.closest('.todo-input-wrap')) pop.classList.remove('open');
if (dp && !e.target.closest('.todo-input-wrap')) dp.classList.remove('open');
});

function addTodo() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) return;
  const todayStr = today();
  const todoDate = dpSelectedDate || todayStr;
  data.todos.push({
    id: genId(), text, flag: currentFlag,
    date: todoDate, time: dpSelectedTime || null,
    done: false, createdAt: new Date().toISOString()
  });
  data.heatmap[todayStr] = (data.heatmap[todayStr]||0) + 1;
  saveData(); input.value = ''; selectFlag(4); dpClear(); renderTodos(); updateBadge();
}

function toggleTodo(id) {
  const t = data.todos.find(t => t.id === id);
  if (t) { t.done = !t.done; saveData(); renderTodos(); updateBadge(); }
}

function deleteTodo(id) {
  data.todos = data.todos.filter(t => t.id !== id);
  saveData(); renderTodos(); updateBadge();
}

function getFilteredTodos() {
  const todayStr = today();
  const now = new Date();
  switch (currentTodoFilter) {
    case 'today': return data.todos.filter(t => t.date === todayStr && !t.done);
    case 'week': {
      const d7 = new Date(now); d7.setDate(d7.getDate() + 7);
      const end = formatDate(d7);
      return data.todos.filter(t => !t.done && t.date >= todayStr && t.date <= end);
    }
    case 'inbox': return data.todos.filter(t => !t.done && (!t.flag || t.flag === 4));
    case 'done': return data.todos.filter(t => t.done);
    default: return data.todos;
  }
}

function renderFlagIcon(flag, size) {
  size = size || 14;
  if (!flag || flag >= 4) return '';
  const c = FLAG_COLORS[flag];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;
}

function renderTodoItem(t) {
  const todayStr = today();
  const isOverdue = !t.done && t.date < todayStr;
  return `<div class="todo-item ${t.done?'done':''}">
    <div class="todo-checkbox ${t.done?'checked':''}" onclick="toggleTodo(${t.id})">${t.done?ICONS.check:''}</div>
    <span class="todo-text">${escHtml(t.text)}</span>
    <span class="todo-flag-icon">${renderFlagIcon(t.flag)}</span>
    <span class="todo-meta">
      <span class="todo-date${isOverdue?' overdue':''}">${t.date}</span>
    </span>
    <button class="todo-delete" onclick="deleteTodo(${t.id})">×</button>
  </div>`;
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  const todos = getFilteredTodos();
  const sorted = [...todos].sort((a,b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    // Sort by flag priority: 1 > 2 > 3 > 4
    const fa = a.flag || 4, fb = b.flag || 4;
    if (fa !== fb) return fa - fb;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (sorted.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.edit}</div><p>暂无待办事项</p><p class="empty-sub">在上方输入框添加新任务</p></div>`;
  } else {
    // Group: overdue first, then active, then done
    const todayStr = today();
    const overdue = sorted.filter(t => !t.done && t.date < todayStr);
    const active = sorted.filter(t => !t.done && t.date >= todayStr);
    const done = sorted.filter(t => t.done);
    let html = '';
    if (overdue.length > 0) {
      html += `<div class="todo-section-label"><span style="color:var(--error)">已过期</span><span class="section-count">${overdue.length}</span></div>`;
      html += overdue.map(t => renderTodoItem(t)).join('');
    }
    if (active.length > 0) {
      if (overdue.length > 0) html += `<div class="todo-section-label">待完成<span class="section-count">${active.length}</span></div>`;
      html += active.map(t => renderTodoItem(t)).join('');
    }
    if (done.length > 0 && currentTodoFilter !== 'done') {
      html += `<div class="todo-section-label" style="color:var(--text-tertiary)">已完成<span class="section-count">${done.length}</span></div>`;
      html += done.map(t => renderTodoItem(t)).join('');
    } else if (currentTodoFilter === 'done') {
      html += done.map(t => renderTodoItem(t)).join('');
    }
    list.innerHTML = html;
  }
  updateSidebarCounts();
}

function updateSidebarCounts() {
  const todayStr = today();
  const now = new Date();
  const d7 = new Date(now); d7.setDate(d7.getDate() + 7);
  const end7 = formatDate(d7);
  const allUndone = data.todos.filter(t => !t.done);
  document.getElementById('filter-count-all').textContent = data.todos.length;
  document.getElementById('filter-count-today').textContent = allUndone.filter(t => t.date === todayStr).length;
  document.getElementById('filter-count-week').textContent = allUndone.filter(t => t.date >= todayStr && t.date <= end7).length;
  document.getElementById('filter-count-inbox').textContent = allUndone.filter(t => !t.flag || t.flag === 4).length;
  document.getElementById('filter-count-done').textContent = data.todos.filter(t => t.done).length;
}

function updateBadge() {
  document.getElementById('todo-badge').textContent = data.todos.filter(t => !t.done && t.date===today()).length;
}

// ================================================================
//  CALENDAR
// ================================================================
let calYear, calMonth;
function initCalendar() { const n = new Date(); calYear = n.getFullYear(); calMonth = n.getMonth(); }

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth<0) { calMonth=11; calYear--; }
  if (calMonth>11) { calMonth=0; calYear++; }
  renderCalendar();
}

function goToday() { const n = new Date(); calYear=n.getFullYear(); calMonth=n.getMonth(); renderCalendar(); }

function renderCalendar() {
  const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  document.getElementById('cal-month-label').textContent = `${calYear}年 ${months[calMonth]}`;
  const container = document.getElementById('calendar-days');
  const first = new Date(calYear, calMonth, 1);
  const last = new Date(calYear, calMonth+1, 0);
  let startWd = (first.getDay()+6)%7;
  const todayStr = today();
  let html = '';

  const prevLast = new Date(calYear, calMonth, 0);
  for (let i = startWd-1; i >= 0; i--) {
    const d = prevLast.getDate()-i;
    html += calDayHtml(d, formatDate(new Date(calYear, calMonth-1, d)), true, todayStr);
  }
  for (let d = 1; d <= last.getDate(); d++) {
    html += calDayHtml(d, formatDate(new Date(calYear, calMonth, d)), false, todayStr);
  }
  const total = startWd + last.getDate();
  const rem = total%7===0?0:7-(total%7);
  for (let d = 1; d <= rem; d++) {
    html += calDayHtml(d, formatDate(new Date(calYear, calMonth+1, d)), true, todayStr);
  }
  container.innerHTML = html;
}

function calDayHtml(day, dateStr, other, todayStr) {
  const tasks = data.todos.filter(t => t.date === dateStr);
  let cls = 'calendar-day';
  if (other) cls += ' other-month';
  if (dateStr === todayStr) cls += ' today';
  let th = '';
  tasks.slice(0,2).forEach(t => { th += `<div class="day-task">${escHtml(t.text)}</div>`; });
  if (tasks.length > 2) th += `<div class="day-more">+${tasks.length-2} 更多</div>`;
  return `<div class="${cls}" title="${dateStr}"><span class="day-num">${day}</span><div class="day-tasks">${th}</div></div>`;
}

// ================================================================
//  HEATMAP
// ================================================================
let heatmapYear;
function initHeatmap() { heatmapYear = new Date().getFullYear(); }
function changeHeatmapYear(delta) { heatmapYear += delta; renderHeatmap(); }

function renderHeatmap() {
  document.getElementById('heatmap-year-label').textContent = heatmapYear;
  const mns = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  document.getElementById('heatmap-months').innerHTML = mns.map(m=>`<span>${m}</span>`).join('');

  // Check if year has any data
  const yearKeys = Object.keys(data.heatmap).filter(k=>k.startsWith(String(heatmapYear)));
  const hasData = yearKeys.some(k => data.heatmap[k] > 0);
  const grid = document.getElementById('heatmap-grid');
  const jan1 = new Date(heatmapYear,0,1);
  const dec31 = new Date(heatmapYear,11,31);
  const startDay = (jan1.getDay()+6)%7;
  let html = '';
  let d = new Date(jan1); d.setDate(d.getDate()-startDay);
  const now = new Date();

  while (d <= dec31 || d.getDay() !== 1) {
    if ((d.getDay()+6)%7 === 0) html += '<div class="heatmap-week">';
    const ds = formatDate(d);
    const count = data.heatmap[ds]||0;
    const lv = count===0?0:count<=2?1:count<=4?2:count<=6?3:4;
    if (d.getFullYear()!==heatmapYear || d > now) {
      html += '<div class="heatmap-cell" style="background:transparent;cursor:default"></div>';
    } else {
      html += `<div class="heatmap-cell level-${lv}" onmouseenter="showTooltip(event,'${ds}: ${count} 个任务')" onmouseleave="hideTooltip()"></div>`;
    }
    if ((d.getDay()+6)%7 === 6) html += '</div>';
    d.setDate(d.getDate()+1);
    if (d > dec31 && (d.getDay()+6)%7 === 0) break;
  }
  grid.innerHTML = html;

  let total=0, activeDays=0, maxDay=0, streak=0;
  Object.keys(data.heatmap).filter(k=>k.startsWith(String(heatmapYear))).forEach(k => {
    const v = data.heatmap[k]; if (v>0) { total+=v; activeDays++; maxDay=Math.max(maxDay,v); }
  });
  const sd = new Date();
  while(true) { const sds=formatDate(sd); if (sd.getFullYear()!==heatmapYear&&streak>0) break; if ((data.heatmap[sds]||0)>0){streak++;sd.setDate(sd.getDate()-1);}else break; }

  let statsHtml = `
    <div class="heatmap-stat"><div class="hstat-value">${total}</div><div class="hstat-label">全年任务</div></div>
    <div class="heatmap-stat"><div class="hstat-value">${activeDays}</div><div class="hstat-label">活跃天数</div></div>
    <div class="heatmap-stat"><div class="hstat-value">${maxDay}</div><div class="hstat-label">单日最高</div></div>
    <div class="heatmap-stat"><div class="hstat-value">${streak}</div><div class="hstat-label">当前连续</div></div>`;
  if (!hasData) {
    statsHtml += `<div style="grid-column:1/-1;text-align:center;padding:16px 0 0">
      <p style="font-size:13px;color:var(--text-tertiary);font-weight:500">这一年还没有记录，从完成第一个待办开始点亮你的热力图吧</p>
      <span class="empty-action" onclick="switchPage('todo')">去添加任务</span>
    </div>`;
  }
  document.getElementById('heatmap-stats').innerHTML = statsHtml;
}

// ================================================================
//  OKR
// ================================================================
let currentOkrLevel = 'year';

function switchOkrLevel(level) {
currentOkrLevel = level;
document.querySelectorAll('.okr-level-tab').forEach(t => {
  const isActive = t.dataset.level === level;
  t.classList.toggle('active', isActive);
  t.setAttribute('aria-selected', isActive ? 'true' : 'false');
});
renderOkrs();
}

function showAddOkr() { document.getElementById('okr-add-area').style.display = 'block'; }
function hideAddOkr() {
  document.getElementById('okr-add-area').style.display = 'none';
  document.getElementById('okr-obj-input').value = '';
  document.getElementById('okr-desc-input').value = '';
}

function addOkr() {
  const obj = document.getElementById('okr-obj-input').value.trim();
  if (!obj) return;
  const desc = document.getElementById('okr-desc-input').value.trim();
  data.okrs.push({ id: genId(), objective: obj, description: desc, level: currentOkrLevel, krs: [], createdAt: new Date().toISOString() });
  saveData(); hideAddOkr(); renderOkrs();
}

function addKr(okrId) {
  const input = document.getElementById('kr-input-' + okrId);
  const text = input.value.trim(); if (!text) return;
  const okr = data.okrs.find(o => o.id === okrId);
  if (okr) { okr.krs.push({ id: genId(), text, progress: 0 }); saveData(); renderOkrs(); }
}

function updateKrProgress(okrId, krId, value) {
  const okr = data.okrs.find(o => o.id === okrId);
  if (okr) { const kr = okr.krs.find(k => k.id === krId); if (kr) { kr.progress = Math.min(100, Math.max(0, parseInt(value)||0)); saveData(); renderOkrs(); } }
}

function deleteOkr(okrId) {
  if (!confirm('确认删除这个目标吗？')) return;
  data.okrs = data.okrs.filter(o => o.id !== okrId); saveData(); renderOkrs();
}

function deleteKr(okrId, krId) {
  const okr = data.okrs.find(o => o.id === okrId);
  if (okr) { okr.krs = okr.krs.filter(k => k.id !== krId); saveData(); renderOkrs(); }
}

function renderOkrs() {
  const container = document.getElementById('okr-list');
  const okrs = data.okrs.filter(o => o.level === currentOkrLevel);
  if (okrs.length === 0) {
    const labels = {year:'年度',quarter:'季度',month:'月度',week:'周'};
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.target}</div><p>暂无${labels[currentOkrLevel]}目标</p><p class="empty-sub">点击"新建目标"开始规划</p></div>`;
    return;
  }
  container.innerHTML = okrs.map(o => {
    const pct = o.krs.length ? Math.round(o.krs.reduce((s,k)=>s+k.progress,0)/o.krs.length) : 0;
    const iconKey = OKR_ICONS_KEYS[o.id % OKR_ICONS_KEYS.length];
    const icon = ICONS[iconKey];
    return `<div class="okr-card">
      <div class="okr-objective">
        <div class="okr-obj-icon">${icon}</div>
        <div class="okr-obj-text"><h4>${escHtml(o.objective)}</h4>${o.description?`<p>${escHtml(o.description)}</p>`:''}</div>
        <span style="font-size:22px;font-weight:800;color:var(--primary);margin-left:auto;letter-spacing:-0.02em">${pct}%</span>
        <button class="btn btn-sm btn-ghost" onclick="deleteOkr(${o.id})" style="color:var(--text-tertiary)">×</button>
      </div>
      <div class="okr-progress-bar"><div class="okr-progress-fill" style="width:${pct}%"></div></div>
      <div class="okr-krs">${o.krs.map(kr => {
        const st = kr.progress>=100?'done':kr.progress>0?'progress':'todo';
        return `<div class="okr-kr">
          <div class="okr-kr-status ${st}"></div>
          <span class="okr-kr-text">${escHtml(kr.text)}</span>
          <input type="range" min="0" max="100" value="${kr.progress}" style="width:80px" oninput="updateKrProgress(${o.id},${kr.id},this.value)">
          <span class="okr-kr-percent">${kr.progress}%</span>
          <button class="btn btn-sm btn-ghost" onclick="deleteKr(${o.id},${kr.id})" style="color:var(--text-tertiary);padding:2px 6px">×</button>
        </div>`;
      }).join('')}</div>
      <div class="okr-add-kr">
        <input type="text" id="kr-input-${o.id}" placeholder="添加关键结果 (KR)..." onkeydown="if(event.key==='Enter')addKr(${o.id})">
        <button class="btn btn-sm btn-secondary" onclick="addKr(${o.id})">+ KR</button>
      </div>
    </div>`;
  }).join('');
}

// ================================================================
//  KNOWLEDGE BASE — Feishu-style Enhanced
// ================================================================
let currentNoteId = null;
let currentCategoryId = null; // null = all notes
let kbSortMode = 'updated'; // 'updated' | 'created' | 'title'
let kbPreviewVisible = false;

// --- Category Management ---
function showAddCategory() {
  const body = document.getElementById('kb-tree-body');
  if (body.querySelector('.kb-cat-input')) return;
  const inp = document.createElement('input');
  inp.className = 'kb-cat-input'; inp.placeholder = '输入分类名称，回车确认';
  inp.onkeydown = function(e) {
    if (e.key === 'Enter') { const name = this.value.trim(); if (name) { data.categories.push({ id: genId(), name, parentId: currentCategoryId, expanded: true }); saveData(); } this.remove(); renderCategoryTree(); }
    if (e.key === 'Escape') this.remove();
  };
  body.appendChild(inp); inp.focus();
}

function deleteCategory(catId, e) {
  e.stopPropagation();
  if (!confirm('删除此分类？分类下的笔记将移至"全部笔记"')) return;
  data.notes.forEach(n => { if (n.categoryId === catId) n.categoryId = null; });
  // Also handle child categories
  const removeChildren = (pid) => {
    const children = data.categories.filter(c => c.parentId === pid);
    children.forEach(ch => { data.notes.forEach(n => { if (n.categoryId === ch.id) n.categoryId = null; }); removeChildren(ch.id); });
    data.categories = data.categories.filter(c => c.parentId !== pid);
  };
  removeChildren(catId);
  data.categories = data.categories.filter(c => c.id !== catId);
  if (currentCategoryId === catId) currentCategoryId = null;
  saveData(); renderCategoryTree(); renderNoteList();
}

function toggleCategoryExpand(catId, e) {
  e.stopPropagation();
  const cat = data.categories.find(c => c.id === catId);
  if (cat) { cat.expanded = !cat.expanded; saveData(); renderCategoryTree(); }
}

function selectCategory(catId) {
  currentCategoryId = catId;
  document.getElementById('kb-list-title').textContent = catId === null ? '全部笔记' : (data.categories.find(c => c.id === catId)?.name || '全部笔记');
  renderCategoryTree(); renderNoteList();
}

function renderCategoryTree() {
  const body = document.getElementById('kb-tree-body');
  const noteCountMap = {};
  data.notes.forEach(n => { const cid = n.categoryId || '__all__'; noteCountMap[cid] = (noteCountMap[cid] || 0) + 1; });

  let html = `<div class="kb-tree-item ${currentCategoryId===null?'active':''} all-notes" onclick="selectCategory(null)">
    <span class="tree-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
    <span>全部笔记</span>
    <span class="tree-count">${data.notes.length}</span>
  </div>`;

  // Starred virtual category
  const starredCount = data.notes.filter(n => n.starred).length;
  if (starredCount > 0) {
    html += `<div class="kb-tree-item ${currentCategoryId==='__starred__'?'active':''}" onclick="selectCategory('__starred__')">
      <span class="tree-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
      <span>收藏笔记</span>
      <span class="tree-count">${starredCount}</span>
    </div>`;
  }

  function renderLevel(parentId) {
    const cats = data.categories.filter(c => c.parentId === parentId);
    if (cats.length === 0) return '';
    let s = '';
    cats.forEach(cat => {
      const children = data.categories.filter(c => c.parentId === cat.id);
      const hasChildren = children.length > 0;
      const count = noteCountMap[cat.id] || 0;
      const expanded = cat.expanded !== false;
      s += `<div class="kb-tree-item ${currentCategoryId===cat.id?'active':''}" onclick="selectCategory(${cat.id})">
        ${hasChildren ? `<span class="tree-chevron ${expanded?'expanded':''}" onclick="toggleCategoryExpand(${cat.id},event)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></span>` : '<span style="width:14px"></span>'}
        <span class="tree-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></span>
        <span>${escHtml(cat.name)}</span>
        <span class="tree-count">${count}</span>
      </div>`;
      if (hasChildren) {
        s += `<div class="kb-tree-children ${expanded?'':'collapsed'}">${renderLevel(cat.id)}</div>`;
      }
    });
    return s;
  }
  html += renderLevel(null);

  // Uncategorized
  const uncatCount = data.notes.filter(n => !n.categoryId).length;
  if (uncatCount > 0 && data.categories.length > 0) {
    html += `<div class="kb-tree-item ${currentCategoryId==='__uncat__'?'active':''}" onclick="selectCategory('__uncat__')" style="margin-top:8px;opacity:0.7">
      <span class="tree-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></span>
      <span>未分类</span>
      <span class="tree-count">${uncatCount}</span>
    </div>`;
  }

  body.innerHTML = html;
}

// --- Note CRUD ---
function addNote() {
  const note = {
    id: genId(), title: '无标题笔记', content: '', tags: [],
    categoryId: (currentCategoryId && typeof currentCategoryId === 'number') ? currentCategoryId : null,
    pinned: false, starred: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  data.notes.unshift(note); currentNoteId = note.id;
  saveData(); renderNotes(); renderCategoryTree(); loadNoteEditor(note);
}

function selectNote(id) {
  currentNoteId = id;
  const note = data.notes.find(n => n.id === id);
  if (note) loadNoteEditor(note);
  renderNoteList();
}

function loadNoteEditor(note) {
  document.getElementById('kb-title').value = note.title;
  document.getElementById('kb-content').value = note.content;
  renderNoteTags(note);
  updateWordCount(note);
  updateEditTime(note);
  updatePreview();
  // Update pin/star button states
  const pinBtn = document.getElementById('kb-pin-btn');
  const starBtn = document.getElementById('kb-star-btn');
  if (pinBtn) pinBtn.classList.toggle('active', !!note.pinned);
  if (starBtn) starBtn.classList.toggle('active', !!note.starred);
}

function saveCurrentNote() {
  if (!currentNoteId) return;
  const note = data.notes.find(n => n.id === currentNoteId); if (!note) return;
  note.title = document.getElementById('kb-title').value;
  note.content = document.getElementById('kb-content').value;
  note.updatedAt = new Date().toISOString();
  saveData(); renderNoteList(); updateWordCount(note); updateEditTime(note);
}

function deleteCurrentNote() {
  if (!currentNoteId) return;
  if (!confirm('确认删除这篇笔记吗？')) return;
  data.notes = data.notes.filter(n => n.id !== currentNoteId);
  currentNoteId = data.notes.length > 0 ? data.notes[0].id : null;
  saveData(); renderNotes(); renderCategoryTree();
  if (currentNoteId) loadNoteEditor(data.notes.find(n => n.id === currentNoteId));
  else { document.getElementById('kb-title').value = ''; document.getElementById('kb-content').value = ''; clearEditorFooter(); }
}

function clearEditorFooter() {
  document.getElementById('kb-word-count').innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> 0 字';
  document.getElementById('kb-edit-time').innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> --';
}

// --- Pin / Star ---
function togglePin() {
  if (!currentNoteId) return;
  const note = data.notes.find(n => n.id === currentNoteId);
  if (note) { note.pinned = !note.pinned; saveData(); renderNoteList(); document.getElementById('kb-pin-btn').classList.toggle('active', note.pinned); }
}

function toggleStar() {
  if (!currentNoteId) return;
  const note = data.notes.find(n => n.id === currentNoteId);
  if (note) { note.starred = !note.starred; saveData(); renderNoteList(); renderCategoryTree(); document.getElementById('kb-star-btn').classList.toggle('active', note.starred); }
}

function toggleNotePin(id, e) { e.stopPropagation(); const n = data.notes.find(n => n.id === id); if (n) { n.pinned = !n.pinned; saveData(); renderNoteList(); if (id === currentNoteId) document.getElementById('kb-pin-btn').classList.toggle('active', n.pinned); } }
function toggleNoteStar(id, e) { e.stopPropagation(); const n = data.notes.find(n => n.id === id); if (n) { n.starred = !n.starred; saveData(); renderNoteList(); renderCategoryTree(); if (id === currentNoteId) document.getElementById('kb-star-btn').classList.toggle('active', n.starred); } }

// --- Sort ---
function toggleSortMode() {
  const modes = ['updated', 'created', 'title'];
  const labels = { updated: '最近编辑', created: '创建时间', title: '按标题' };
  const idx = modes.indexOf(kbSortMode);
  kbSortMode = modes[(idx + 1) % modes.length];
  document.getElementById('kb-sort-label').textContent = labels[kbSortMode];
  renderNoteList();
}

function getSortedNotes(notes) {
  const sorted = [...notes];
  // Pinned notes always on top
  sorted.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (kbSortMode === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
    if (kbSortMode === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
    if (kbSortMode === 'title') return a.title.localeCompare(b.title, 'zh');
    return 0;
  });
  return sorted;
}

// --- Tags ---
function addTagToNote(tag) {
  tag = tag.trim(); if (!tag || !currentNoteId) return;
  const note = data.notes.find(n => n.id === currentNoteId);
  if (note && !note.tags.includes(tag)) { note.tags.push(tag); saveData(); renderNoteTags(note); }
}

function removeTag(tag) {
  if (!currentNoteId) return;
  const note = data.notes.find(n => n.id === currentNoteId);
  if (note) { note.tags = note.tags.filter(t => t !== tag); saveData(); renderNoteTags(note); }
}

function renderNoteTags(note) {
  const c = document.getElementById('kb-tags');
  c.innerHTML = note.tags.map(t => `<span class="kb-tag" onclick="removeTag('${escHtml(t)}')" title="点击移除">${escHtml(t)} ×</span>`).join('');
}

// --- Word Count & Edit Time ---
function updateWordCount(note) {
  const content = note.content || '';
  const chars = content.replace(/\s/g, '').length;
  document.getElementById('kb-word-count').innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${chars} 字`;
}

function updateEditTime(note) {
  const d = new Date(note.updatedAt);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  let timeStr;
  if (diff < 60) timeStr = '刚刚';
  else if (diff < 3600) timeStr = Math.floor(diff / 60) + ' 分钟前';
  else if (diff < 86400) timeStr = Math.floor(diff / 3600) + ' 小时前';
  else timeStr = d.toLocaleDateString('zh-CN');
  document.getElementById('kb-edit-time').innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${timeStr}`;
}

// --- Markdown Preview ---
function togglePreview() {
  kbPreviewVisible = !kbPreviewVisible;
  const panel = document.getElementById('kb-preview');
  const btn = document.getElementById('kb-preview-btn');
  panel.classList.toggle('visible', kbPreviewVisible);
  btn.classList.toggle('active', kbPreviewVisible);
  if (kbPreviewVisible) updatePreview();
}

function updatePreview() {
  if (!kbPreviewVisible) return;
  const content = document.getElementById('kb-content').value;
  document.getElementById('kb-preview').innerHTML = renderMarkdown(content);
}

// Allowed URL protocols for markdown links/images (XSS prevention)
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

function sanitizeUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    if (!SAFE_URL_PROTOCOLS.includes(u.protocol)) return '#';
    return u.href;
  } catch {
    return '#';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMarkdown(md) {
  if (!md) return '<p style="color:var(--text-tertiary)">预览区域</p>';
  let html = md;
  // Code blocks (must be processed first)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    '<pre><code>' + escapeHtml(code) + '</code></pre>');
  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Bold, Italic, Strikethrough
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links — sanitize URL to prevent javascript: protocol attacks
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    '<a href="' + sanitizeUrl(url) + '" target="_blank" rel="noopener noreferrer">' + text + '</a>');
  // Images — sanitize URL
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) =>
    '<img src="' + sanitizeUrl(url) + '" alt="' + escapeHtml(alt) + '">');
  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr>');
  // Unordered list
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Paragraphs (lines not already wrapped)
  html = html.replace(/^(?!<[hublop/]|<li|<hr|<pre|<blockquote)(.+)$/gm, '<p>$1</p>');
  return html;
}

// --- Rich Text Toolbar Helpers ---
function insertMd(before, after) {
  const ta = document.getElementById('kb-content');
  const start = ta.selectionStart, end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  const text = before + (selected || '文本') + after;
  ta.setRangeText(text, start, end, 'select');
  ta.focus(); saveCurrentNote(); updatePreview();
}

function insertLinePrefix(prefix) {
  const ta = document.getElementById('kb-content');
  const start = ta.selectionStart;
  const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
  ta.setRangeText(prefix, lineStart, lineStart, 'end');
  ta.focus(); saveCurrentNote(); updatePreview();
}

function insertCodeBlock() {
  const ta = document.getElementById('kb-content');
  const start = ta.selectionStart, end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  ta.setRangeText('\n```\n' + (selected || '代码') + '\n```\n', start, end, 'end');
  ta.focus(); saveCurrentNote(); updatePreview();
}

function insertHr() {
  const ta = document.getElementById('kb-content');
  const pos = ta.selectionStart;
  ta.setRangeText('\n---\n', pos, pos, 'end');
  ta.focus(); saveCurrentNote(); updatePreview();
}

// --- Filter ---
function filterNotes(query) {
  query = query.toLowerCase();
  document.querySelectorAll('.kb-note-item').forEach(item => {
    const t = (item.querySelector('h4')?.textContent || '').toLowerCase();
    const p = (item.querySelector('.note-preview')?.textContent || '').toLowerCase();
    item.style.display = (t.includes(query) || p.includes(query)) ? '' : 'none';
  });
}

// --- Render ---
function renderNotes() {
  renderCategoryTree();
  renderNoteList();
  if (currentNoteId) { const n = data.notes.find(n => n.id === currentNoteId); if (n) loadNoteEditor(n); }
  else if (data.notes.length > 0) { currentNoteId = data.notes[0].id; loadNoteEditor(data.notes[0]); }
  else { clearEditorFooter(); }
}

function renderNoteList() {
  const c = document.getElementById('kb-notes-list');
  let notes = data.notes;

  // Filter by category
  if (currentCategoryId === '__starred__') {
    notes = notes.filter(n => n.starred);
  } else if (currentCategoryId === '__uncat__') {
    notes = notes.filter(n => !n.categoryId);
  } else if (currentCategoryId !== null && typeof currentCategoryId === 'number') {
    notes = notes.filter(n => n.categoryId === currentCategoryId);
  }

  const sorted = getSortedNotes(notes);

  if (sorted.length === 0) {
    c.innerHTML = `<div class="empty-state" style="padding:24px"><div class="empty-icon">${ICONS.edit}</div><p>暂无笔记</p><p class="empty-sub">点击"新建"创建笔记</p></div>`;
    return;
  }
  c.innerHTML = sorted.map(n => {
    const preview = n.content.substring(0, 60) || '暂无内容';
    const dateStr = new Date(n.updatedAt).toLocaleDateString('zh-CN');
    const chars = (n.content || '').replace(/\s/g, '').length;
    return `<div class="kb-note-item ${n.id===currentNoteId?'active':''}" onclick="selectNote(${n.id})">
      <h4>${n.pinned?'<span class="pin-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V16a1 1 0 001 1h12a1 1 0 001-1v-.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V7a1 1 0 011-1 1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1a1 1 0 001 1 1 1 0 011 1z"/></svg></span>':''}${n.starred?'<span class="star-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>':''}${escHtml(n.title)}</h4>
      <div class="note-preview">${escHtml(preview)}</div>
      <div class="note-meta"><span>${dateStr}</span><span>${chars} 字</span></div>
      <div class="kb-note-actions">
        <button onclick="toggleNotePin(${n.id},event)" title="${n.pinned?'取消置顶':'置顶'}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V16a1 1 0 001 1h12a1 1 0 001-1v-.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V7a1 1 0 011-1 1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1a1 1 0 001 1 1 1 0 011 1z"/></svg></button>
        <button onclick="toggleNoteStar(${n.id},event)" title="${n.starred?'取消收藏':'收藏'}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
      </div>
    </div>`;
  }).join('');
}

// ================================================================
//  DATA MANAGEMENT
// ================================================================
function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `tasknote_backup_${today()}.json`; a.click(); URL.revokeObjectURL(a.href);
}

function importData(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.todos && imported.okrs && imported.notes) {
        if (confirm('导入将覆盖所有当前数据，确认继续？')) { data = imported; saveData(); location.reload(); }
      } else alert('文件格式不正确');
    } catch(err) { alert('文件解析失败：' + err.message); }
  };
  reader.readAsText(file); event.target.value = '';
}

function clearAllData() {
  if (confirm('确认清除所有数据吗？此操作不可恢复！')) {
    if (confirm('再次确认：清除后数据无法恢复，建议先导出备份。继续清除？')) {
      data = getDefaultData(); saveData(); location.reload();
    }
  }
}

// ================================================================
//  TOOLTIP
// ================================================================
function showTooltip(event, text) {
  const tip = document.getElementById('tooltip');
  tip.textContent = text; tip.style.display = 'block';
  tip.style.left = event.clientX + 12 + 'px'; tip.style.top = event.clientY - 8 + 'px';
}
function hideTooltip() { document.getElementById('tooltip').style.display = 'none'; }

// ================================================================
//  INIT
// ================================================================
async function init() {
  const now = new Date();
  const wd = ['日','一','二','三','四','五','六'];
  document.getElementById('topbar-date').textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${wd[now.getDay()]}`;
  initCalendar(); initHeatmap(); initDatePicker(); updateBadge(); renderDashboard();
  
  // Setup Supabase auth
  if (supa) {
    supa.auth.onAuthStateChange((event, session) => {
      onAuthChange(event, session);
    });
    // Check existing session
    const { data: { session } } = await supa.auth.getSession();
    if (session) {
      currentUser = session.user;
            const cloudData = await loadCloudData();
      if (cloudData) {
        data = migrateData(cloudData);
        renderDashboard();
      }
    }
    updateSidebarUser();
  }
}

init();
