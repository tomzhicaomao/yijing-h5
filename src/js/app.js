/**
 * 易经占卜 - 主应用模块
 * 版本: 1.1.0
 */

const App = {
  // 当前历史记录ID（用于AI解读更新）
  currentHistoryId: null,
  // 当前AI解读结果
  currentAIInterpretation: null,
  
  /**
   * 初始化应用
   */
  async init() {
    console.log('🧬 易经占卜 初始化...');
    
    // 初始化背景
    this.initBackground();
    
    // 初始化用户
    User.init();
    
    // 加载卦象数据
    await Yijing.loadData();
    
    // 恢复每日运势
    this.restoreDaily();
    
    // 绑定事件
    this.bindEvents();
    
    console.log('✅ 应用初始化完成');
  },
  
  /**
   * 初始化背景星星
   */
  initBackground() {
    const bg = document.getElementById('bg');
    if (!bg) return;
    
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      bg.appendChild(star);
    }
  },
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 点击弹窗背景关闭
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });
    
    // 回车键提交
    ['num1', 'num2', 'num3'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.doDivination();
        });
      }
    });
    
    // 键盘弹出处理
    if ('visualViewport' in window) {
      window.visualViewport.addEventListener('resize', () => {
        document.body.classList.toggle('keyboard-open', 
          window.visualViewport.height < window.innerHeight * 0.8);
      });
    }
    
    // 注册 Service Worker
    this.registerSW();
  },
  
  /**
   * 注册 Service Worker
   */
  async registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('sw.js');
        console.log('✅ Service Worker 注册成功');
      } catch (err) {
        console.log('Service Worker 注册失败:', err);
      }
    }
  },
  
  /**
   * 恢复每日运势
   */
  restoreDaily() {
    const daily = Storage.getDaily();
    if (daily && daily.date === new Date().toDateString()) {
      UI.showDaily(daily);
    }
  },
  
  /**
   * 执行起卦
   */
  async doDivination() {
    // 检查积分
    if (!User.deductPoints(1)) {
      UI.toast('积分不足！请先充值');
      UI.openModal('rechargeModal');
      return;
    }
    
    // 等待数据加载
    if (!Yijing.data) {
      UI.toast('数据加载中，请稍等...');
      await Yijing.loadData();
      if (!Yijing.data) {
        UI.toast('数据加载失败，请刷新页面');
        return;
      }
    }
    
    // 获取输入
    const n1 = parseInt(document.getElementById('num1').value);
    const n2 = parseInt(document.getElementById('num2').value);
    const n3 = parseInt(document.getElementById('num3').value);
    
    // 验证输入
    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
      UI.toast('请输入三个数字');
      document.getElementById('num1')?.focus();
      return;
    }
    
    if (n1 < 100 || n1 > 999 || n2 < 100 || n2 > 999 || n3 < 100 || n3 > 999) {
      UI.toast('请输入100-999之间的数字');
      document.getElementById('num1')?.focus();
      return;
    }
    
    // 计算卦象
    const { xiaGua, shangGua, dongYao } = Yijing.calculate(n1, n2, n3);
    const hex = Yijing.findHexagram(xiaGua, shangGua);
    
    if (!hex) {
      UI.toast('卦象计算失败，请重试');
      return;
    }
    
    // 显示结果
    UI.showResult(hex, dongYao);
    
    // 保存历史
    this.saveHistory(hex);
  },
  
  /**
   * 随机起卦
   */
  async doRandom() {
    if (!Yijing.data) {
      UI.toast('数据加载中，请稍等...');
      await Yijing.loadData();
    }
    
    const [n1, n2, n3] = Yijing.randomNumbers();
    document.getElementById('num1').value = n1;
    document.getElementById('num2').value = n2;
    document.getElementById('num3').value = n3;
    
    await this.doDivination();
  },
  
  /**
   * 重置
   */
  doReset() {
    document.getElementById('num1').value = '';
    document.getElementById('num2').value = '';
    document.getElementById('num3').value = '';
    UI.hideResult();
    document.getElementById('num1')?.focus();
  },
  
  /**
   * 每日一卦
   */
  async doDaily() {
    // 检查积分
    if (!User.deductPoints(1)) {
      UI.toast('积分不足！请先充值');
      UI.openModal('rechargeModal');
      return;
    }
    
    // 等待数据加载
    if (!Yijing.data) {
      UI.toast('数据加载中，请稍等...');
      await Yijing.loadData();
      if (!Yijing.data) {
        UI.toast('数据加载失败，请刷新页面');
        return;
      }
    }
    
    const today = new Date().toDateString();
    const stored = Storage.getDaily();
    
    // 如果今天已经占过，直接显示
    if (stored && stored.date === today) {
      UI.showDaily(stored);
      return;
    }
    
    // 生成今日卦象
    const seed = Yijing.dailySeed();
    const n1 = Yijing.seedToNumber(seed, 1);
    const n2 = Yijing.seedToNumber(seed, 2);
    const n3 = Yijing.seedToNumber(seed, 3);
    
    const { xiaGua, shangGua } = Yijing.calculate(n1, n2, n3);
    const hex = Yijing.findHexagram(xiaGua, shangGua);
    
    if (!hex) {
      UI.toast('卦象计算失败，请重试');
      return;
    }
    
    // 保存每日运势
    const daily = {
      date: today,
      name: hex.name,
      id: hex.id,
      symbol: Yijing.getSymbol(hex.id),
      brief: hex.gua_ci?.substring(0, 20) || ''
    };
    
    Storage.setDaily(daily);
    UI.showDaily(daily);
  },
  
  /**
   * 保存历史记录
   */
  saveHistory(hex) {
    const item = {
      id: Date.now(),
      hex_id: hex.id,
      hex_name: hex.name,
      hex_symbol: Yijing.getSymbol(hex.id),
      time: new Date().toISOString(),
      ai_interpretation: null
    };
    
    // 保存当前历史ID，用于后续AI解读更新
    this.currentHistoryId = item.id;
    this.currentAIInterpretation = null;
    
    Storage.addHistory(item);
    
    // 如果已登录，同步到云端
    if (User.isLoggedIn() && window.APP_CONFIG?.ENABLE_HISTORY) {
      DB.save('history', {
        user_id: User.current.id,
        hexagram_id: hex.id,
        hexagram_name: hex.name,
        hexagram_symbol: item.hex_symbol,
        ai_interpretation: null
      });
    }
  },
  
  /**
   * 更新当前历史记录的AI解读
   * @param {string} aiInterpretation - AI解读内容
   */
  updateCurrentHistoryAI(aiInterpretation) {
    this.currentAIInterpretation = aiInterpretation;
    
    // 更新本地历史记录
    if (this.currentHistoryId) {
      Storage.updateHistoryAI(this.currentHistoryId, aiInterpretation);
      
      // 同步到云端
      if (User.isLoggedIn()) {
        DB.updateHistoryByHexId(this.currentHistoryId, { ai_interpretation: aiInterpretation });
      }
    }
  },
  
  /**
   * 显示历史详情
   */
  showHistoryDetail(id, name) {
    UI.closeModal('historyModal');
    
    // 获取历史记录详情
    const historyItem = Storage.getHistoryById(id);
    
    const interp = Yijing.getInterpretation(id, 1);
    let content = `
      <div class="interp-item"><div class="interp-label">📖 整体运势</div><div class="interp-text">${interp.overall}</div></div>
      <div class="interp-item"><div class="interp-label">💼 事业发展</div><div class="interp-text">${interp.career}</div></div>
      <div class="interp-item"><div class="interp-label">💰 财运</div><div class="interp-text">${interp.fortune}</div></div>
      <div class="interp-item"><div class="interp-label">💕 爱情</div><div class="interp-text">${interp.love}</div></div>
      <div class="interp-item"><div class="interp-label">❤️ 健康</div><div class="interp-text">${interp.health}</div></div>
      <div class="interp-item"><div class="interp-label">⚡ 变爻启示</div><div class="interp-text">${interp.change}</div></div>
    `;
    
    // 如果有AI解读，显示AI解读
    if (historyItem && historyItem.ai_interpretation) {
      content += `
        <div class="interp-item ai-section">
          <div class="interp-label">🤖 AI智能解读</div>
          <div class="interp-text ai-text">${AIInterpret.formatDisplay(historyItem.ai_interpretation)}</div>
        </div>
      `;
    }
    
    document.getElementById('historyDetailTitle').textContent = `${Yijing.getSymbol(id)} ${name}`;
    document.getElementById('historyDetailContent').innerHTML = content;
    UI.openModal('historyDetailModal');
  },
  
  /**
   * 分享卦象
   */
  async doShare() {
    const name = document.getElementById('guaName')?.textContent || '';
    const ci = document.getElementById('guaCi')?.textContent || '';
    const symbol = document.getElementById('guaSymbol')?.textContent || '';
    const dongYao = document.getElementById('dongYao')?.textContent || '';
    
    // 基础分享内容
    let text = `🧬 易经占卜结果

${symbol} ${name}

📜【卦辞】
${ci}
${dongYao ? `\n⚡【动爻】\n${dongYao}` : ''}`;
    
    // 如果有AI解读结果，添加到分享内容
    if (this.currentAIInterpretation) {
      // 清理AI解读的Markdown格式，使其更适合分享
      const cleanAI = this.currentAIInterpretation
        .replace(/\*\*([^*]+)\*\*/g, '【$1】')
        .replace(/###\s*/g, '')
        .replace(/##\s*/g, '')
        .replace(/\n{3,}/g, '\n\n');
      
      text += `\n\n🤖【AI智能解读】
${cleanAI}`;
    } else {
      // 如果没有AI解读，添加基础解读
      const hex = Yijing.getById(parseInt(name));
      if (hex) {
        const interp = Yijing.getInterpretation(hex.id, 1);
        text += `\n
📖【整体运势】
${interp.overall}

💼【事业发展】
${interp.career}

💰【财运分析】
${interp.fortune}

💕【爱情运势】
${interp.love}

❤️【健康提示】
${interp.health}

⚡【变爻启示】
${interp.change}`;
      }
    }
    
    text += `\n\n🔗 体验更多易经占卜：https://yijing-h5.vercel.app/

——来自 易经占卜小程序`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `易经占卜 - ${name}`,
          text
        });
      } catch {
        await UI.copyText(text);
      }
    } else {
      await UI.copyText(text);
    }
  },
  
  /**
   * 登录
   */
  async doLogin() {
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;
    
    try {
      await User.login(username, password);
      UI.toast('登录成功');
      UI.closeModal('loginModal');
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    } catch (err) {
      UI.toast(err.message);
    }
  },
  
  /**
   * 注册
   */
  async doRegister() {
    const username = document.getElementById('regUser')?.value.trim();
    const password = document.getElementById('regPass')?.value;
    const password2 = document.getElementById('regPass2')?.value;
    
    try {
      await User.register(username, password, password2);
      UI.toast('注册成功，请登录');
      UI.closeModal('registerModal');
      UI.openModal('loginModal');
    } catch (err) {
      UI.toast(err.message);
    }
  },
  
  /**
   * 充值
   */
  doRecharge(points) {
    const newBalance = User.recharge(points);
    document.getElementById('rechargeBalance').textContent = newBalance;
    UI.toast(`充值成功！+${points}积分`);
  },
  
  /**
   * 切换登录/注册
   */
  toggleAuth() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (loginModal?.classList.contains('show')) {
      UI.closeModal('loginModal');
      UI.openModal('registerModal');
    } else {
      UI.closeModal('registerModal');
      UI.openModal('loginModal');
    }
  }
};

// 导出
window.App = App;

// 全局快捷函数
window.$ = id => document.getElementById(id);
window.openLogin = () => UI.openModal('loginModal');
window.openHistory = () => { UI.updateHistoryList(); UI.openModal('historyModal'); };
window.closeModal = id => UI.closeModal(id);
window.doDivination = () => App.doDivination();
window.doRandom = () => App.doRandom();
window.doReset = () => App.doReset();
window.doDaily = () => App.doDaily();
window.doShare = () => App.doShare();
window.doLogin = () => App.doLogin();
window.doRegister = () => App.doRegister();
window.doRecharge = (p, _) => App.doRecharge(p);
window.toggleAuth = () => App.toggleAuth();
window.showHistoryDetail = (id, name) => App.showHistoryDetail(id, name);
window.closeHistoryDetail = () => { UI.closeModal('historyDetailModal'); UI.openModal('historyModal'); };

// 初始化
document.addEventListener('DOMContentLoaded', () => App.init());