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
  },
  
  /**
   * 根据hex_id更新历史记录（用于AI解读更新）
   */
  async updateHistoryByHexId(hexId, data) {
    if (!this.url || !this.key || !User.isLoggedIn()) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.url}/rest/v1/history?hex_id=eq.${hexId}&user_id=eq.${User.current.id}`, {
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
      console.error('更新历史记录失败:', error);
      return false;
    }
  },
  
  /**
   * 获取用户历史记录
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   */
  async getUserHistory(userId, limit = 50) {
    if (!this.url || !this.key) {
      console.warn('数据库未配置');
      return [];
    }
    
    try {
      const url = `${this.url}/rest/v1/history?user_id=eq.${userId}&order=created_at.desc&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        }
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('获取用户历史失败:', error);
      return [];
    }
  },
  
  /**
   * 批量保存历史记录
   */
  async saveHistoryBatch(records) {
    if (!this.url || !this.key || !records.length) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.url}/rest/v1/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(records)
      });
      return response.ok;
    } catch (error) {
      console.error('批量保存历史失败:', error);
      return false;
    }
  },
  
  /**
   * 删除数据
   */
  async delete(table, filter) {
    if (!this.url || !this.key) {
      console.warn('数据库未配置');
      return false;
    }
    
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}?${filter}`, {
        method: 'DELETE',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('删除数据失败:', error);
      return false;
    }
  }
};

// 导出
window.DB = DB;