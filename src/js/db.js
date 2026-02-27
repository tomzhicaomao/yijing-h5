/**
 * 易经占卜 - 数据服务模块
 * 负责 Supabase 数据库操作
 */

const DB = {
  get url() {
    return window.APP_CONFIG?.SUPABASE_URL || '';
  },
  
  get key() {
    return window.APP_CONFIG?.SUPABASE_ANON_KEY || '';
  },
  
  /**
   * 保存数据到数据库
   */
  async save(table, data) {
    if (!this.url || !this.key) {
      console.warn('数据库未配置');
      return false;
    }
    
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  },
  
  /**
   * 查询数据库
   */
  async query(table, filter = '') {
    if (!this.url || !this.key) {
      console.warn('数据库未配置');
      return [];
    }
    
    try {
      const url = filter ? `${this.url}/rest/v1/${table}?${filter}` : `${this.url}/rest/v1/${table}`;
      const response = await fetch(url, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        }
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('查询数据失败:', error);
      return [];
    }
  },
  
  /**
   * 更新数据
   */
  async update(table, id, data) {
    if (!this.url || !this.key) {
      console.warn('数据库未配置');
      return false;
    }
    
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error('更新数据失败:', error);
      return false;
    }
  }
};

// 导出
window.DB = DB;