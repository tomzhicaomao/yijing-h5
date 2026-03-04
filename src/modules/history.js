// 易经占卜 - 历史记录模块
import { CONFIG, saveDB } from './config.js';
import { getSymbol } from './divination.js';
import { getCurrentUser } from './user.js';

// 保存历史
export function saveHistory(hex) {
  const item = {
    id: Date.now(),
    hex_id: hex.id,
    hex_name: hex.name,
    hex_symbol: getSymbol(hex.id),
    time: new Date().toISOString()
  };
  
  let list = JSON.parse(localStorage.getItem(CONFIG.KEYS.HISTORY) || '[]');
  list.unshift(item);
  list = list.slice(0, 50);
  localStorage.setItem(CONFIG.KEYS.HISTORY, JSON.stringify(list));
  
  const user = getCurrentUser();
  if (user) {
    saveDB('history', {
      user_id: user.id,
      hexagram_id: hex.id,
      hexagram_name: hex.name,
      hexagram_symbol: getSymbol(hex.id)
    });
  }
}

// 获取历史列表
export function getHistoryList() {
  return JSON.parse(localStorage.getItem(CONFIG.KEYS.HISTORY) || '[]');
}

// 显示历史列表UI
export function showHistoryList() {
  const list = getHistoryList();
  const historyList = document.getElementById('historyList');
  
  if (!list.length) {
    historyList.innerHTML = '<div class="empty-text">暂无占卜记录</div>';
    return;
  }
  
  historyList.innerHTML = list.map(h => `
    <div class="history-item" onclick="window.showHistoryDetail && window.showHistoryDetail(${h.hex_id}, '${h.hex_name}')">
      <div class="history-date">${new Date(h.time).toLocaleString('zh-CN')}</div>
      <div class="history-gua">${h.hex_symbol || '☰☷'} ${h.hex_name}</div>
    </div>
  `).join('');
}