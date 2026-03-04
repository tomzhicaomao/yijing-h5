/**
 * 易经占卜 - 配置文件
 * 
 * 安全说明：
 * - 此文件包含 Supabase 的 anon key，这是公开密钥
 * - anon key 可以暴露在前端，但必须配置好 RLS 策略
 * - 生产环境建议使用 Supabase Auth SDK 替代自定义用户系统
 */

window.APP_CONFIG = {
  // Supabase 配置
  SUPABASE_URL: 'https://esmgqpttyqufbqlgxslj.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_r3jfrOsF7Jtw-mjv04iMjw_y3lKKg5P',
  
  // 功能开关
  ENABLE_HISTORY: true,
  ENABLE_RECHARGE: true,
  
  // 默认积分
  DEFAULT_POINTS: 10,
  
  // 历史记录上限
  MAX_HISTORY: 50,
  
  // 缓存时间 (毫秒)
  CACHE_TTL: 24 * 60 * 60 * 1000 // 24小时
};