/**
 * 易经占卜 - 本地存储模块
 * 负责本地数据持久化
 */

const Storage = {
  KEYS: {
    USER: 'yijing_user',
    HISTORY: 'yijing_history',
    POINTS: 'yijing_points',
    DAILY: 'yijing_daily',
    CACHE: 'yijing_cache'
  },
  
  /**
   * 获取数据
   */
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('读取存储失败:', error);
      return null;
    }
  },
  
  /**
   * 保存数据
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('保存存储失败:', error);
      return false;
    }
  },
  
  /**
   * 删除数据
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除存储失败:', error);
      return false;
    }
  },
  
  /**
   * 获取用户
   */
  getUser() {
    return this.get(this.KEYS.USER);
  },
  
  /**
   * 保存用户
   */
  setUser(user) {
    return this.set(this.KEYS.USER, user);
  },
  
  /**
   * 清除用户
   */
  clearUser() {
    return this.remove(this.KEYS.USER);
  },
  
  /**
   * 获取积分
   */
  getPoints() {
    return parseInt(localStorage.getItem(this.KEYS.POINTS)) || 0;
  },
  
  /**
   * 设置积分
   */
  setPoints(points) {
    localStorage.setItem(this.KEYS.POINTS, points.toString());
    return points;
  },
  
  /**
   * 增加积分
   */
  addPoints(amount) {
    const current = this.getPoints();
    return this.setPoints(current + amount);
  },
  
  /**
   * 扣除积分
   */
  deductPoints(amount) {
    const current = this.getPoints();
    if (current < amount) return false;
    this.setPoints(current - amount);
    return true;
  },
  
  /**
   * 获取历史记录
   */
  getHistory() {
    return this.get(this.KEYS.HISTORY) || [];
  },
  
  /**
   * 添加历史记录
   */
  addHistory(item) {
    const history = this.getHistory();
    history.unshift(item);
    // 限制数量
    const max = window.APP_CONFIG?.MAX_HISTORY || 50;
    if (history.length > max) {
      history.length = max;
    }
    return this.set(this.KEYS.HISTORY, history);
  },
  
  /**
   * 清除历史记录
   */
  clearHistory() {
    return this.remove(this.KEYS.HISTORY);
  },
  
  /**
   * 获取每日运势
   */
  getDaily() {
    return this.get(this.KEYS.DAILY);
  },
  
  /**
   * 保存每日运势
   */
  setDaily(data) {
    return this.set(this.KEYS.DAILY, data);
  },
  
  /**
   * 获取缓存数据（带过期时间）
   */
  getCache(key) {
    const cache = this.get(this.KEYS.CACHE) || {};
    const item = cache[key];
    if (!item) return null;
    
    const ttl = window.APP_CONFIG?.CACHE_TTL || 24 * 60 * 60 * 1000;
    if (Date.now() - item.timestamp > ttl) {
      delete cache[key];
      this.set(this.KEYS.CACHE, cache);
      return null;
    }
    
    return item.data;
  },
  
  /**
   * 设置缓存数据
   */
  setCache(key, data) {
    const cache = this.get(this.KEYS.CACHE) || {};
    cache[key] = {
      data,
      timestamp: Date.now()
    };
    return this.set(this.KEYS.CACHE, cache);
  }
};

// 导出
window.Storage = Storage;