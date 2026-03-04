// 易经占卜 - 配置模块
export const CONFIG = {
  // Supabase 配置 - 从环境变量读取
  get DB_URL() {
    return import.meta.env.VITE_SUPABASE_URL || '';
  },
  get DB_KEY() {
    return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  },
  
  // 本地存储键名
  KEYS: {
    USER: 'yijing_user',
    HISTORY: 'yijing_history',
    POINTS: 'yijing_points',
    DAILY: 'yijing_daily'
  },
  
  // 默认积分
  DEFAULT_POINTS: 10,
  
  // 八卦符号
  BAGUA: ['', '☷', '☴', '☲', '☳', '☱', '☵', '☶', '☰']
};

// 数据库操作
export async function saveDB(table, data) {
  const url = CONFIG.DB_URL;
  const key = CONFIG.DB_KEY;
  if (!url || !key) {
    console.warn('Supabase 未配置，跳过数据库操作');
    return false;
  }
  try {
    const r = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(data)
    });
    return r.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function queryDB(table, filter) {
  const url = CONFIG.DB_URL;
  const key = CONFIG.DB_KEY;
  if (!url || !key) {
    console.warn('Supabase 未配置，返回空数据');
    return [];
  }
  try {
    const r = await fetch(`${url}/rest/v1/${table}?${filter}`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    return r.ok ? await r.json() : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
