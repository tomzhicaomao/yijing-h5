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
  const symbol = hexagramSymbols[hexagram.id] || '☰☷';
  document.getElementById('guaName').textContent = symbol + ' ' + hexagram.name;
  
  // 卦辞
  document.getElementById('guaCi').textContent = hexagram.gua_ci;
  document.getElementById('guaCiModern').textContent = trans.gua_ci_modern || '暂无白话文翻译';
  
  // 动爻
  const dongYaoData = hexagram.yao.find(y => y.position === dongYao);
  const dongTrans = trans.yao && trans.yao[dongYao - 1];
  document.getElementById('dongYao').textContent = dongYaoData ? `第${dongYao}爻：${dongYaoData.yao_ci}` : '';
  document.getElementById('dongYaoModern').textContent = dongTrans ? dongTrans.yao_ci_modern : '暂无白话文翻译';
  
  // 渲染八卦图形
  const guaImage = document.getElementById('guaImage');
  guaImage.innerHTML = '';
  guaImage.appendChild(renderGuaLines(xiaGua, shangGua));
  
  // 全部爻
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
      <div class="yao-modern">${yaoTrans ? yaoTrans.yao_ci_modern : '暂无白话文翻译'}</div>
    `;
    allYaoList.appendChild(item);
  });
  
  // 显示结果区域
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('actionBar').classList.remove('hidden');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
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
