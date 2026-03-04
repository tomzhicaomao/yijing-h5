/**
 * 易经占卜 - UI模块
 * 负责界面交互和弹窗管理
 */

const UI = {
  /**
   * 显示Toast提示
   */
  toast(message, duration = 2000) {
    // 移除已有的toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), duration);
  },
  
  /**
   * 打开弹窗
   */
  openModal(id) {
    document.getElementById(id)?.classList.add('show');
  },
  
  /**
   * 关闭弹窗
   */
  closeModal(id) {
    document.getElementById(id)?.classList.remove('show');
  },
  
  /**
   * 显示加载状态
   */
  showLoading(element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (element) {
      element.dataset.originalText = element.textContent;
      element.disabled = true;
      element.innerHTML = '<span class="loading"></span>';
    }
  },
  
  /**
   * 隐藏加载状态
   */
  hideLoading(element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (element && element.dataset.originalText) {
      element.disabled = false;
      element.textContent = element.dataset.originalText;
    }
  },
  
  /**
   * 平滑滚动到元素
   */
  scrollTo(element, offset = 0) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },
  
  /**
   * 显示结果
   */
  showResult(hex, dongYao) {
    const result = document.getElementById('result');
    if (!result) return;
    
    // 卦名和符号
    document.getElementById('guaName').textContent = hex.name;
    document.getElementById('guaSymbol').textContent = Yijing.getSymbol(hex.id);
    
    // 卦辞
    document.getElementById('guaCi').textContent = hex.gua_ci;
    
    // 动爻
    const dyao = hex.yao?.find(y => y.position === dongYao);
    document.getElementById('dongYao').textContent = dyao ? `第${dongYao}爻：${dyao.yao_ci}` : '';
    
    // 六爻列表
    const yaoList = document.getElementById('yaoList');
    const positions = ['初', '二', '三', '四', '五', '上'];
    yaoList.innerHTML = hex.yao?.map(y => `
      <div class="yao-item${y.position === dongYao ? ' active' : ''}">
        <div class="yao-pos">${positions[y.position - 1]}爻</div>
        <div class="ancient" style="font-size:13px;">${y.yao_ci}</div>
      </div>
    `).join('') || '';
    
    // 解读
    const interp = Yijing.getInterpretation(hex.id, dongYao);
    document.getElementById('interpContent').innerHTML = `
      <div class="interp-item"><div class="interp-label">📖 整体运势</div><div class="interp-text">${interp.overall}</div></div>
      <div class="interp-item"><div class="interp-label">💼 事业发展</div><div class="interp-text">${interp.career}</div></div>
      <div class="interp-item"><div class="interp-label">💰 财运</div><div class="interp-text">${interp.fortune}</div></div>
      <div class="interp-item"><div class="interp-label">💕 爱情</div><div class="interp-text">${interp.love}</div></div>
      <div class="interp-item"><div class="interp-label">❤️ 健康</div><div class="interp-text">${interp.health}</div></div>
      ${dongYao ? `<div class="interp-item"><div class="interp-label">⚡ 变爻启示</div><div class="interp-text">${interp.change}</div></div>` : ''}
    `;
    
    result.classList.add('show');
    this.scrollTo(result, 20);
  },
  
  /**
   * 隐藏结果
   */
  hideResult() {
    document.getElementById('result')?.classList.remove('show');
  },
  
  /**
   * 显示每日运势
   */
  showDaily(data) {
    document.getElementById('dailyGuaName').textContent = `${data.symbol || '☰☷'} ${data.name || '—'}`;
    document.getElementById('dailyGuaBrief').textContent = data.brief || '点击查看详情';
    document.getElementById('dailyResult')?.classList.add('show');
  },
  
  /**
   * 更新历史列表
   */
  updateHistoryList() {
    const history = Storage.getHistory();
    const container = document.getElementById('historyList');
    if (!container) return;
    
    if (!history.length) {
      container.innerHTML = '<div class="empty-text">暂无占卜记录</div>';
      return;
    }
    
    container.innerHTML = history.map(h => `
      <div class="history-item" onclick="App.showHistoryDetail(${h.hex_id}, '${h.hex_name}')">
        <div class="history-date">${new Date(h.time).toLocaleString('zh-CN')}</div>
        <div class="history-gua">${h.hex_symbol || '☰☷'} ${h.hex_name}</div>
      </div>
    `).join('');
  },
  
  /**
   * 复制文本
   */
  async copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.toast('已复制到剪贴板');
    } catch {
      this.toast('复制失败');
    }
  }
};

// 导出
window.UI = UI;