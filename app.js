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
  
  // 显示八卦符号
  const symbol = hexagramSymbols[shangGua * 8 + xiaGua - 8] || '☰☷';
  document.getElementById('guaImage').textContent = symbol;
  
  // 卦辞
  document.getElementById('guaCi').textContent = hexagram.gua_ci;
  document.getElementById('guaCiModern').textContent = trans.gua_ci_modern || '';
  
  // 动爻
  const dongYaoData = hexagram.yao.find(y => y.position === dongYao);
  const dongTrans = trans.yao && trans.yao[dongYao - 1];
  document.getElementById('dongYao').textContent = dongYaoData ? `第${dongYao}爻：${dongYaoData.yao_ci}` : '';
  document.getElementById('dongYaoModern').textContent = dongTrans ? dongTrans.yao_ci_modern : '';
  
  // 渲染六爻列表
  const allYaoList = document.getElementById('allYaoList');
  allYaoList.innerHTML = '';
  hexagram.yao.forEach((yao, idx) => {
    const yaoTrans = trans.yao && trans.yao[yao.position - 1];
    const item = document.createElement('div');
    item.className = 'yao-item' + (yao.position === dongYao ? ' active' : '');
    item.innerHTML = `
      <div class="yao-position" style="color:#c9a227;font-size:12px;margin-bottom:4px;">${getYaoName(yao.position)}爻</div>
      <div class="ancient-text" style="font-size:14px;color:rgba(255,255,255,0.9);">${yao.yao_ci}</div>
      <div class="modern-text" style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px;">${yaoTrans ? yaoTrans.yao_ci_modern : ''}</div>
    `;
    allYaoList.appendChild(item);
  });
  
  // 显示结果区域
  document.getElementById('result').classList.remove('hidden');
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
  div.style.padding = '16px';
  div.style.background = 'rgba(0,0,0,0.2)';
  div.style.borderRadius = '16px';
  div.innerHTML = `
    <div style="margin-bottom:12px;">
      <div style="font-size:13px;color:#c9a227;margin-bottom:8px;">📖 整体运势</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;">${interpretations.overall}</div>
    </div>
    <div style="margin-bottom:12px;">
      <div style="font-size:13px;color:#c9a227;margin-bottom:8px;">💼 事业发展</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;">${interpretations.career}</div>
    </div>
    <div style="margin-bottom:12px;">
      <div style="font-size:13px;color:#c9a227;margin-bottom:8px;">💰 财运分析</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;">${interpretations.fortune}</div>
    </div>
    <div style="margin-bottom:12px;">
      <div style="font-size:13px;color:#c9a227;margin-bottom:8px;">💕 爱情运势</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;">${interpretations.love}</div>
    </div>
    <div style="margin-bottom:12px;">
      <div style="font-size:13px;color:#c9a227;margin-bottom:8px;">❤️ 健康提示</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;">${interpretations.health}</div>
    </div>
    ${dongYao ? `
    <div>
      <div style="font-size:13px;color:#c9a227;margin-bottom:8px;">⚡ 变爻启示（第${dongYao}爻）</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;">${interpretations.change}</div>
    </div>
    ` : ''}
  `;
  
  document.getElementById('result').appendChild(div);
}
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
    3: { overall: "屯卦象征事物初生之状态，虽有困难但前景光明。需要耐心筹备，不可冒进。", career: "创业或新项目会遇到阻碍，但这是积累经验的必要过程。", fortune: "财运初起步，投入需谨慎，小额尝试为宜。", love: "感情发展需耐心，不可急于确定关系。", health: "注意预防感冒，保持充足睡眠。", change: "乘马班如，求婚媾。把握机遇，吉祥无不利。" },
    4: { overall: "蒙卦象征蒙昧未开，需要启发教育。运势初启，需要学习启蒙阶段。", career: "适合学习新技能或接受培训，不宜急于求成。", fortune: "财运处于初期阶段，需要虚心学习理财知识。", love: "感情需要慢慢培养，不宜操之过急。", health: "注意调节作息，保持良好的生活习惯。", change: "利用刑人，以正法也。通过学习启蒙，获得成长。" },
    5: { overall: "需卦象征等待时机。运势需要耐心等待，不可盲目行动。", career: "正处蓄势待发阶段，需要等待合适时机。", fortune: "财运有望但需耐心等待，不宜急躁投资。", love: "需要耐心等待缘分，不可强求。", health: "保持平和心态，避免焦虑情绪。", change: "需于郊，利用恒，无咎。在郊外等待，保持恒心必有好结果。" },
    6: { overall: "讼卦象征争讼纠纷。运势多波折，需谨慎处理人际关系。", career: "工作中可能遇到竞争或纠纷，需要冷静处理。", fortune: "财务上有争端风险，宜守不宜攻。", love: "感情中有误会需要及时沟通化解。", health: "注意肝气郁结，保持心平气和。", change: "不永所事，讼不可长也。争讼不可持续，应及时止戈。" },
    7: { overall: "师卦象征军队战争。运势涉及团队协作与领导能力。", career: "需要团结协作，适合带领团队完成目标。", fortune: "适合集体投资或合作项目。", love: "需要主动表达，但要注意方式方法。", health: "注意预防心血管疾病。", change: "师出以律，否臧凶。军队出发要有纪律，否则有凶险。" },
    8: { overall: "比卦象征亲比依附。运势吉顺，适合寻求合作与支持。", career: "寻找合作伙伴或支持者，时机有利。", fortune: "合作财运，可考虑合伙生意。", love: "单身者有望通过朋友介绍认识新人。", health: "保持身心和谐，适当社交。", change: "比之初六，有他吉也。亲比之初，获得他人帮助有吉利。" },
    9: { overall: "小畜卦象征小有积蓄。运势逐步积累，财富缓慢增长。", career: "稳扎稳打，循序渐进积累成就。", fortune: "财富逐步积累，适合储蓄理财。", love: "感情发展平稳，渐入佳境。", health: "注意营养补充，身体日渐强健。", change: "有孚挛如，富以其邻。保持诚信，与他人共同富裕。" },
    10: { overall: "履卦象征履行实践。运势需要脚踏实地行动。", career: "需要履行责任，脚踏实地做事。", fortune: "通过正当努力获得收益。", love: "以诚相待，稳步发展感情。", health: "注意足部健康，适当运动。", change: "眇能视，跛能履。虽有小缺陷，但能履行使命。" },
    11: { overall: "泰卦象征天地通泰。运势大吉，万事如意。", career: "事业蒸蒸日上，各方面顺利。", fortune: "财运亨通，适宜发展事业。", love: "感情甜蜜幸福，鸾凤和鸣。", health: "身体健康，精力充沛。", change: "无平不陂，无往不复。万物盛衰循环，保持平衡。" },
    12: { overall: "否卦象征天地不通。运势受阻，需要耐心等待转机。", career: "事业遇到瓶颈，需要暂时蛰伏。", fortune: "财务收益下降，需谨慎管理。", love: "感情出现阻碍，需要耐心沟通。", health: "注意调节情绪，保持乐观。", change: "倾否，先否后喜。先经历困阻，后有喜悦。" },
    13: { overall: "同人卦象征同人于野。运势吉顺，适合与他人合作。", career: "适合团队合作，共同发展事业。", fortune: "合作共赢，财运来自集体努力。", love: "有缘千里来相会，感情顺利。", health: "气血和畅，身体健康。", change: "同人于郊，志未得也。在郊外与人同心，但志向未实现。" },
    14: { overall: "大有卦象征大有收获。运势大吉，收获丰富。", career: "事业成就显著，获得丰硕成果。", fortune: "财运旺盛，收益颇丰。", love: "感情收获满满，幸福美满。", health: "身心康泰，状态良好。", change: "厥孚交如，信以发志也。以诚信交往，发挥志向。" },
    15: { overall: "谦卦象征谦虚谦逊。运势吉顺，以柔克刚。", career: "以谦虚态度获得他人认可。", fortune: "收益稳定，谦虚得财。", love: "以诚相待，感情稳定发展。", health: "心态平和，身心健康。", change: "鸣谦，贞吉。谦虚的名声传播，吉祥如意。" },
    16: { overall: "豫卦象征欢乐愉快。运势吉顺，享受当下。", career: "工作顺利，心情愉快。", fortune: "收益稳定，适宜享受生活。", love: "感情甜蜜，生活幸福。", health: "身心愉悦，注意休息。", change: "由豫，大有得。欢乐来源于内心，收获丰富。" },
    17: { overall: "随卦象征随从顺从。运势吉顺，顺势而为。", career: "跟随有经验的领导或导师。", fortune: "随遇而安，财运平稳。", love: "顺其自然发展，感情稳定。", health: "适应环境，保持健康。", change: "官有渝，贞吉。职位有变化，保持正道则吉祥。" },
    18: { overall: "蛊卦象征除弊治乱。运势先难后易。", career: "需要改革整顿，解决遗留问题。", fortune: "先破后立，财运先难后易。", love: "需要解决之前的问题，感情才能顺利。", health: "注意调理身体，清除体内毒素。", change: "干父之蛊，用誉。继承父亲的事业，获得荣誉。" },
    19: { overall: "临卦象征君临天下。运势吉顺，领导者运势强。", career: "适合担任领导职位。", fortune: "管理财务能力强，收益增加。", love: "主动出击，感情有望成功。", health: "注意肝脏保护。", change: "至临，无咎。亲自临事，没有灾祸。" },
    20: { overall: "观卦象征观察省视。运势需要冷静观察。", career: "仔细观察市场，等待时机。", fortune: "观察后再做投资决策。", love: "多了解对方，不要急于确定。", health: "注意休息，保护眼睛。", change: "窥观，利女贞。暗中观察，适合女性坚守正道。" },
    21: { overall: "噬嗑卦象征刑罚断狱。运势需要果断决策。", career: "需要处理纠纷，果断决策。", fortune: "通过合法途径获得收益。", love: "需要解决误会，果断沟通。", health: "注意牙齿和消化系统。", change: "噬肤灭鼻，无咎。咬食皮肤，没过鼻子，没有灾祸。" },
    22: { overall: "贲卦象征装饰美化。运势吉顺，表面光鲜。", career: "注意形象包装，表现力强。", fortune: "通过包装提升价值。", love: "注意外表打扮，提升魅力。", health: "注意皮肤护理。", change: "贲其须，与上兴也。装饰胡须，跟随上司兴起。" },
    23: { overall: "剥卦象征剥落衰败。运势不佳，需要谨慎。", career: "事业遇到困难，需要蛰伏。", fortune: "财务收益下降，需节省开支。", love: "感情出现裂痕，需要修复。", health: "注意身体健康，防止疾病。", change: "剥床以辨，蔑以贞也。床剥落损坏，没有正道可守。" },
    24: { overall: "复卦象征复归复兴。运势开始好转。", career: "事业开始复兴，迎来转机。", fortune: "财运开始好转，有收益增加。", love: "旧情复燃，有望复合。", health: "身体开始康复。", change: "敦复，无悔。诚恳回复，没有后悔。" },
    25: { overall: "无妄卦象征不妄为。运势吉顺，顺其自然。", career: "脚踏实地，不做非分之想。", fortune: "正当收入，稳步增长。", love: "真心对待，不玩弄感情。", health: "保持正常作息。", change: "无妄之往，得志也。不妄为的行动，实现志愿。" },
    26: { overall: "大畜卦象征大为畜积。运势吉顺，积累财富。", career: "积累经验和资源，等待大展拳脚。", fortune: "财富积累，收益丰厚。", love: "积累感情，瓜熟蒂落。", health: "身体健壮，精力充沛。", change: "有厉利已。遇到危险，适宜停止。" },
    27: { overall: "颐卦象征颐养养生。运势吉顺，调养身体。", career: "注意休息，调养身心。", fortune: "稳定收益，适宜保养。", love: "互相滋养，感情稳定。", health: "注意饮食调养。", change: "由颐，厉吉，利涉大川。遵循颐养之道，虽难但吉，适宜渡过大河。" },
    28: { overall: "大过卦象征大为过分。运势有风险，需谨慎。", career: "行动过于激进，需稳健。", fortune: "风险较大，谨慎投资。", love: "感情过于激烈，需冷静。", health: "注意调节，防止过劳。", change: "栋桡，凶。栋梁弯曲，有凶险。" },
    29: { overall: "坎卦象征险阻重重。运势艰难，需要坚持。", career: "遇到困难险阻，需要坚持。", fortune: "财务风险，注意防范。", love: "感情有阻碍，需耐心突破。", health: "注意肾脏保养。", change: "习坎，入于坎窞。重重险阻，进入陷阱。" },
    30: { overall: "离卦象征附丽光明。运势吉顺，前景光明。", career: "依附有前景的事业或人物。", fortune: "收益稳定，光明在前。", love: "感情如胶似漆，甜蜜幸福。", health: "气血充足，精神焕发。", change: "黄离，元吉。黄色附着，大吉大利。" },
    31: { overall: "咸卦象征感应相通。运势吉顺，心意相通。", career: "与合作伙伴心意相通。", fortune: "投资顺利，感应灵敏。", love: "两情相悦，感应强烈。", health: "气血通畅，身体健康。", change: "咸其辅颊舌。感应到面颊舌头。" },
    32: { overall: "恒卦象征恒久持久。运势平稳持久。", career: "稳定发展，持久经营。", fortune: "稳定收益，持久获利。", love: "感情稳定，天长地久。", change: "恒其德，贞。保持德行，坚守正道。" },
    33: { overall: "遯卦象征退避隐藏。运势需暂时退避。", career: "暂时退避，等待时机。", fortune: "暂避风险，保持实力。", love: "暂时保持距离。", health: "注意休息调养。", change: "执之用黄牛之革。用黄牛皮绳捆绑，坚守不退。" },
    34: { overall: "大壮卦象征强大壮盛。运势强盛。", career: "势力强大，适宜进攻。", fortune: "财运旺盛，收益丰厚。", love: "主动出击，成功率高。", health: "精力充沛。", change: "贞吉悔亡，坚守正道则吉祥无悔。" },
    35: { overall: "晋卦象征进晋升迁。运势上升，晋升有望。", career: "职位晋升，事业发展。", fortune: "收益增加，财运上升。", love: "感情发展，关系进步。", health: "身体健康，精神振奋。", change: "晋其角，维用伐邑。进攻角落，适宜讨伐城邑。" },
    36: { overall: "明夷卦象征光明受伤。运势受阻，需要隐忍。", career: "光明受阻，需暂时隐忍。", fortune: "收益受损，需谨慎行事。", love: "感情有误会，需耐心化解。", health: "注意保护眼睛。", change: "明夷于飞，垂其翼。光明受伤，鸟儿垂下翅膀。" },
    37: { overall: "家人卦象征家庭亲人。运势吉顺，家庭和睦。", career: "家庭支持事业，发展顺利。", fortune: "家庭财产稳定。", love: "感情稳定，适宜结婚。", health: "家庭温暖，身心健康。", change: "家人嗃嗃，悔厉吉。家人严厉教诲，虽严厉但吉祥。" },
    38: { overall: "睽卦象征乖离背离。运势不顺，需要调和。", career: "与合作伙伴有分歧，需调和。", fortune: "财务有分歧，需谨慎处理。", love: "产生误会，需要沟通。", health: "注意调和气血。", change: "睽孤遇元夫。孤单遇到有德之人。" },
    39: { overall: "蹇卦象征行走艰难。运势艰难，需耐心。", career: "前进困难，需要等待。", fortune: "财务困难，需谨慎。", love: "感情道路艰难。", health: "注意脚部保养。", change: "往蹇来誉。前往艰难，返回获得荣誉。" },
    40: { overall: "解卦象征解除困难。运势好转，困难解除。", career: "困难解除，发展顺利。", fortune: "财务困难解除。", love: "误会解除，感情顺利。", health: "身体康复。", change: "公用射隼于高墉之上，获之，无不利。公在城墙上射鹰，获得，没有不吉利。" },
    41: { overall: "损卦象征减损减少。运势有损但终吉。", career: "需要减少开支或成本。", fortune: "收益减少，但终有收获。", love: "适当让步，感情更稳。", health: "注意调理身体。", change: "已事遄往，无咎，酌损之。事情已快过去，没有灾祸，酌情减少。" },
    42: { overall: "益卦象征增益利益。运势吉顺，收益增加。", career: "收益增加，事业进步。", fortune: "财运增长，收益丰厚。", love: "感情增益，关系更好。", health: "身体健康增益。", change: "有孚惠心，勿问元吉。有诚信惠及内心，不用问，大吉。" },
    43: { overall: "夬卦象征决断果断。运势需果断决策。", career: "需要果断决策，把握时机。", fortune: "果断投资，获得收益。", love: "果断表白，成功率高。", health: "注意调理肝胆。", change: "壮于前趾，往无咎。脚趾受伤，前往没有灾祸。" },
    44: { overall: "姤卦象征相遇邂逅。运势吉顺，意外相遇。", career: "意外机会出现，把握机遇。", fortune: "意外收益，注意把握。", love: "意外相遇，有缘千里。", health: "注意调理身体。", change: "臀无肤，其行次且。臀部受伤，行走困难。" },
    45: { overall: "萃卦象征聚集荟萃。运势吉顺，力量汇聚。", career: "团队聚集力量，共同发展。", fortune: "聚集财富，收益增加。", love: "缘分聚集，有缘相遇。", health: "气血聚集，身体健康。", change: "萃如嗟如，无攸利。聚集叹息，无所得利。" },
    46: { overall: "升卦象征上升提升。运势上升，步步高升。", career: "职位上升，事业发展。", fortune: "财运上升，收益增加。", love: "感情上升，关系进步。", health: "气血上升，身体健康。", change: "升虚邑。上升至空城。" },
    47: { overall: "困卦象征困顿窘迫。运势艰难，需要坚持。", career: "遇到困境，需要坚持。", fortune: "财务困顿，需耐心等待。", love: "感情困顿，需耐心沟通。", health: "注意身体健康。", change: "困于酒食，朱绂方来。困于酒食，贵人到来。" },
    48: { overall: "井卦象征水井汲取。运势稳定，持续收益。", career: "持续稳定发展。", fortune: "持续收益，稳步增长。", love: "感情稳定持续。", health: "注意泌尿系统。", change: "井渫不食，为我心恻。井水清洁却不吃，我心悲伤。" },
    49: { overall: "革卦象征改革变革。运势变革，转机出现。", career: "改革创新，迎来转机。", fortune: "变革中获得收益。", love: "关系发生变革。", health: "注意调节身体。", change: "巩用黄牛之革。用黄牛皮巩固。" },
    50: { overall: "鼎卦象征鼎立稳定。运势稳定，权威建立。", career: "权威建立，地位稳固。", fortune: "收益稳定，财富积累。", love: "关系稳固。", health: "注意调理脾胃。", change: "鼎折足，覆公餗。鼎折断足，打翻公饭。" },
    51: { overall: "震卦象征震动雷鸣。运势震动，变化剧烈。", career: "有震动变化，把握机会。", fortune: "震动中获得收益。", love: "感情有震动。", health: "注意心脏健康。", change: "震来虩虩，笑言哑哑。雷声震动，先恐惧后笑语。" },
    52: { overall: "艮卦象征静止停止。运势静止，需暂停等待。", career: "暂停等待，不宜冒进。", fortune: "暂停行动，保存实力。", love: "暂停发展。", health: "注意静养。", change: "艮其腓，不拯其随。止住小腿，不拯救随从。" },
    53: { overall: "渐卦象征渐进发展。运势平稳，逐步发展。", career: "逐步发展，稳步前进。", fortune: "逐步积累，稳步增长。", love: "逐步发展，瓜熟蒂落。", health: "逐步康复。", change: "鸿渐于陆，夫征不复。鸿雁渐于陆地，丈夫出征不归。" },
    54: { overall: "归妹卦象征少女出嫁。运势归顺，事物归位。", career: "回归本位，事物归位。", fortune: "收益归位。", love: "出嫁成婚，适宜婚嫁。", health: "注意调理身体。", change: "归妹愆期，迟归有时。少女延误婚期，延迟出嫁有时机。" },
    55: { overall: "丰卦象征丰富丰盛。运势大吉，收获丰富。", career: "成就丰富，事业丰收。", fortune: "收益丰富，财运亨通。", love: "感情丰富甜蜜。", health: "气血丰富，健康良好。", change: "丰其蔀，日中见斗。丰富掩盖，白天见星。" },
    56: { overall: "旅卦象征旅途行旅。运势奔波，需要移动。", career: "外出发展，旅行转运。", fortune: "外出求财。", love: "旅途中有缘分。", health: "注意旅途安全。", change: "旅焚其次，丧其童仆。旅行失火，丢失童仆。" },
    57: { overall: "巽卦象征顺从进入。运势顺从，逐步进入。", career: "顺从趋势，进入发展。", fortune: "顺从投资，获得收益。", love: "顺从对方，关系发展。", health: "注意调理气血。", change: "巽在床下，用史巫纷若。顺从在床下，祝史巫觋纷纷到来。" },
    58: { overall: "兑卦象征喜悦愉快。运势吉顺，心情愉快。", career: "工作顺利，心情愉快。", fortune: "收益增加，心情愉快。", love: "感情甜蜜愉快。", health: "气血和畅。", change: "孚兑，吉，悔亡。诚信喜悦，吉祥无悔。" },
    59: { overall: "涣卦象征涣散离散。运势初散后聚。", career: "初期分散，最终聚集。", fortune: "分散投资，终有收益。", love: "初期离散，后期聚合。", health: "注意调理气血。", change: "用拯马壮，吉。用拯救的马强壮，吉祥。" },
    60: { overall: "节卦象征节制规律。运势需要节制。", career: "需要节制，不可过度。", fortune: "控制开支，适度消费。", love: "适度投入，不过于热情。", health: "注意节制饮食。", change: "不节若，则嗟若。不节制，就会叹息。" },
    61: { overall: "中孚卦象征内心诚信。运势吉顺，诚信为本。", career: "以诚信获得成功。", fortune: "诚信投资，获得收益。", love: "真心诚信，感情稳定。", health: "心态诚信，身心健康。", change: "有孚挛如，富以其邻。有诚信关联，依靠邻居致富。" },
    62: { overall: "小过卦象征小有过越。运势有小过但无碍。", career: "有小失误，但无大碍。", fortune: "有小收益，注意细节。", love: "有小误会，可化解。", health: "注意小病防治。", change: "弗过防之，从或戕之。不过预防，跟随可能受害。" },
    63: { overall: "既济卦象征事已成功。运势大吉，事成圆满。", career: "事业成功，目标达成。", fortune: "财运成功，收益圆满。", love: "感情成功，终成眷属。", health: "身体健康圆满。", change: "濡其首，厉。弄湿头，危险。" },
    64: { overall: "未济卦象征事未成功。运势未完成，待发展。", career: "事业未竟，仍需努力。", fortune: "财运未竟，仍有发展。", love: "感情未成，仍需培养。", health: "身体未完全康复。", change: "濡其尾，曳其轮。弄湿尾巴，拖住车轮。" }
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
  // 确保数据已加载
  if (!yijingData || yijingData.length === 0) {
    alert('数据加载中，请稍后再试');
    return;
  }
  
  const num1 = Math.floor(Math.random() * 900) + 100;
  const num2 = Math.floor(Math.random() * 900) + 100;
  const num3 = Math.floor(Math.random() * 900) + 100;
  
  document.getElementById('num1').value = num1;
  document.getElementById('num2').value = num2;
  document.getElementById('num3').value = num3;
  
  // 自动起卦
  startDivination();
}

// 重置
function reset() {
  document.getElementById('num1').value = '';
  document.getElementById('num2').value = '';
  document.getElementById('num3').value = '';
  document.getElementById('result').classList.add('hidden');
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

// 全局导出 - 确保所有函数可被HTML调用
window.yijingData = null;
window.getInterp = getHexagramInterpretation;

window.loadData = async function() {
  try {
    const response = await fetch('data/yijing.json');
    const data = await response.json();
    window.yijingData = data.hexagrams;
    console.log('已加载 ' + window.yijingData.length + ' 卦');
    return window.yijingData;
  } catch (error) {
    console.error('加载数据失败:', error);
    return null;
  }
};

// 预加载数据
window.loadData();
