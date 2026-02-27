/**
 * 易经占卜 - 核心模块
 * 负责卦象计算、数据处理
 */

const Yijing = {
  data: null,
  loading: false,
  
  // 八卦符号
  BAGUA: ['', '☷', '☴', '☲', '☳', '☱', '☵', '☶', '☰'],
  
  // 卦名映射
  GUA_NAMES: {
    1: '乾', 2: '坤', 3: '屯', 4: '蒙', 5: '需', 6: '讼', 7: '师', 8: '比',
    9: '小畜', 10: '履', 11: '泰', 12: '否', 13: '同人', 14: '大有', 15: '谦', 16: '豫',
    17: '随', 18: '蛊', 19: '临', 20: '观', 21: '噬嗑', 22: '贲', 23: '剥', 24: '复',
    25: '无妄', 26: '大畜', 27: '颐', 28: '大过', 29: '坎', 30: '离', 31: '咸', 32: '恒',
    33: '遯', 34: '大壮', 35: '晋', 36: '明夷', 37: '家人', 38: '睽', 39: '蹇', 40: '解',
    41: '损', 42: '益', 43: '夬', 44: '姤', 45: '萃', 46: '升', 47: '困', 48: '井',
    49: '革', 50: '鼎', 51: '震', 52: '艮', 53: '渐', 54: '归妹', 55: '丰', 56: '旅',
    57: '巽', 58: '兑', 59: '涣', 60: '节', 61: '中孚', 62: '小过', 63: '既济', 64: '未济'
  },
  
  /**
   * 加载卦象数据
   */
  async loadData() {
    if (this.data) return this.data;
    if (this.loading) {
      // 等待加载完成
      return new Promise((resolve) => {
        const check = () => {
          if (this.data) resolve(this.data);
          else setTimeout(check, 100);
        };
        check();
      });
    }
    
    this.loading = true;
    
    try {
      const response = await fetch('data/yijing.json');
      const json = await response.json();
      this.data = json.hexagrams;
      console.log(`已加载 ${this.data.length} 卦`);
      return this.data;
    } catch (error) {
      console.error('加载数据失败:', error);
      return null;
    } finally {
      this.loading = false;
    }
  },
  
  /**
   * 生成卦象符号
   */
  getSymbol(id) {
    for (let shang = 1; shang <= 8; shang++) {
      for (let xia = 1; xia <= 8; xia++) {
        if (shang * 8 + xia - 8 === id) {
          return this.BAGUA[shang] + this.BAGUA[xia];
        }
      }
    }
    return '☰☷';
  },
  
  /**
   * 起卦计算
   */
  calculate(n1, n2, n3) {
    const xiaGua = (n1 % 8) || 8;
    const shangGua = (n2 % 8) || 8;
    const dongYao = ((n3 - 1) % 6) + 1;
    return { xiaGua, shangGua, dongYao };
  },
  
  /**
   * 查找卦象
   */
  findHexagram(xiaGua, shangGua) {
    const id = shangGua * 8 + xiaGua - 8;
    return this.data?.find(g => g.id === id) || null;
  },
  
  /**
   * 根据ID获取卦象
   */
  getById(id) {
    return this.data?.find(g => g.id === id) || null;
  },
  
  /**
   * 获取解读
   */
  getInterpretation(id, dongYao) {
    const interpretations = {
      1: { overall: "乾卦象征天，代表刚健有力、纯阳至正之气。运势如飞龙在天，大吉大利。", career: "事业正处于上升通道，有贵人相助，宜把握时机积极进取。", fortune: "财运亨通，有意外之财的可能，但需注意合理分配。", love: "感情运势旺盛，单身者有望遇到优质对象。", health: "身体状态良好，精力充沛，适合运动锻炼。", change: "飞龙在天，利见大人。把握机遇，可成就大事。" },
      2: { overall: "坤卦象征地，代表柔顺、厚重、包容之气。运势平稳，需要以柔克刚。", career: "工作需要稳扎稳打，不可急于求成。多倾听他人意见。", fortune: "财运平稳，支出需有计划，适合进行长期储蓄。", love: "感情需要耐心经营，以真诚和包容对待对方。", health: "注意脾胃健康，饮食规律，适当散步。", change: "龙战于野，其血玄黄。需防竞争小人，以退为进。" },
      3: { overall: "屯卦象征事物初生之状态，虽有困难但前景光明。", career: "创业或新项目会遇到阻碍，但这是积累经验的必要过程。", fortune: "财运初起步，投入需谨慎，小额尝试为宜。", love: "感情发展需耐心，不可急于确定关系。", health: "注意预防感冒，保持充足睡眠。", change: "乘马班如，求婚媾。把握机遇，吉祥无不利。" },
      4: { overall: "蒙卦象征蒙昧未开，需要启发教育。运势初启，需要学习启蒙。", career: "适合学习新技能或接受培训，不宜急于求成。", fortune: "财运处于初期阶段，需要虚心学习理财知识。", love: "感情需要慢慢培养，不宜操之过急。", health: "注意调节作息，保持良好的生活习惯。", change: "利用刑人，以正法也。通过学习启蒙，获得成长。" },
      5: { overall: "需卦象征等待时机。运势需要耐心等待，不可盲目行动。", career: "正处蓄势待发阶段，需要等待合适时机。", fortune: "财运有望但需耐心等待，不宜急躁投资。", love: "需要耐心等待缘分，不可强求。", health: "保持平和心态，避免焦虑情绪。", change: "需于郊，利用恒，无咎。在郊外等待，保持恒心必有好结果。" },
      6: { overall: "讼卦象征争讼纠纷。运势多波折，需谨慎处理人际关系。", career: "工作中可能遇到竞争或纠纷，需要冷静处理。", fortune: "财务上有争端风险，宜守不宜攻。", love: "感情中有误会需要及时沟通化解。", health: "注意肝气郁结，保持心平气和。", change: "不永所事，讼不可长也。争讼不可持续，应及时止戈。" },
      7: { overall: "师卦象征军队战争。运势涉及团队协作与领导能力。", career: "需要团结协作，适合带领团队完成目标。", fortune: "适合集体投资或合作项目。", love: "需要主动表达，但要注意方式方法。", health: "注意预防心血管疾病。", change: "师出以律，否臧凶。军队出发要有纪律，否则有凶险。" },
      8: { overall: "比卦象征亲比依附。运势吉顺，适合寻求合作与支持。", career: "寻找合作伙伴或支持者，时机有利。", fortune: "合作财运，可考虑合伙生意。", love: "单身者有望通过朋友介绍认识新人。", health: "保持身心和谐，适当社交。", change: "比之初六，有他吉也。亲比之初，获得他人帮助有吉利。" },
      9: { overall: "小畜卦象征小有积蓄。运势逐步积累，财富缓慢增长。", career: "稳扎稳打，循序渐进积累成就。", fortune: "财富逐步积累，适合储蓄理财。", love: "感情发展平稳，渐入佳境。", health: "注意营养补充，身体日渐强健。", change: "有孚挛如，富以其邻。保持诚信，与他人共同富裕。" },
      10: { overall: "履卦象征履行实践。运势需要脚踏实地行动。", career: "需要履行责任，脚踏实地做事。", fortune: "通过正当努力获得收益。", love: "以诚相待，稳步发展感情。", health: "注意足部健康，适当运动。", change: "眇能视，跛能履。虽有小缺陷，但能履行使命。" },
      11: { overall: "泰卦象征天地通泰。运势大吉，万事如意。", career: "事业蒸蒸日上，各方面顺利。", fortune: "财运亨通，适宜发展事业。", love: "感情甜蜜幸福，鸾凤和鸣。", health: "身体健康，精力充沛。", change: "无平不陂，无往不复。万物盛衰循环，保持平衡。" },
      12: { overall: "否卦象征天地不通。运势受阻，需要耐心等待转机。", career: "事业遇到瓶颈，需要暂时蛰伏。", fortune: "财务收益下降，需谨慎管理。", love: "感情出现阻碍，需要耐心沟通。", health: "注意调节情绪，保持乐观。", change: "倾否，先否后喜。先经历困阻，后有喜悦。" }
    };
    
    // 添加剩余卦象解读...
    const defaultInterp = interpretations[id] || {
      overall: "此卦提醒您保持中正平和的心态，顺势而为，静待时机。",
      career: "脚踏实地做好眼前工作，积累经验等待机会。",
      fortune: "财运平稳，建议稳健理财，避免投机。",
      love: "以真诚待人，顺其自然发展。",
      health: "保持规律作息，适当运动。",
      change: "变爻带来转变，顺势而动可获吉祥。"
    };
    
    // 扩展解读数据
    const extended = this.getExtendedInterpretations();
    return extended[id] || defaultInterp;
  },
  
  /**
   * 扩展解读数据
   */
  getExtendedInterpretations() {
    return {
      1: { overall: "乾卦象征天，代表刚健有力、纯阳至正之气。运势如飞龙在天，大吉大利。", career: "事业正处于上升通道，有贵人相助，宜把握时机积极进取。", fortune: "财运亨通，有意外之财的可能，但需注意合理分配。", love: "感情运势旺盛，单身者有望遇到优质对象。", health: "身体状态良好，精力充沛，适合运动锻炼。", change: "飞龙在天，利见大人。把握机遇，可成就大事。" },
      2: { overall: "坤卦象征地，代表柔顺、厚重、包容之气。运势平稳，需要以柔克刚。", career: "工作需要稳扎稳打，不可急于求成。多倾听他人意见。", fortune: "财运平稳，支出需有计划，适合进行长期储蓄。", love: "感情需要耐心经营，以真诚和包容对待对方。", health: "注意脾胃健康，饮食规律，适当散步。", change: "龙战于野，其血玄黄。需防竞争小人，以退为进。" },
      13: { overall: "同人卦象征同人于野。运势吉顺，适合与他人合作。", career: "适合团队合作，共同发展事业。", fortune: "合作共赢，财运来自集体努力。", love: "有缘千里来相会，感情顺利。", health: "气血和畅，身体健康。", change: "同人于郊，志未得也。在郊外与人同心，但志向未实现。" },
      14: { overall: "大有卦象征大有收获。运势大吉，收获丰富。", career: "事业成就显著，获得丰硕成果。", fortune: "财运旺盛，收益颇丰。", love: "感情收获满满，幸福美满。", health: "身心康泰，状态良好。", change: "厥孚交如，信以发志也。以诚信交往，发挥志向。" },
      15: { overall: "谦卦象征谦虚谦逊。运势吉顺，以柔克刚。", career: "以谦虚态度获得他人认可。", fortune: "收益稳定，谦虚得财。", love: "以诚相待，感情稳定发展。", health: "心态平和，身心健康。", change: "鸣谦，贞吉。谦虚的名声传播，吉祥如意。" },
      16: { overall: "豫卦象征欢乐愉快。运势吉顺，享受当下。", career: "工作顺利，心情愉快。", fortune: "收益稳定，适宜享受生活。", love: "感情甜蜜，生活幸福。", health: "身心愉悦，注意休息。", change: "由豫，大有得。欢乐来源于内心，收获丰富。" },
      63: { overall: "既济卦象征事已成功。运势大吉，事成圆满。", career: "事业成功，目标达成。", fortune: "财运成功，收益圆满。", love: "感情成功，终成眷属。", health: "身体健康圆满。", change: "濡其首，厉。弄湿头，危险。" },
      64: { overall: "未济卦象征事未成功。运势未完成，待发展。", career: "事业未竟，仍需努力。", fortune: "财运未竟，仍有发展。", love: "感情未成，仍需培养。", health: "身体未完全康复。", change: "濡其尾，曳其轮。弄湿尾巴，拖住车轮。" }
    };
  },
  
  /**
   * 生成随机数
   */
  randomNumbers() {
    return [
      Math.floor(Math.random() * 900) + 100,
      Math.floor(Math.random() * 900) + 100,
      Math.floor(Math.random() * 900) + 100
    ];
  },
  
  /**
   * 生成每日种子
   */
  dailySeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },
  
  /**
   * 从种子生成数字
   */
  seedToNumber(seed, offset) {
    return Math.floor((seed * 9301 + 49297 * offset) % 233280 / 233280 * 900) + 100;
  }
};

// 导出
window.Yijing = Yijing;