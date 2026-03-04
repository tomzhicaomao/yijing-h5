// 易经占卜 - 用户模块（使用 Supabase Auth）
import { CONFIG } from './config.js';

let currentUser = null;

// 获取 Supabase 客户端（延迟加载）
let supabaseClient = null;
async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  
  const url = CONFIG.DB_URL;
  const key = CONFIG.DB_KEY;
  if (!url || !key) return null;
  
  // 动态加载 Supabase JS 客户端
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (e) {
    console.warn('Supabase 客户端未加载，使用本地模式');
    return null;
  }
}

// 获取积分
export function getPoints() {
  return parseInt(localStorage.getItem(CONFIG.KEYS.POINTS)) || 0;
}

// 设置积分
export function setPoints(n) {
  localStorage.setItem(CONFIG.KEYS.POINTS, n);
}

// 初始化用户
export async function initUser() {
  const u = localStorage.getItem(CONFIG.KEYS.USER);
  if (u) {
    currentUser = JSON.parse(u);
    updateUserUI();
  }
  if (!localStorage.getItem(CONFIG.KEYS.POINTS)) {
    setPoints(CONFIG.DEFAULT_POINTS);
  }
  
  // 检查 Supabase 会话
  const supabase = await getSupabase();
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        username: session.user.email || session.user.id.slice(0, 8)
      };
      localStorage.setItem(CONFIG.KEYS.USER, JSON.stringify(currentUser));
    }
  }
  
  updatePointsUI();
}

// 更新积分UI
export function updatePointsUI() {
  const pts = getPoints();
  const ptsEl = document.getElementById('userPoints');
  if (ptsEl) {
    ptsEl.innerHTML = `<span onclick="window.showRecharge && window.showRecharge()" style="cursor:pointer;">💎 ${pts} 积分</span>`;
  }
}

// 更新用户UI
export function updateUserUI() {
  const userBar = document.getElementById('userBar');
  if (currentUser) {
    userBar.innerHTML = `<span class="user-name">${currentUser.username}</span><span id="userPoints" class="points-tag"></span><button class="user-btn" onclick="window.logout && window.logout()">退出</button>`;
    updatePointsUI();
  } else {
    userBar.innerHTML = '<button class="user-btn" id="loginBtn" onclick="window.openLogin && window.openLogin()">登录</button><span id="userPoints" class="points-tag" style="margin-left:10px;"></span>';
    updatePointsUI();
  }
}

// 登出
export async function logout() {
  const supabase = await getSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  currentUser = null;
  localStorage.removeItem(CONFIG.KEYS.USER);
  updateUserUI();
}

// 获取当前用户
export function getCurrentUser() {
  return currentUser;
}

// 登录 - 使用 Supabase Auth 或本地模式
export async function doLogin(username, password) {
  if (!username || !password) {
    alert('请输入用户名和密码');
    return false;
  }
  
  const supabase = await getSupabase();
  
  if (supabase) {
    // 使用 Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.includes('@') ? username : `${username}@yijing.local`,
      password: password
    });
    
    if (error) {
      alert('登录失败：' + (error.message || '用户名或密码错误'));
      return false;
    }
    
    currentUser = {
      id: data.user.id,
      username: data.user.email?.split('@')[0] || data.user.id.slice(0, 8)
    };
    localStorage.setItem(CONFIG.KEYS.USER, JSON.stringify(currentUser));
    updateUserUI();
    return true;
  } else {
    // 本地模式 - 仅检查本地存储的用户信息（演示用）
    const localUsers = JSON.parse(localStorage.getItem('yijing_local_users') || '{}');
    const user = localUsers[username];
    
    if (!user) {
      alert('用户不存在，请先注册');
      return false;
    }
    
    // 本地模式不存储密码，直接登录成功
    currentUser = { id: username, username };
    localStorage.setItem(CONFIG.KEYS.USER, JSON.stringify(currentUser));
    updateUserUI();
    return true;
  }
}

// 注册 - 使用 Supabase Auth 或本地模式
export async function doRegister(username, password, password2) {
  if (!username || !password) {
    alert('请输入用户名和密码');
    return false;
  }
  if (password !== password2) {
    alert('两次密码不一致');
    return false;
  }
  if (password.length < 6) {
    alert('密码至少6位');
    return false;
  }
  
  const supabase = await getSupabase();
  
  if (supabase) {
    // 使用 Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: username.includes('@') ? username : `${username}@yijing.local`,
      password: password
    });
    
    if (error) {
      alert('注册失败：' + (error.message || '未知错误'));
      return false;
    }
    
    alert('注册成功！请查收验证邮件（如果启用了邮箱验证）');
    return true;
  } else {
    // 本地模式 - 存储用户名（不存储密码）
    const localUsers = JSON.parse(localStorage.getItem('yijing_local_users') || '{}');
    if (localUsers[username]) {
      alert('用户名已存在');
      return false;
    }
    
    localUsers[username] = { createdAt: Date.now() };
    localStorage.setItem('yijing_local_users', JSON.stringify(localUsers));
    alert('注册成功，请登录');
    return true;
  }
}

// 导出全局函数
window.logout = logout;
