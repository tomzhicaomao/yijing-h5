// 易经占卜 App - 核心逻辑

let yijingData = null;

// 每日一占存储键
const DAILY_KEY = 'yijing_daily';

// 先天八卦对应表：1-8 对应 卦名
const baguaMap = {
  1: '坤', 2: '巽', 3: '离', 4: '震',
  5: '兑', 6: '坎', 7: '艮', 8: '乾'
};

// 八卦符号 Unicode
const baguaSymbols = {
  1: '☷', // 坤
  2: '☴', // 巽
  3: '☲', // 离
  4: '☳', // 震
  5: '☱', // 兑
  6: '☵', // 坎
  7: '☶', // 艮
  8: '☰'  // 乾
};

// 64卦符号表 (上卦+下卦)
const hexagramSymbols = {};

// 生成64卦符号
function initHexagramSymbols() {
  for (let shang = 1; shang <= 8; shang++) {
    for (let xia = 1; xia <= 8; xia++) {
      const id = shang * 8 + xia - 8;
      hexagramSymbols[id] = baguaSymbols[shang] + baguaSymbols[xia];
    }
  }
}
initHexagramSymbols();

// 八卦符号：yin=0 为断（阴），yin=1 为连（阳）
const baguaYinMap = {
  1: [0,0,0], // 坤
  2: [0,0,1], // 巽
  3: [0,1,0], // 离
  4: [0,1,1], // 震
  5: [1,0,0], // 兑
  6: [1,0,1], // 坎
  7: [1,1,0], // 艮
  8: [1,1,1]  // 乾
};

// 白话文翻译数据
const modernTranslations = {
  1: { // 乾
    gua_ci_modern: "大为亨通，利于坚守正道。",
    yao: [
      { yao_ci_modern: "巨龙潜伏在深渊中，暂时不宜行动。" },
      { yao_ci_modern: "巨龙出现在田野，有利于拜见伟大的人物。" },
      { yao_ci_modern: "君子整天勤奋努力，晚上依然警惕谨慎；即使有危险，也没有灾祸。" },
      { yao_ci_modern: "或者跳跃在深渊，没有灾祸。" },
      { yao_ci_modern: "巨龙飞翔在天空，有利于拜见伟大的人物。" },
      { yao_ci_modern: "巨龙飞到极高处，会有悔恨。" }
    ]
  },
  2: { // 坤
    gua_ci_modern: "极为亨通，利于像母马一样坚守正道。",
    yao: [
      { yao_ci_modern: "踩到霜就知道寒冬要来了。" },
      { yao_ci_modern: "正直方正广大，即使不熟悉也不会不利。" },
      { yao_ci_modern: "蕴含美德可以坚守正道，或者跟随君王做事，虽然没有成就但会有好的结果。" },
      { yao_ci_modern: "扎紧口袋，没有灾祸也没有赞誉。" },
      { yao_ci_modern: "黄色的下衣，非常吉祥。" },
      { yao_ci_modern: "巨龙在田野作战，它们的血是黑黄色的。" }
    ]
  },
  3: { // 屯
    gua_ci_modern: "大为亨通，利于坚守正道。不要急于前往，有利于建立诸侯。",
    yao: [
      { yao_ci_modern: "徘徊不前，利于安守正道，有利于建立诸侯。" },
      { yao_ci_modern: "骑马路途艰难，不是盗贼而是求婚者。" },
      { yao_ci_modern: "追逐鹿没有虞官帮助，只进入林中，君子应当舍弃。" },
      { yao_ci_modern: "骑马路艰难，求婚吉祥，前往没有不利的。" },
      { yao_ci_modern: "积聚财富，小事吉祥，大事凶险。" },
      { yao_ci_modern: "骑马路艰难，泣血涟涟。" }
    ]
  },
  4: { // 蒙
    gua_ci_modern: "亨通。不是我求小孩，而是小孩求我。初次占卜会告知，再三占卜就是亵渎，亵渎则不告知，利于坚守正道。",
    yao: [
      { yao_ci_modern: "启发蒙昧，利于用刑法惩罚人，脱去枷锁，前往会有遗憾。" },
      { yao_ci_modern: "包容蒙昧吉祥，娶妻吉祥，子孙能管理家业。" },
      { yao_ci_modern: "不要娶女子为妻，她见到的都是有权势的人，没有好结果。" },
      { yao_ci_modern: "困于蒙昧，遗憾。" }
    ]
  }
  // 继续添加更多卦的翻译...
};

// 加载数据
async function loadData() {
  try {
    const response = await fetch('data/yijing.json');
    const data = await response.json();
    yijingData = data.hexagrams;
    console.log(`已加载 ${yijingData.length} 卦`);
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// 起卦算法
function calculateGua(num1, num2, num3) {
  const xiaGua = (num1 % 8) || 8;
  const shangGua = (num2 % 8) || 8;
  const dongYao = ((num3 - 1) % 6) + 1;
  return { xiaGua, shangGua, dongYao };
}

// 根据上下卦找对应卦
function findHexagram(xiaGua, shangGua) {
  const hexagramId = shangGua * 8 + xiaGua - 8;
  return yijingData.find(g => g.id === hexagramId) || yijingData[0];
}

// 渲染八卦图形
function renderGuaLines(xiaGua, shangGua) {
  const container = document.createElement('div');
  container.className = 'gua-lines';
  
  const xiaYin = baguaYinMap[xiaGua];
  const shangYin = baguaYinMap[shangGua];
  
  const allYin = [...shangYin, ...xiaYin];
  
  allYin.forEach(yin => {
    const line = document.createElement('div');
    line.className = 'gua-line' + (yin === 0 ? ' broken' : '');
    container.appendChild(line);
  });
  
  return container;
}

// 显示结果
function showResult(hexagram, xiaGua, shangGua, dongYao) {
  // 获取白话文翻译
  const trans = modernTranslations[hexagram.id] || {};
  
  // 显示卦信息
  document.getElementById('guaName').textContent = hexagram.name;
  
  // 卦辞
  document.getElementById('guaCi').textContent = hexagram.gua_ci;
  document.getElementById('guaCiModern').textContent = trans.gua_ci_modern || '';
  
  // 动爻
  const dongYaoData = hexagram.yao.find(y => y.position === dongYao);
  const dongTrans = trans.yao && trans.yao[dongYao - 1];
  document.getElementById('dongYao').textContent = dongYaoData ? `第${dongYao}爻：${dongYaoData.yao_ci}` : '';
  document.getElementById('dongYaoModern').textContent = dongTrans ? dongTrans.yao_ci_modern : '';
  
  // 渲染八卦图形
  const guaImage = document.getElementById('guaImage');
  guaImage.innerHTML = '';
  guaImage.appendChild(renderGuaLines(xiaGua, shangGua));
  const allYaoList = document.getElementById('allYaoList');
  allYaoList.innerHTML = '';
  hexagram.yao.forEach((yao, idx) => {
    const yaoTrans = trans.yao && trans.yao[yao.position - 1];
    const item = document.createElement('div');
    item.className = 'yao-item' + (yao.position === dongYao ? ' active' : '');
    item.innerHTML = `
      <div class="yao-ancient">
        <span class="yao-position">${getYaoName(yao.position)}</span>${yao.yao_ci}
      </div>
      <div class="yao-modern">${yaoTrans ? yaoTrans.yao_ci_modern : ''}</div>
    `;
    allYaoList.appendChild(item);
  });
  
  // 显示结果区域
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('actionBar').classList.remove('hidden');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
  
  // 保存历史记录
  if (typeof saveHistory === 'function') {
    saveHistory(hexagram, xiaGua, shangGua, dongYao);
  }
  
  // 添加解卦区域
  addInterpretation(hexagram, dongYao);
}

// 解卦分析
function addInterpretation(hexagram, dongYao) {
  let existing = document.getElementById('interpretation');
  if (existing) existing.remove();
  
  const interpretations = getHexagramInterpretation(hexagram.id, dongYao);
  
  const div = document.createElement('div');
  div.id = 'interpretation';
  div.className = 'result-card';
  div.innerHTML = `
    <div class="result-header">
      <div class="gua-name" style="font-size:1.2rem;margin-bottom:10px;">📖 解卦分析</div>
    </div>
    <div class="content-section">
      <div class="section-title">整体运势</div>
      <div class="text-content">
        <div class="text-modern">${interpretations.overall}</div>
      </div>
    </div>
    <div class="content-section">
      <div class="section-title">事业发展</div>
      <div class="text-content">
        <div class="text-modern">${interpretations.career}</div>
      </div>
    </div>
    <div class="content-section">
      <div class="section-title">财运分析</div>
      <div class="text-content">
        <div class="text-modern">${interpretations.fortune}</div>
      </div>
    </div>
    <div class="content-section">
      <div class="section-title">爱情运势</div>
      <div class="text-content">
        <div class="text-modern">${interpretations.love}</div>
      </div>
    </div>
    <div class="content-section">
      <div class="section-title">健康提示</div>
      <div class="text-content">
        <div class="text-modern">${interpretations.health}</div>
      </div>
    </div>
    ${dongYao ? `
    <div class="content-section">
      <div class="section-title">变爻启示（第${dongYao}爻）</div>
      <div class="text-content">
        <div class="text-modern">${interpretations.change}</div>
      </div>
    </div>
    ` : ''}
  `;
  
  document.getElementById('result').appendChild(div);
}

function getHexagramInterpretation(id, dongYao) {
  const interpretations = {
    1: { overall: "乾卦象征天，代表刚健有力、纯阳至正之气。运势如飞龙在天，大吉大利，各方面都将迎来上升期。", career: "事业正处于上升通道，有贵人相助，宜把握时机积极进取，敢于承担重要任务。", fortune: "财运亨通，有意外之财的可能，但需注意合理分配，避免过度花费在享乐上。", love: "感情运势旺盛，单身者有望遇到优质对象，已有伴侣者关系更加甜蜜。", health: "身体状态良好，精力充沛，适合运动锻炼，但注意不要过度劳累。", change: "飞龙在天，利见大人。把握机遇，可成就大事。" },
    2: { overall: "坤卦象征地，代表柔顺、厚重、包容之气。运势平稳，需要以柔克刚，顺势而为。", career: "工作需要稳扎稳打，不可急于求成。多倾听他人意见，团队合作能带来更好结果。", fortune: "财运平稳，支出需有计划，适合进行长期储蓄投资。", love: "感情需要耐心经营，以真诚和包容对待对方。", health: "注意脾胃健康，饮食规律，适当散步调和身心。", change: "龙战于野，其血玄黄。需防竞争小人，以退为进。" },
    3: { overall: "屯卦象征事物初生之状态，虽有困难但前景光明。需要耐心筹备，不可冒进。", career: "创业或新项目会遇到阻碍，但这是积累经验的必要过程。", fortune: "财运初起步，投入需谨慎，小额尝试为宜。", love: "感情发展需耐心，不可急于确定关系。", health: "注意预防感冒，保持充足睡眠。", change: "乘马班如，求婚媾。把握机遇，吉祥无不利。" }
  };
  
  const default_interp = {
    overall: "此卦提醒您保持中正平和的心态，顺势而为，静待时机。",
    career: "脚踏实地做好眼前工作，积累经验等待机会。",
    fortune: "财运平稳，建议稳健理财，避免投机。",
    love: "以真诚待人，顺其自然发展。",
    health: "保持规律作息，适当运动。",
    change: "变爻带来转变，顺势而动可获吉祥。"
  };
  
  return interpretations[id] || default_interp;
}

function getYaoName(pos) {
  const names = ['初', '二', '三', '四', '五', '上'];
  return names[pos - 1];
}

// 验证输入
function validateInput(num1, num2, num3) {
  if (!num1 || !num2 || !num3) {
    alert('请输入三个数字');
    return false;
  }
  if (num1 < 100 || num1 > 999 || num2 < 100 || num2 > 999 || num3 < 100 || num3 > 999) {
    alert('请输入100-999之间的三位数');
    return false;
  }
  return true;
}

// 起卦
function startDivination() {
  const num1 = parseInt(document.getElementById('num1').value);
  const num2 = parseInt(document.getElementById('num2').value);
  const num3 = parseInt(document.getElementById('num3').value);
  
  if (!validateInput(num1, num2, num3)) return;
  
  const { xiaGua, shangGua, dongYao } = calculateGua(num1, num2, num3);
  const hexagram = findHexagram(xiaGua, shangGua);
  
  showResult(hexagram, xiaGua, shangGua, dongYao);
}

// 随机起卦
function randomDivination() {
  const num1 = Math.floor(Math.random() * 900) + 100;
  const num2 = Math.floor(Math.random() * 900) + 100;
  const num3 = Math.floor(Math.random() * 900) + 100;
  
  document.getElementById('num1').value = num1;
  document.getElementById('num2').value = num2;
  document.getElementById('num3').value = num3;
  
  const { xiaGua, shangGua, dongYao } = calculateGua(num1, num2, num3);
  const hexagram = findHexagram(xiaGua, shangGua);
  
  showResult(hexagram, xiaGua, shangGua, dongYao);
}

// 重置
function reset() {
  document.getElementById('num1').value = '';
  document.getElementById('num2').value = '';
  document.getElementById('num3').value = '';
  document.getElementById('result').classList.add('hidden');
  document.getElementById('actionBar').classList.add('hidden');
  document.getElementById('num1').focus();
}

// 每日一占
function dailyDivination() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(DAILY_KEY);
  
  if (stored) {
    const data = JSON.parse(stored);
    if (data.date === today) {
      showDailyResult(data);
      return;
    }
  }
  
  // 用当天日期做种子
  const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
  const num1 = Math.floor((seed * 9301 + 49297) % 233280 / 233280 * 900) + 100;
  const num2 = Math.floor((seed * 9301 + 49297 * 2) % 233280 / 233280 * 900) + 100;
  const num3 = Math.floor((seed * 9301 + 49297 * 3) % 233280 / 233280 * 900) + 100;
  
  const { xiaGua, shangGua, dongYao } = calculateGua(num1, num2, num3);
  const hexagram = findHexagram(xiaGua, shangGua);
  const trans = modernTranslations[hexagram.id] || {};
  
  const result = {
    date: today,
    xiaGua,
    shangGua,
    dongYao,
    name: hexagram.name,
    brief: trans.gua_ci_modern ? trans.gua_ci_modern.substring(0, 25) + '...' : hexagram.gua_ci.substring(0, 25) + '...'
  };
  
  localStorage.setItem(DAILY_KEY, JSON.stringify(result));
  showDailyResult(result);
}

function showDailyResult(data) {
  const resultDiv = document.getElementById('dailyResult');
  resultDiv.classList.remove('hidden');
  document.getElementById('dailyGuaName').textContent = data.name;
  document.getElementById('dailyGuaBrief').textContent = data.brief;
}

function loadDailyResult() {
  const stored = localStorage.getItem(DAILY_KEY);
  if (!stored) return;
  
  const data = JSON.parse(stored);
  const today = new Date().toDateString();
  
  if (data.date === today) {
    showDailyResult(data);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  
  document.getElementById('startBtn').addEventListener('click', startDivination);
  document.getElementById('randomBtn').addEventListener('click', randomDivination);
  document.getElementById('resetBtn').addEventListener('click', reset);
  
  // 回车键提交
  ['num1', 'num2', 'num3'].forEach(id => {
    document.getElementById(id).addEventListener('keypress', (e) => {
      if (e.key === 'Enter') startDivination();
    });
  });
  
  loadDailyResult();
});
