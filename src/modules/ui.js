// 易经占卜 - UI模块
import { getPoints, setPoints, updatePointsUI, doLogin, doRegister, initUser } from './user.js';
import { loadData, calculateGua, findHexagram, getInterp, getSymbol, getYijingData } from './divination.js';
import { saveHistory, getHistoryList, showHistoryList } from './history.js';

// 初始化背景
export function initBackground() {
  const bg = document.getElementById('bg');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    bg.appendChild(s);
  }
}

// 初始化应用
export function initApp() {
  // 加载每日
  const dk = 'yijing_daily';
  const ds = localStorage.getItem(dk);
  if (ds) {
    const d = JSON.parse(ds);
    if (d.date === new Date().toDateString()) showDaily(d);
  }
}

// 全局函数绑定
function $(id) { return document.getElementById(id); }

window.openLogin = () => $('loginModal').classList.add('show');
window.openRegister = () => $('registerModal').classList.add('show');
window.openHistory = () => { showHistoryList(); $('historyModal').classList.add('show'); };
window.closeModal = (id) => $(id).classList.remove('show');

// 点击空白关闭弹窗
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('show');
  });
});

let isLogin = true;
window.toggleAuth = () => {
  window.closeModal('loginModal');
  if (isLogin) window.openRegister();
  else window.openLogin();
  isLogin = !isLogin;
};

// 充值
window.showRecharge = () => {
  $('rechargeBalance').textContent = getPoints();
  $('rechargeModal').classList.add('show');
};

window.doRecharge = (points, price) => {
  const current = getPoints();
  setPoints(current + points);
  updatePointsUI();
  $('rechargeBalance').textContent = getPoints();
  alert(`充值成功！+${points}积分`);
};

// 登录注册
window.doLogin = async () => {
  const u = $('username').value.trim();
  const p = $('password').value;
  const ok = await doLogin(u, p);
  if (ok) {
    window.closeModal('loginModal');
    $('username').value = '';
    $('password').value = '';
  }
};

window.doRegister = async () => {
  const u = $('regUser').value.trim();
  const p = $('regPass').value;
  const p2 = $('regPass2').value;
  const ok = await doRegister(u, p, p2);
  if (ok) {
    window.closeModal('registerModal');
    window.openLogin();
  }
};

// 起卦
window.doDivination = () => {
  const pts = getPoints();
  if (pts < 1) {
    alert('积分不足！请先充值');
    window.showRecharge();
    return;
  }
  
  const data = getYijingData();
  if (!data || !data.length) {
    alert('数据加载中，请稍等片刻再试');
    loadData();
    return;
  }
  
  const n1 = parseInt($('num1').value);
  const n2 = parseInt($('num2').value);
  const n3 = parseInt($('num3').value);
  
  if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
    alert('请输入三个数字');
    $('num1').focus();
    return;
  }
  if (n1 < 100 || n1 > 999 || n2 < 100 || n2 > 999 || n3 < 100 || n3 > 999) {
    alert('请输入100-999之间的数字');
    $('num1').focus();
    return;
  }
  
  const { xiaGua, shangGua, dongYao } = calculateGua(n1, n2, n3);
  const hex = findHexagram(xiaGua, shangGua);
  
  setPoints(pts - 1);
  updatePointsUI();
  
  showResult(hex, dongYao);
  saveHistory(hex);
};

window.doRandom = () => {
  const data = getYijingData();
  if (!data || !data.length) {
    alert('数据加载中，请稍等片刻再试');
    loadData();
    return;
  }
  
  $('num1').value = Math.floor(Math.random() * 900) + 100;
  $('num2').value = Math.floor(Math.random() * 900) + 100;
  $('num3').value = Math.floor(Math.random() * 900) + 100;
  window.doDivination();
};

window.doReset = () => {
  $('num1').value = '';
  $('num2').value = '';
  $('num3').value = '';
  $('result').classList.remove('show');
  $('num1').focus();
};

// 每日
window.doDaily = async () => {
  const pts = getPoints();
  if (pts < 1) {
    alert('积分不足！请先充值');
    window.showRecharge();
    return;
  }
  
  let data = getYijingData();
  if (!data || !data.length) {
    data = await loadData();
    if (!data || !data.length) {
      alert('数据加载失败，请刷新页面重试');
      return;
    }
  }
  
  const key = 'yijing_daily';
  const today = new Date().toDateString();
  const stored = localStorage.getItem(key);
  
  if (stored) {
    const d = JSON.parse(stored);
    if (d.date === today) {
      showDaily(d);
      return;
    }
  }
  
  const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
  const n1 = Math.floor((seed * 9301 + 49297) % 233280 / 233280 * 900) + 100;
  const n2 = Math.floor((seed * 9301 + 49297 * 2) % 233280 / 233280 * 900) + 100;
  
  const { xiaGua, shangGua } = calculateGua(n1, n2, 0);
  const hex = findHexagram(xiaGua, shangGua);
  
  setPoints(pts - 1);
  updatePointsUI();
  
  const d = {
    date: today,
    name: hex.name,
    id: hex.id,
    symbol: getSymbol(hex.id),
    brief: hex.gua_ci ? hex.gua_ci.substring(0, 20) : ''
  };
  localStorage.setItem(key, JSON.stringify(d));
  showDaily(d);
};

function showDaily(d) {
  $('dailyGuaName').textContent = (d.symbol || '☰☷') + ' ' + (d.name || '—');
  $('dailyGuaBrief').textContent = d.brief || '点击查看详情';
  $('dailyResult').classList.add('show');
}

// 显示结果
function showResult(hex, dongYao) {
  $('guaName').textContent = hex.name;
  $('guaSymbol').textContent = getSymbol(hex.id);
  $('guaCi').textContent = hex.gua_ci;
  
  const dyao = hex.yao.find(y => y.position === dongYao);
  $('dongYao').textContent = dyao ? `第${dongYao}爻：${dyao.yao_ci}` : '';
  
  $('yaoList').innerHTML = hex.yao.map(y => `
    <div class="yao-item${y.position === dongYao ? ' active' : ''}">
      <div class="yao-pos">${['初', '二', '三', '四', '五', '上'][y.position - 1]}爻</div>
      <div class="ancient" style="font-size:13px;">${y.yao_ci}</div>
    </div>
  `).join('');
  
  const interp = getInterp(hex.id, dongYao);
  $('interpContent').innerHTML = `
    <div class="interp-item"><div class="interp-label">📖 整体运势</div><div class="interp-text">${interp.overall}</div></div>
    <div class="interp-item"><div class="interp-label">💼 事业发展</div><div class="interp-text">${interp.career}</div></div>
    <div class="interp-item"><div class="interp-label">💰 财运</div><div class="interp-text">${interp.fortune}</div></div>
    <div class="interp-item"><div class="interp-label">💕 爱情</div><div class="interp-text">${interp.love}</div></div>
    <div class="interp-item"><div class="interp-label">❤️ 健康</div><div class="interp-text">${interp.health}</div></div>
    ${dongYao ? `<div class="interp-item"><div class="interp-label">⚡ 变爻启示</div><div class="interp-text">${interp.change}</div></div>` : ''}
  `;
  
  $('result').classList.add('show');
  $('result').scrollIntoView({ behavior: 'smooth' });
}

// 历史详情
window.showHistoryDetail = (id, name) => {
  window.closeModal('historyModal');
  
  const interp = getInterp(id, 1);
  const content = `
    <div class="interp-item"><div class="interp-label">📖 整体运势</div><div class="interp-text">${interp.overall}</div></div>
    <div class="interp-item"><div class="interp-label">💼 事业发展</div><div class="interp-text">${interp.career}</div></div>
    <div class="interp-item"><div class="interp-label">💰 财运</div><div class="interp-text">${interp.fortune}</div></div>
    <div class="interp-item"><div class="interp-label">💕 爱情</div><div class="interp-text">${interp.love}</div></div>
    <div class="interp-item"><div class="interp-label">❤️ 健康</div><div class="interp-text">${interp.health}</div></div>
    <div class="interp-item"><div class="interp-label">⚡ 变爻启示</div><div class="interp-text">${interp.change}</div></div>
  `;
  
  $('historyDetailTitle').textContent = getSymbol(id) + ' ' + name;
  $('historyDetailContent').innerHTML = content;
  $('historyDetailModal').classList.add('show');
};

window.closeHistoryDetail = () => {
  $('historyDetailModal').classList.remove('show');
  showHistoryList();
  $('historyModal').classList.add('show');
};

// 分享
window.doShare = () => {
  const name = $('guaName').textContent;
  const ci = $('guaCi').textContent;
  const symbol = $('guaSymbol').textContent;
  const dongYao = $('dongYao').textContent;
  
  const text = `🧬 易经占卜结果\n\n${symbol} ${name}\n\n📜【卦辞】\n${ci}${dongYao ? '\n\n⚡【动爻】\n' + dongYao : ''}\n\n🔗 体验更多易经占卜：https://yijing-h5.vercel.app/\n\n——来自 易经占卜小程序`;
  
  if (navigator.share) {
    navigator.share({ title: `易经占卜 - ${name}`, text }).catch(() => copyText(text));
  } else {
    copyText(text);
  }
};

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板')).catch(() => alert('复制失败'));
}

// 回车事件
['num1', 'num2', 'num3'].forEach(id => {
  $(id).addEventListener('keypress', e => {
    if (e.key === 'Enter') window.doDivination();
  });
});

// 初始化用户
initUser();