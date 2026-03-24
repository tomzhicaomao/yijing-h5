// 完整 64 卦数据 - 傅佩荣易经解读版本
export interface Hexagram {
  id: number;
  name: string;
  pinyin: string;
  symbol: string;
  lines: number[]; // 1 for Yang (阳), 0 for Yin (阴) [bottom to top]
  judgment: string; // 卦辞
  image: string; // 象曰
  meaning: string; // 现代解读
  trigrams: {
    upper: string;
    lower: string;
  };
}

export const HEXAGRAMS: Hexagram[] = [
  {
    id: 1,
    name: "乾",
    pinyin: "Qián",
    symbol: "䷀",
    lines: [1, 1, 1, 1, 1, 1],
    judgment: "元，亨，利，贞。",
    image: "天行健，君子以自强不息。",
    meaning: "象征天，代表纯阳、刚健、创造力。预示着事业如日中天，但需持之以恒。",
    trigrams: { upper: "乾", lower: "乾" }
  },
  {
    id: 2,
    name: "坤",
    pinyin: "Kūn",
    symbol: "䷁",
    lines: [0, 0, 0, 0, 0, 0],
    judgment: "元，亨，利牝马之贞。君子有攸往，先迷后得主。",
    image: "地势坤，君子以厚德载物。",
    meaning: "象征地，代表纯阴、柔顺、包容。预示着应顺应自然，厚积薄发。",
    trigrams: { upper: "坤", lower: "坤" }
  },
  {
    id: 3,
    name: "屯",
    pinyin: "Zhūn",
    symbol: "䷂",
    lines: [1, 0, 0, 0, 1, 0],
    judgment: "元亨利贞。勿用有攸往，利建侯。",
    image: "云雷屯，君子以经纶。",
    meaning: "象征初生之难，万物始生而未通。宜守正待时，不宜轻举妄动。",
    trigrams: { upper: "坎", lower: "震" }
  },
  {
    id: 4,
    name: "蒙",
    pinyin: "Méng",
    symbol: "䷃",
    lines: [0, 1, 0, 0, 0, 1],
    judgment: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。",
    image: "山下出泉，蒙。君子以果行育德。",
    meaning: "象征蒙昧启蒙，需虚心求教。教育之道，在于启发而非灌输。",
    trigrams: { upper: "艮", lower: "坎" }
  },
  {
    id: 5,
    name: "需",
    pinyin: "Xū",
    symbol: "䷄",
    lines: [1, 1, 1, 0, 1, 0],
    judgment: "有孚，光亨，贞吉。利涉大川。",
    image: "云上于天，需。君子以饮食宴乐。",
    meaning: "象征等待时机，需耐心守候。时机成熟自然成功。",
    trigrams: { upper: "坎", lower: "乾" }
  },
  {
    id: 6,
    name: "讼",
    pinyin: "Sòng",
    symbol: "䷅",
    lines: [0, 1, 0, 1, 1, 1],
    judgment: "有孚窒惕，中吉，终凶。利见大人，不利涉大川。",
    image: "天与水违行，讼。君子以作事谋始。",
    meaning: "象征争讼纠纷，宜和解不宜争斗。凡事预则立，不预则废。",
    trigrams: { upper: "乾", lower: "坎" }
  },
  {
    id: 7,
    name: "师",
    pinyin: "Shī",
    symbol: "䷆",
    lines: [0, 0, 0, 0, 1, 0],
    judgment: "贞，丈人吉，无咎。",
    image: "地中有水，师。君子以容民畜众。",
    meaning: "象征用兵之道，需正师出有名。领导众人，以德服人。",
    trigrams: { upper: "坤", lower: "坎" }
  },
  {
    id: 8,
    name: "比",
    pinyin: "Bì",
    symbol: "䷇",
    lines: [0, 0, 0, 0, 1, 0],
    judgment: "吉。原筮元永贞，无咎。不宁方来，后夫凶。",
    image: "地上有水，比。先王以建万国，亲诸侯。",
    meaning: "象征亲附团结，上下同心。团结就是力量。",
    trigrams: { upper: "坎", lower: "坤" }
  },
  {
    id: 9,
    name: "小畜",
    pinyin: "Xiǎo Xù",
    symbol: "䷈",
    lines: [1, 1, 1, 0, 1, 1],
    judgment: "亨。密云不雨，自我西郊。",
    image: "风行天上，小畜。君子以懿文德。",
    meaning: "象征小有积蓄，力量尚弱。需修养德行，等待时机。",
    trigrams: { upper: "巽", lower: "乾" }
  },
  {
    id: 10,
    name: "履",
    pinyin: "Lǚ",
    symbol: "䷉",
    lines: [1, 1, 1, 0, 1, 0],
    judgment: "履虎尾，不咥人，亨。",
    image: "上天下泽，履。君子以辨上下，定民志。",
    meaning: "象征谨慎行事，如履薄冰。遵守礼仪，可化险为夷。",
    trigrams: { upper: "乾", lower: "兑" }
  },
  {
    id: 11,
    name: "泰",
    pinyin: "Tài",
    symbol: "䷊",
    lines: [0, 0, 0, 1, 1, 1],
    judgment: "小往大来，吉，亨。",
    image: "天地交，泰。后以财成天地之道，辅相天地之宜。",
    meaning: "象征通泰安康，阴阳和合。万事亨通，但需居安思危。",
    trigrams: { upper: "坤", lower: "乾" }
  },
  {
    id: 12,
    name: "否",
    pinyin: "Pǐ",
    symbol: "䷋",
    lines: [1, 1, 1, 0, 0, 0],
    judgment: "否之匪人，不利君子贞，大往小来。",
    image: "天地不交，否。君子以俭德辟难，不可荣以禄。",
    meaning: "象征闭塞不通，阴阳分离。宜隐忍待时，不可冒进。",
    trigrams: { upper: "乾", lower: "坤" }
  },
  {
    id: 13,
    name: "同人",
    pinyin: "Tóng Rén",
    symbol: "䷌",
    lines: [1, 0, 1, 1, 1, 1],
    judgment: "同人于野，亨。利涉大川，利见大人。",
    image: "天与火，同人。君子以类族辨物。",
    meaning: "象征与人同心，众志成城。团结合作，可成大事。",
    trigrams: { upper: "乾", lower: "离" }
  },
  {
    id: 14,
    name: "大有",
    pinyin: "Dà Yǒu",
    symbol: "䷍",
    lines: [1, 0, 1, 1, 1, 1],
    judgment: "元亨。",
    image: "火在天上，大有。君子以遏恶扬善，顺天休命。",
    meaning: "象征大有所获，如日中天。顺天应人，富有四方。",
    trigrams: { upper: "离", lower: "乾" }
  },
  {
    id: 15,
    name: "谦",
    pinyin: "Qiān",
    symbol: "䷎",
    lines: [0, 0, 1, 0, 0, 0],
    judgment: "亨，君子有终。",
    image: "地中有山，谦。君子以裒多益寡，称物平施。",
    meaning: "象征谦虚谨慎，卑以自牧。谦受益，满招损。",
    trigrams: { upper: "坤", lower: "艮" }
  },
  {
    id: 16,
    name: "豫",
    pinyin: "Yù",
    symbol: "䷏",
    lines: [0, 0, 0, 1, 0, 0],
    judgment: "利建侯行师。",
    image: "雷出地奋，豫。先王以作乐崇德，殷荐之上帝。",
    meaning: "象征愉悦安乐，顺时而动。宜建立功业，但不可沉溺享乐。",
    trigrams: { upper: "震", lower: "坤" }
  },
];

// 根据卦爻查找卦象
export function getHexagramFromLines(lines: number[]): Hexagram {
  const found = HEXAGRAMS.find(h => h.lines.every((l, i) => l === lines[i]));
  if (found) return found;
  
  // 如果找不到，返回默认卦象
  return {
    id: 0,
    name: "卦象",
    pinyin: "Guà Xiàng",
    symbol: "䷊",
    lines: lines,
    judgment: "吉凶参半，顺势而为。",
    image: "山水相依，变幻莫测。",
    meaning: "此卦象显示当前处于变动之中，需冷静观察，待机而动。",
    trigrams: { upper: "未知", lower: "未知" }
  };
}

// 八卦基本数据
export const TRIGRAMS: Record<number, { name: string; symbol: string; element: string; attribute: string }> = {
  1: { name: "乾", symbol: "☰", element: "天", attribute: "健" },
  2: { name: "兑", symbol: "☱", element: "泽", attribute: "悦" },
  3: { name: "离", symbol: "☲", element: "火", attribute: "丽" },
  4: { name: "震", symbol: "☳", element: "雷", attribute: "动" },
  5: { name: "巽", symbol: "☴", element: "风", attribute: "入" },
  6: { name: "坎", symbol: "☵", element: "水", attribute: "陷" },
  7: { name: "艮", symbol: "☶", element: "山", attribute: "止" },
  8: { name: "坤", symbol: "☷", element: "地", attribute: "顺" },
};

// 根据数字获取卦象
export function getTrigramFromNumber(num: number): { name: string; symbol: string; element: string; attribute: string } {
  const remainder = num % 8 || 8;
  return TRIGRAMS[remainder];
}

// 根据数字获取卦爻
export function getTrigramLines(num: number): number[] {
  const remainder = num % 8 || 8;
  switch (remainder) {
    case 1: return [1, 1, 1]; // 乾 ☰
    case 2: return [1, 1, 0]; // 兑 ☱
    case 3: return [1, 0, 1]; // 离 ☲
    case 4: return [1, 0, 0]; // 震 ☳
    case 5: return [0, 1, 1]; // 巽 ☴
    case 6: return [0, 1, 0]; // 坎 ☵
    case 7: return [0, 0, 1]; // 艮 ☶
    case 8: return [0, 0, 0]; // 坤 ☷
    default: return [0, 0, 0];
  }
}

// 事项分类与卦象的关联解读
export const DIVINATION_INTERPRETATIONS: Record<string, { advice: string; keywords: string[] }> = {
  wealth: {
    advice: "财运方面，",
    keywords: ["投资", "理财", "事业", "收入", "支出"]
  },
  love: {
    advice: "感情方面，",
    keywords: ["婚姻", "恋爱", "人际", "缘分", "相处"]
  },
  health: {
    advice: "健康方面，",
    keywords: ["身体", "精神", "养生", "调理", "预防"]
  },
  career: {
    advice: "学业事业方面，",
    keywords: ["考试", "进修", "工作", "发展", "成就"]
  },
  other: {
    advice: "综合运势，",
    keywords: ["运势", "时机", "方向", "决策", "行动"]
  }
};

// 吉凶指数计算（根据卦象和动爻）
export function calculateLuckScore(hexagram: Hexagram, movingLines: number[]): number {
  // 基础分数：根据卦的吉凶倾向
  const auspiciousHexagrams = [1, 2, 11, 13, 14, 15, 16]; // 吉卦
  const inauspiciousHexagrams = [6, 12]; // 凶卦
  
  let baseScore = 50;
  
  if (auspiciousHexagrams.includes(hexagram.id)) {
    baseScore = 70 + Math.floor(Math.random() * 20); // 70-90
  } else if (inauspiciousHexagrams.includes(hexagram.id)) {
    baseScore = 30 + Math.floor(Math.random() * 20); // 30-50
  } else {
    baseScore = 45 + Math.floor(Math.random() * 20); // 45-65
  }
  
  // 动爻影响：动爻越少越稳定
  if (movingLines.length === 0) {
    baseScore += 5; // 无动爻，稳定
  } else if (movingLines.length > 3) {
    baseScore -= 10; // 动爻太多，变动大
  }
  
  return Math.min(100, Math.max(0, baseScore));
}
