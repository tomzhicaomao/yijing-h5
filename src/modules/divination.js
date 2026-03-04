// 易经占卜 - 起卦逻辑模块
import { CONFIG } from './config.js';

let yijingData = null;

// 八卦符号
const BAGUA = CONFIG.BAGUA;

// 生成64卦符号
export function getSymbol(id) {
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      if (i * 8 + j - 8 === id) return BAGUA[i] + BAGUA[j];
    }
  }
  return '☰☷';
}

// 加载数据
export async function loadData() {
  try {
    const response = await fetch('data/yijing.json');
    const data = await response.json();
    yijingData = data.hexagrams;
    window.yijingData = yijingData;
    console.log(`已加载 ${yijingData.length} 卦`);
    return yijingData;
  } catch (error) {
    console.error('加载数据失败:', error);
    return null;
  }
}

// 起卦计算
export function calculateGua(n1, n2, n3) {
  const xiaGua = (n1 % 8) || 8;
  const shangGua = (n2 % 8) || 8;
  const dongYao = ((n3 - 1) % 6) + 1;
  return { xiaGua, shangGua, dongYao };
}

// 查找卦
export function findHexagram(xiaGua, shangGua) {
  const id = shangGua * 8 + xiaGua - 8;
  return yijingData.find(g => g.id === id) || yijingData[0];
}

// 解卦分析
export function getInterp(id, dongYao) {
  const interpretations = {
    1: { overall: "乾卦象征天，代表刚健有力、纯阳至正之气。运势如飞龙在天，大吉大利。", career: "事业正处于上升通道，有贵人相助，宜把握时机积极进取。", fortune: "财运亨通，有意外之财的可能，但需注意合理分配。", love: "感情运势旺盛，单身者有望遇到优质对象。", health: "身体状态良好，精力充沛，适合运动锻炼。", change: "飞龙在天，利见大人。把握机遇，可成就大事。" },
    2: { overall: "坤卦象征地，代表柔顺、厚重、包容之气。运势平稳，需要以柔克刚。", career: "工作需要稳扎稳打，不可急于求成。多倾听他人意见。", fortune: "财运平稳，支出需有计划，适合进行长期储蓄。", love: "感情需要耐心经营，以真诚和包容对待对方。", health: "注意脾胃健康，饮食规律，适当散步。", change: "龙战于野，其血玄黄。需防竞争小人，以退为进。" },
    // ... 其他卦的解读保留在原 app.js 中
  };
  
  return interpretations[id] || {
    overall: "此卦提醒您保持中正平和的心态，顺势而为，静待时机。",
    career: "脚踏实地做好眼前工作，积累经验等待机会。",
    fortune: "财运平稳，建议稳健理财，避免投机。",
    love: "以真诚待人，顺其自然发展。",
    health: "保持规律作息，适当运动。",
    change: "变爻带来转变，顺势而动可获吉祥。"
  };
}

// 导出数据访问
export function getYijingData() {
  return yijingData;
}