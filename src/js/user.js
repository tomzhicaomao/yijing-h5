/**
 * 易经占卜 - 用户模块
 * 负责用户认证和积分管理
 */

const User = {
  current: null,
  
  /**
   * 初始化用户
   */
  init() {
    this.current = Storage.getUser();
    this.updateUI();
    this.initPoints();
    return this.current;
  },
  
  /**
   * 初始化积分
   */
  initPoints() {
    if (Storage.getPoints() === 0 && !Storage.get(Storage.KEYS.POINTS)) {
      const defaultPoints = window.APP_CONFIG?.DEFAULT_POINTS || 10;
      Storage.setPoints(defaultPoints);
    }
    this.updatePointsUI();
  },
  
  /**
   * 登录
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('请输入用户名和密码');
    }
    
    const users = await DB.query('users', `username=eq.${username}`);
    
    if (!users.length || users[0].password !== btoa(password)) {
      throw new Error('用户名或密码错误');
    }
    
    this.current = {
      id: users[0].id,
      username: username
    };
    
    Storage.setUser(this.current);
    this.updateUI();
    
    // 登录后同步数据
    await this.syncData();
    
    return this.current;
  },
  
  /**
   * 同步数据（登录后拉取云端历史记录）
   */
  async syncData() {
    if (!this.isLoggedIn()) return;
    
    try {
      console.log('🔄 开始同步云端数据...');
      
      // 拉取云端历史记录
      const cloudHistory = await DB.getUserHistory(this.current.id);
      
      if (cloudHistory && cloudHistory.length > 0) {
        // 获取本地历史记录
        const localHistory = Storage.getHistory();
        
        // 合并云端和本地历史记录（以云端为主，本地补充）
        const mergedMap = new Map();
        
        // 先添加云端记录
        cloudHistory.forEach(item => {
          const localItem = {
            id: item.hex_id || Date.now(),
            hex_id: item.hexagram_id,
            hex_name: item.hexagram_name,
            hex_symbol: item.hexagram_symbol,
            time: item.created_at || new Date().toISOString(),
            ai_interpretation: item.ai_interpretation || null
          };
          mergedMap.set(item.id, localItem);
        });
        
        // 再添加本地记录（避免重复）
        localHistory.forEach(item => {
          const key = `${item.hex_id}_${item.time}`;
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        });
        
        // 转换回数组并按时间排序
        const mergedHistory = Array.from(mergedMap.values())
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 50); // 限制50条
        
        // 保存合并后的历史记录
        Storage.set(Storage.KEYS.HISTORY, mergedHistory);
        
        console.log(`✅ 同步完成，共 ${mergedHistory.length} 条历史记录`);
      }
    } catch (error) {
      console.error('数据同步失败:', error);
    }
  },
  
  /**
   * 注册
   */
  async register(username, password, confirmPassword) {
    if (!username || !password) {
      throw new Error('请输入用户名和密码');
    }
    
    if (password !== confirmPassword) {
      throw new Error('两次密码不一致');
    }
    
    if (password.length < 6) {
      throw new Error('密码至少6位');
    }
    
    const success = await DB.save('users', {
      username,
      password: btoa(password)
    });
    
    if (!success) {
      throw new Error('注册失败，用户名可能已存在');
    }
    
    return true;
  },
  
  /**
   * 登出
   */
  logout() {
    this.current = null;
    Storage.clearUser();
    this.updateUI();
  },
  
  /**
   * 检查登录状态
   */
  isLoggedIn() {
    return !!this.current;
  },
  
  /**
   * 获取积分
   */
  getPoints() {
    return Storage.getPoints();
  },
  
  /**
   * 扣除积分
   */
  deductPoints(amount = 1) {
    if (this.getPoints() < amount) {
      return false;
    }
    Storage.deductPoints(amount);
    this.updatePointsUI();
    return true;
  },
  
  /**
   * 充值积分
   */
  recharge(amount) {
    Storage.addPoints(amount);
    this.updatePointsUI();
    return this.getPoints();
  },
  
  /**
   * 更新用户界面
   */
  updateUI() {
    const userBar = document.getElementById('userBar');
    if (!userBar) return;
    
    if (this.current) {
      userBar.innerHTML = `
        <span class="user-name">${this.current.username}</span>
        <span id="userPoints" class="points-tag"></span>
        <button class="user-btn" onclick="User.logout()">退出</button>
      `;
    } else {
      userBar.innerHTML = `
        <button class="user-btn" id="loginBtn" onclick="UI.openModal('loginModal')">登录</button>
        <span id="userPoints" class="points-tag" style="margin-left:10px;"></span>
      `;
    }
    
    this.updatePointsUI();
  },
  
  /**
   * 更新积分显示
   */
  updatePointsUI() {
    const pointsEl = document.getElementById('userPoints');
    if (pointsEl) {
      const points = this.getPoints();
      pointsEl.innerHTML = `<span onclick="UI.openModal('rechargeModal')" style="cursor:pointer;">💎 ${points} 积分</span>`;
    }
  }
};

// 导出
window.User = User;