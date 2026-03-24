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
    lines: [1,1,1,1,1,1],
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
    lines: [0,0,0,0,0,0],
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
    lines: [1,0,0,0,1,0],
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
    lines: [0,1,0,0,0,1],
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
    lines: [1,1,1,0,1,0],
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
    lines: [0,1,0,1,1,1],
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
    lines: [0,0,0,0,1,0],
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
    lines: [0,0,0,0,1,0],
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
    lines: [1,1,1,0,1,1],
    judgment: "亨。密云不雨，自我西郊。",
    image: "风行天上，小畜。君子以懿文德。",
    meaning: "象征小有积蓄，时机未到需等待。积累力量，待时而动。",
    trigrams: { upper: "巽", lower: "乾" }
  },
  {
    id: 10,
    name: "履",
    pinyin: "Lǚ",
    symbol: "䷉",
    lines: [1,1,1,0,1,0],
    judgment: "履虎尾，不咥人，亨。",
    image: "上天下泽，履。君子以辨上下，定民志。",
    meaning: "象征谨慎行事，如履薄冰。以礼待人，可化险为夷。",
    trigrams: { upper: "乾", lower: "兑" }
  },
  {
    id: 11,
    name: "泰",
    pinyin: "Tài",
    symbol: "䷊",
    lines: [0,0,0,1,1,1],
    judgment: "小往大来，吉，亨。",
    image: "天地交，泰。后以财成天地之道，辅相天地之宜。",
    meaning: "象征通达安泰，阴阳调和。万事顺利，但需居安思危。",
    trigrams: { upper: "坤", lower: "乾" }
  },
  {
    id: 12,
    name: "否",
    pinyin: "Pǐ",
    symbol: "䷋",
    lines: [1,1,1,0,0,0],
    judgment: "否之匪人，不利君子贞，大往小来。",
    image: "天地不交，否。君子以俭德辟难，不可荣以禄。",
    meaning: "象征闭塞不通，阴阳分离。宜守不宜进，等待时机。",
    trigrams: { upper: "乾", lower: "坤" }
  },
  {
    id: 13,
    name: "同人",
    pinyin: "Tóng Rén",
    symbol: "䷌",
    lines: [1,1,1,0,1,1],
    judgment: "同人于野，亨。利涉大川，利君子贞。",
    image: "天与火，同人。君子以类族辨物。",
    meaning: "象征与人同心，志同道合。团结合作，可成大事。",
    trigrams: { upper: "乾", lower: "离" }
  },
  {
    id: 14,
    name: "大有",
    pinyin: "Dà Yǒu",
    symbol: "䷍",
    lines: [1,1,1,0,1,1],
    judgment: "元亨。",
    image: "火在天上，大有。君子以遏恶扬善，顺天休命。",
    meaning: "象征大有所获，如日中天。顺天应人，可保长久。",
    trigrams: { upper: "离", lower: "乾" }
  },
  {
    id: 15,
    name: "谦",
    pinyin: "Qiān",
    symbol: "䷎",
    lines: [0,0,1,0,0,0],
    judgment: "亨，君子有终。",
    image: "地中有山，谦。君子以裒多益寡，称物平施。",
    meaning: "象征谦虚谨慎，低调做人。谦受益，满招损。",
    trigrams: { upper: "坤", lower: "艮" }
  },
  {
    id: 16,
    name: "豫",
    pinyin: "Yù",
    symbol: "䷏",
    lines: [0,0,0,1,0,0],
    judgment: "利建侯行师。",
    image: "雷出地奋，豫。先王以作乐崇德，殷荐之上帝。",
    meaning: "象征愉悦安乐，顺势而为。居安思危，不可沉溺。",
    trigrams: { upper: "震", lower: "坤" }
  },
  {
    id: 17,
    name: "随",
    pinyin: "Suí",
    symbol: "䷐",
    lines: [0,1,1,0,1,0],
    judgment: "元亨利贞，无咎。",
    image: "泽中有雷，随。君子以向晦入宴息。",
    meaning: "象征随顺时势，灵活变通。",
    trigrams: { upper: "兑", lower: "震" }
  },
  {
    id: 18,
    name: "蛊",
    pinyin: "Gǔ",
    symbol: "䷑",
    lines: [0,1,1,0,0,1],
    judgment: "元亨，利涉大川。先甲三日，后甲三日。",
    image: "山下有风，蛊。君子以振民育德。",
    meaning: "象征积弊需除，革新图治。",
    trigrams: { upper: "艮", lower: "巽" }
  },
  {
    id: 19,
    name: "临",
    pinyin: "Lín",
    symbol: "䷒",
    lines: [0,0,1,1,0,0],
    judgment: "元亨利贞。至于八月有凶。",
    image: "泽上有地，临。君子以教思无穷，容保民无疆。",
    meaning: "象征居高临下，督导众人。",
    trigrams: { upper: "坤", lower: "兑" }
  },
  {
    id: 20,
    name: "观",
    pinyin: "Guān",
    symbol: "䷓",
    lines: [0,0,1,1,0,0],
    judgment: "盥而不荐，有孚颙若。",
    image: "风行地上，观。先王以省方观民设教。",
    meaning: "象征观察审视，明察秋毫。",
    trigrams: { upper: "巽", lower: "坤" }
  },
  {
    id: 21,
    name: "噬嗑",
    pinyin: "Shì Kè",
    symbol: "䷔",
    lines: [1,0,1,0,0,1],
    judgment: "亨。利用狱。",
    image: "雷电噬嗑。先王以明罚敕法。",
    meaning: "象征咬合贯通，排除障碍。",
    trigrams: { upper: "离", lower: "震" }
  },
  {
    id: 22,
    name: "贲",
    pinyin: "Bì",
    symbol: "䷕",
    lines: [1,0,1,0,0,1],
    judgment: "亨。小利有攸往。",
    image: "山下有火，贲。君子以明庶政，无敢折狱。",
    meaning: "象征文饰美化，注重仪表。",
    trigrams: { upper: "艮", lower: "离" }
  },
  {
    id: 23,
    name: "剥",
    pinyin: "Bō",
    symbol: "䷖",
    lines: [0,0,0,0,0,1],
    judgment: "不利有攸往。",
    image: "山附于地，剥。上以厚下安宅。",
    meaning: "象征剥落衰退，宜守不宜进。",
    trigrams: { upper: "艮", lower: "坤" }
  },
  {
    id: 24,
    name: "复",
    pinyin: "Fù",
    symbol: "䷗",
    lines: [1,0,0,0,0,0],
    judgment: "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。",
    image: "雷在地中，复。先王以至日闭关，商旅不行，后不省方。",
    meaning: "象征复苏回归，阳气初生。",
    trigrams: { upper: "坤", lower: "震" }
  },
  {
    id: 25,
    name: "无妄",
    pinyin: "Wú Wàng",
    symbol: "䷘",
    lines: [1,1,1,0,0,1],
    judgment: "元亨利贞。其匪正有眚，不利有攸往。",
    image: "天下雷行，无妄。先王以茂对时育万物。",
    meaning: "象征真实无妄，顺其自然。",
    trigrams: { upper: "乾", lower: "震" }
  },
  {
    id: 26,
    name: "大畜",
    pinyin: "Dà Xù",
    symbol: "䷙",
    lines: [1,1,1,0,0,1],
    judgment: "利贞。不家食吉，利涉大川。",
    image: "天在山中，大畜。君子以多识前言往行，以畜其德。",
    meaning: "象征大积蓄，厚积薄发。",
    trigrams: { upper: "艮", lower: "乾" }
  },
  {
    id: 27,
    name: "颐",
    pinyin: "Yí",
    symbol: "䷚",
    lines: [1,0,0,0,0,1],
    judgment: "贞吉。观颐，自求口实。",
    image: "山下有雷，颐。君子以慎言语，节饮食。",
    meaning: "象征颐养身心，节制欲望。",
    trigrams: { upper: "艮", lower: "震" }
  },
  {
    id: 28,
    name: "大过",
    pinyin: "Dà Guò",
    symbol: "䷛",
    lines: [0,1,1,1,1,0],
    judgment: "栋桡，利有攸往，亨。",
    image: "泽灭木，大过。君子以独立不惧，遁世无闷。",
    meaning: "象征过度非常，需非常手段。",
    trigrams: { upper: "兑", lower: "巽" }
  },
  {
    id: 29,
    name: "坎",
    pinyin: "Kǎn",
    symbol: "䷜",
    lines: [0,1,0,0,1,0],
    judgment: "习坎，有孚，维心亨，行有尚。",
    image: "水洊至，习坎。君子以常德行，习教事。",
    meaning: "象征重重险阻，需诚信坚定。",
    trigrams: { upper: "坎", lower: "坎" }
  },
  {
    id: 30,
    name: "离",
    pinyin: "Lí",
    symbol: "䷝",
    lines: [1,0,1,1,0,1],
    judgment: "利贞，亨。畜牝牛，吉。",
    image: "明两作，离。大人以继明照四方。",
    meaning: "象征光明依附，柔顺中正。",
    trigrams: { upper: "离", lower: "离" }
  },
  {
    id: 31,
    name: "咸",
    pinyin: "Xián",
    symbol: "䷞",
    lines: [0,1,1,1,0,0],
    judgment: "亨，利贞，取女吉。",
    image: "山上有泽，咸。君子以虚受人。",
    meaning: "象征感应相通，以诚待人。",
    trigrams: { upper: "兑", lower: "艮" }
  },
  {
    id: 32,
    name: "恒",
    pinyin: "Héng",
    symbol: "䷟",
    lines: [0,1,1,1,0,0],
    judgment: "亨，无咎，利贞，利有攸往。",
    image: "雷风，恒。君子以立不易方。",
    meaning: "象征恒久不变，持之以恒。",
    trigrams: { upper: "震", lower: "巽" }
  },
  {
    id: 33,
    name: "遁",
    pinyin: "Dùn",
    symbol: "䷠",
    lines: [0,1,1,1,1,0],
    judgment: "亨，小利贞。",
    image: "天下有山，遁。君子以远小人，不恶而严。",
    meaning: "象征退避隐遁，以待时机。",
    trigrams: { upper: "乾", lower: "艮" }
  },
  {
    id: 34,
    name: "大壮",
    pinyin: "Dà Zhuàng",
    symbol: "䷡",
    lines: [0,1,1,1,1,1],
    judgment: "利贞。",
    image: "雷在天上，大壮。君子以非礼弗履。",
    meaning: "象征强盛壮大，需守正道。",
    trigrams: { upper: "震", lower: "乾" }
  },
  {
    id: 35,
    name: "晋",
    pinyin: "Jìn",
    symbol: "䷢",
    lines: [0,1,1,0,0,1],
    judgment: "康侯用锡马蕃庶，昼日三接。",
    image: "明出地上，晋。君子以自昭明德。",
    meaning: "象征晋升前进，光明在上。",
    trigrams: { upper: "离", lower: "坤" }
  },
  {
    id: 36,
    name: "明夷",
    pinyin: "Míng Yí",
    symbol: "䷣",
    lines: [1,0,1,0,0,0],
    judgment: "利艰贞。",
    image: "明入地中，明夷。君子以莅众，用晦而明。",
    meaning: "象征光明受损，韬光养晦。",
    trigrams: { upper: "坤", lower: "离" }
  },
  {
    id: 37,
    name: "家人",
    pinyin: "Jiā Rén",
    symbol: "䷤",
    lines: [1,0,1,0,0,1],
    judgment: "利女贞。",
    image: "风自火出，家人。君子以言有物，行有恒。",
    meaning: "象征家庭和睦，各安其位。",
    trigrams: { upper: "巽", lower: "离" }
  },
  {
    id: 38,
    name: "睽",
    pinyin: "Kuí",
    symbol: "䷥",
    lines: [1,0,1,0,1,1],
    judgment: "小事吉。",
    image: "上火下泽，睽。君子以同而异。",
    meaning: "象征乖离背离，求同存异。",
    trigrams: { upper: "离", lower: "兑" }
  },
  {
    id: 39,
    name: "蹇",
    pinyin: "Jiǎn",
    symbol: "䷦",
    lines: [0,1,0,0,1,0],
    judgment: "利西南，不利东北。利见大人，贞吉。",
    image: "山上有水，蹇。君子以反身修德。",
    meaning: "象征艰难险阻，反身修德。",
    trigrams: { upper: "坎", lower: "艮" }
  },
  {
    id: 40,
    name: "解",
    pinyin: "Xiè",
    symbol: "䷧",
    lines: [0,1,0,0,1,0],
    judgment: "利西南。无所往，其来复吉。有攸往，夙吉。",
    image: "雷雨作，解。君子以赦过宥罪。",
    meaning: "象征解除困难，宽恕待人。",
    trigrams: { upper: "震", lower: "坎" }
  },
  {
    id: 41,
    name: "损",
    pinyin: "Sǔn",
    symbol: "䷨",
    lines: [1,0,1,0,0,1],
    judgment: "有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。",
    image: "山下有泽，损。君子以惩忿窒欲。",
    meaning: "象征减损下方，增益上方。",
    trigrams: { upper: "艮", lower: "兑" }
  },
  {
    id: 42,
    name: "益",
    pinyin: "Yì",
    symbol: "䷩",
    lines: [1,0,1,0,0,1],
    judgment: "利有攸往，利涉大川。",
    image: "风雷，益。君子以见善则迁，有过则改。",
    meaning: "象征增益上方，惠及下方。",
    trigrams: { upper: "巽", lower: "震" }
  },
  {
    id: 43,
    name: "夬",
    pinyin: "Guài",
    symbol: "䷪",
    lines: [1,1,1,1,1,0],
    judgment: "扬于王庭，孚号，有厉。告自邑，不利即戎，利有攸往。",
    image: "泽上于天，夬。君子以施禄及下，居德则忌。",
    meaning: "象征决断果敢，清除小人。",
    trigrams: { upper: "兑", lower: "乾" }
  },
  {
    id: 44,
    name: "姤",
    pinyin: "Gòu",
    symbol: "䷫",
    lines: [1,1,1,1,1,0],
    judgment: "女壮，勿用取女。",
    image: "天下有风，姤。后以施命诰四方。",
    meaning: "象征相遇邂逅，防微杜渐。",
    trigrams: { upper: "乾", lower: "巽" }
  },
  {
    id: 45,
    name: "萃",
    pinyin: "Cuì",
    symbol: "䷬",
    lines: [0,1,1,0,0,0],
    judgment: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。",
    image: "泽上于地，萃。君子以除戎器，戒不虞。",
    meaning: "象征聚集会合，众志成城。",
    trigrams: { upper: "兑", lower: "坤" }
  },
  {
    id: 46,
    name: "升",
    pinyin: "Shēng",
    symbol: "䷭",
    lines: [0,1,1,0,0,0],
    judgment: "元亨，用见大人，勿恤，南征吉。",
    image: "地中生木，升。君子以顺德，积小以高大。",
    meaning: "象征上升成长，循序渐进。",
    trigrams: { upper: "坤", lower: "巽" }
  },
  {
    id: 47,
    name: "困",
    pinyin: "Kùn",
    symbol: "䷮",
    lines: [0,1,0,0,1,1],
    judgment: "亨，贞，大人吉，无咎。有言不信。",
    image: "泽无水，困。君子以致命遂志。",
    meaning: "象征困顿穷厄，坚守正道。",
    trigrams: { upper: "兑", lower: "坎" }
  },
  {
    id: 48,
    name: "井",
    pinyin: "Jǐng",
    symbol: "䷯",
    lines: [0,1,0,0,1,1],
    judgment: "改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。",
    image: "木上有水，井。君子以劳民劝相。",
    meaning: "象征井养不穷，恒定不变。",
    trigrams: { upper: "坎", lower: "巽" }
  },
  {
    id: 49,
    name: "革",
    pinyin: "Gé",
    symbol: "䷰",
    lines: [1,0,1,0,1,1],
    judgment: "己日乃孚，元亨利贞，悔亡。",
    image: "泽中有火，革。君子以治历明时。",
    meaning: "象征变革革新，顺天应人。",
    trigrams: { upper: "兑", lower: "离" }
  },
  {
    id: 50,
    name: "鼎",
    pinyin: "Dǐng",
    symbol: "䷱",
    lines: [1,0,1,0,1,1],
    judgment: "元吉，亨。",
    image: "木上有火，鼎。君子以正位凝命。",
    meaning: "象征鼎立稳固，除旧布新。",
    trigrams: { upper: "离", lower: "巽" }
  },
  {
    id: 51,
    name: "震",
    pinyin: "Zhèn",
    symbol: "䷲",
    lines: [1,0,0,1,0,0],
    judgment: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。",
    image: "洊雷，震。君子以恐惧修省。",
    meaning: "象征震动惊醒，戒慎恐惧。",
    trigrams: { upper: "震", lower: "震" }
  },
  {
    id: 52,
    name: "艮",
    pinyin: "Gèn",
    symbol: "䷳",
    lines: [0,0,1,0,0,1],
    judgment: "艮其背，不获其身，行其庭，不见其人，无咎。",
    image: "兼山，艮。君子以思不出其位。",
    meaning: "象征静止停止，安守本分。",
    trigrams: { upper: "艮", lower: "艮" }
  },
  {
    id: 53,
    name: "渐",
    pinyin: "Jiàn",
    symbol: "䷴",
    lines: [0,0,1,0,1,1],
    judgment: "女归吉，利贞。",
    image: "山上有木，渐。君子以居贤德，善俗。",
    meaning: "象征循序渐进，不急不躁。",
    trigrams: { upper: "巽", lower: "艮" }
  },
  {
    id: 54,
    name: "归妹",
    pinyin: "Guī Mèi",
    symbol: "䷵",
    lines: [1,0,1,0,0,1],
    judgment: "征凶，无攸利。",
    image: "泽上有雷，归妹。君子以永终知敝。",
    meaning: "象征嫁娶不当，需谨慎行事。",
    trigrams: { upper: "震", lower: "兑" }
  },
  {
    id: 55,
    name: "丰",
    pinyin: "Fēng",
    symbol: "䷶",
    lines: [1,0,1,0,1,1],
    judgment: "亨，王假之，勿忧，宜日中。",
    image: "雷电皆至，丰。君子以折狱致刑。",
    meaning: "象征丰盛盛大，如日中天。",
    trigrams: { upper: "震", lower: "离" }
  },
  {
    id: 56,
    name: "旅",
    pinyin: "Lǚ",
    symbol: "䷷",
    lines: [1,0,1,0,1,1],
    judgment: "小亨，旅贞吉。",
    image: "山上有火，旅。君子以明慎用刑，而不留狱。",
    meaning: "象征旅行在外，谨慎行事。",
    trigrams: { upper: "离", lower: "艮" }
  },
  {
    id: 57,
    name: "巽",
    pinyin: "Xùn",
    symbol: "䷸",
    lines: [0,1,1,0,1,1],
    judgment: "小亨，利有攸往，利见大人。",
    image: "随风，巽。君子以申命行事。",
    meaning: "象征顺从进入，柔顺刚健。",
    trigrams: { upper: "巽", lower: "巽" }
  },
  {
    id: 58,
    name: "兑",
    pinyin: "Duì",
    symbol: "䷹",
    lines: [1,1,0,1,1,0],
    judgment: "亨，利贞。",
    image: "丽泽，兑。君子以朋友讲习。",
    meaning: "象征喜悦沟通，和悦待人。",
    trigrams: { upper: "兑", lower: "兑" }
  },
  {
    id: 59,
    name: "涣",
    pinyin: "Huàn",
    symbol: "䷺",
    lines: [0,1,0,0,1,1],
    judgment: "亨。王假有庙，利涉大川，利贞。",
    image: "风行水上，涣。先王以享于帝立庙。",
    meaning: "象征涣散离散，凝聚人心。",
    trigrams: { upper: "巽", lower: "坎" }
  },
  {
    id: 60,
    name: "节",
    pinyin: "Jié",
    symbol: "䷻",
    lines: [1,0,1,0,0,1],
    judgment: "亨。苦节不可贞。",
    image: "泽上有水，节。君子以制数度，议德行。",
    meaning: "象征节制约束，适度为宜。",
    trigrams: { upper: "坎", lower: "兑" }
  },
  {
    id: 61,
    name: "中孚",
    pinyin: "Zhōng Fú",
    symbol: "䷼",
    lines: [1,1,0,0,1,1],
    judgment: "豚鱼吉，利涉大川，利贞。",
    image: "泽上有风，中孚。君子以议狱缓死。",
    meaning: "象征诚信中正，感化万物。",
    trigrams: { upper: "巽", lower: "兑" }
  },
  {
    id: 62,
    name: "小过",
    pinyin: "Xiǎo Guò",
    symbol: "䷽",
    lines: [0,0,1,1,0,0],
    judgment: "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。",
    image: "山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭。",
    meaning: "象征小有过越，谨慎行事。",
    trigrams: { upper: "震", lower: "艮" }
  },
  {
    id: 63,
    name: "既济",
    pinyin: "Jì Jì",
    symbol: "䷾",
    lines: [1,0,1,0,1,0],
    judgment: "亨，小利贞，初吉终乱。",
    image: "水在火上，既济。君子以思患而豫防之。",
    meaning: "象征事已成功，居安思危。",
    trigrams: { upper: "坎", lower: "离" }
  },
  {
    id: 64,
    name: "未济",
    pinyin: "Wèi Jì",
    symbol: "䷿",
    lines: [0,1,0,1,0,1],
    judgment: "亨，小狐汔济，濡其尾，无攸利。",
    image: "火在水上，未济。君子以慎辨物居方。",
    meaning: "象征事未成功，继续努力。",
    trigrams: { upper: "离", lower: "坎" }
  },
];

// 根据爻象获取卦
export function getHexagramFromLines(lines: number[]): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.lines.every((l, i) => l === lines[i]));
}
