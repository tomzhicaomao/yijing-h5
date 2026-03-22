export interface Hexagram {
  id: number;
  name: string;
  pinyin: string;
  symbol: string;
  lines: number[]; // 1 for Yang, 0 for Yin (bottom to top)
  judgment: string;
  image: string;
  meaning: string;
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
    meaning: "象征天，代表纯阳、刚健、创造力。预示着事业如日中天，但需持之以恒。"
  },
  {
    id: 2,
    name: "坤",
    pinyin: "Kūn",
    symbol: "䷁",
    lines: [0, 0, 0, 0, 0, 0],
    judgment: "元，亨，利牝马之贞。",
    image: "地势坤，君子以厚德载物。",
    meaning: "象征地，代表纯阴、柔顺、包容。预示着应顺应自然，厚积薄发。"
  },
  {
    id: 3,
    name: "屯",
    pinyin: "Zhūn",
    symbol: "䷂",
    lines: [1, 0, 0, 0, 1, 0],
    judgment: "元亨利贞，勿用有攸往，利建侯。",
    image: "云雷屯，君子以经纶。",
    meaning: "象征初生之难，万物始生而未通。宜守正待时，不宜轻举妄动。"
  },
  {
    id: 4,
    name: "蒙",
    pinyin: "Méng",
    symbol: "䷃",
    lines: [0, 1, 0, 0, 0, 1],
    judgment: "亨。匪我求童蒙，童蒙求我。",
    image: "山下出泉，蒙。君子以果行育德。",
    meaning: "象征蒙昧启蒙，需虚心求教。教育之道，在于启发而非灌输。"
  },
  {
    id: 5,
    name: "需",
    pinyin: "Xū",
    symbol: "䷄",
    lines: [1, 1, 1, 0, 1, 0],
    judgment: "有孚，光亨，贞吉。利涉大川。",
    image: "云上于天，需。君子以饮食宴乐。",
    meaning: "象征等待时机，需耐心守候。时机成熟自然成功。"
  },
  {
    id: 6,
    name: "讼",
    pinyin: "Sòng",
    symbol: "䷅",
    lines: [0, 1, 0, 1, 1, 1],
    judgment: "有孚窒惕，中吉，终凶。",
    image: "天与水违行，讼。君子以作事谋始。",
    meaning: "象征争讼纠纷，宜和解不宜争斗。凡事预则立，不预则废。"
  },
  {
    id: 7,
    name: "师",
    pinyin: "Shī",
    symbol: "䷆",
    lines: [0, 0, 0, 0, 1, 0],
    judgment: "贞，丈人吉，无咎。",
    image: "地中有水，师。君子以容民畜众。",
    meaning: "象征用兵之道，需正师出有名。领导众人，以德服人。"
  },
  {
    id: 8,
    name: "比",
    pinyin: "Bì",
    symbol: "䷇",
    lines: [0, 0, 0, 0, 1, 0],
    judgment: "吉。原筮元永贞，无咎。",
    image: "地上有水，比。先王以建万国，亲诸侯。",
    meaning: "象征亲附团结，上下同心。团结就是力量。"
  },
];

export function getHexagramFromLines(lines: number[]): Hexagram {
  const found = HEXAGRAMS.find(h => h.lines.every((l, i) => l === lines[i]));
  if (found) return found;
  
  return {
    id: 0,
    name: "卦象",
    pinyin: "Guà Xiàng",
    symbol: "䷊",
    lines: lines,
    judgment: "吉凶参半，顺势而为。",
    image: "山水相依，变幻莫测。",
    meaning: "此卦象显示当前处于变动之中，需冷静观察，待机而动。"
  };
}

export const TRIGRAMS = {
  1: { name: "乾", symbol: "☰", element: "天" },
  2: { name: "兑", symbol: "☱", element: "泽" },
  3: { name: "离", symbol: "☲", element: "火" },
  4: { name: "震", symbol: "☳", element: "雷" },
  5: { name: "巽", symbol: "☴", element: "风" },
  6: { name: "坎", symbol: "☵", element: "水" },
  7: { name: "艮", symbol: "☶", element: "山" },
  8: { name: "坤", symbol: "☷", element: "地" },
};

export function getTrigramFromNumber(num: number): { name: string; symbol: string; element: string } {
  const remainder = num % 8 || 8;
  return TRIGRAMS[remainder as keyof typeof TRIGRAMS];
}

export function getTrigramLines(num: number): number[] {
  const remainder = num % 8 || 8;
  switch (remainder) {
    case 1: return [1, 1, 1]; // 乾
    case 2: return [1, 1, 0]; // 兑
    case 3: return [1, 0, 1]; // 离
    case 4: return [1, 0, 0]; // 震
    case 5: return [0, 1, 1]; // 巽
    case 6: return [0, 1, 0]; // 坎
    case 7: return [0, 0, 1]; // 艮
    case 8: return [0, 0, 0]; // 坤
    default: return [0, 0, 0];
  }
}
