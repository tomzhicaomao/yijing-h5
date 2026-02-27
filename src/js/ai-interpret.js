/**
 * 易经占卜 - AI智能解读模块
 * 版本: 1.0.0
 * 
 * 功能：
 * - 支持多种AI API（OpenAI、通义千问、DeepSeek等）
 * - 根据卦象生成个性化解读
 * - 本地缓存机制避免重复调用
 * - 隐私保护：不发送用户敏感数据
 */

const AIInterpret = {
  /**
   * 配置
   */
  config: {
    // 默认API配置（用户可自定义）
    provider: 'qwen', // openai | qwen | deepseek | custom
    apiKeys: {
      openai: '',
      qwen: '',
      deepseek: '',
      custom: ''
    },
    endpoints: {
      openai: 'https://api.openai.com/v1/chat/completions',
      qwen: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      deepseek: 'https://api.deepseek.com/v1/chat/completions',
      custom: ''
    },
    models: {
      openai: 'gpt-3.5-turbo',
      qwen: 'qwen-turbo',
      deepseek: 'deepseek-chat',
      custom: ''
    },
    // 缓存时间（7天）
    cacheTTL: 7 * 24 * 60 * 60 * 1000,
    // 单次解读最大token
    maxTokens: 1000,
    // 是否启用AI解读
    enabled: false,
    // 一次解读消耗的积分
    costPoints: 2
  },

  /**
   * 初始化
   */
  init() {
    this.loadConfig();
    this.checkAvailability();
    console.log('🤖 AI解读模块初始化完成，状态:', this.config.enabled ? '已启用' : '未配置');
  },

  /**
   * 从本地存储加载配置
   */
  loadConfig() {
    const saved = Storage.get('ai_config');
    if (saved) {
      this.config = { ...this.config, ...saved };
    }
  },

  /**
   * 保存配置到本地存储
   */
  saveConfig() {
    Storage.set('ai_config', {
      provider: this.config.provider,
      apiKeys: this.config.apiKeys,
      endpoints: this.config.endpoints,
      models: this.config.models,
      enabled: this.config.enabled
    });
  },

  /**
   * 设置API密钥
   * @param {string} provider - 提供商
   * @param {string} apiKey - API密钥
   */
  setApiKey(provider, apiKey) {
    this.config.apiKeys[provider] = apiKey;
    if (apiKey) {
      this.config.enabled = true;
      this.config.provider = provider;
    }
    this.saveConfig();
    this.checkAvailability();
  },

  /**
   * 设置自定义端点
   * @param {string} endpoint - API端点
   * @param {string} model - 模型名称
   */
  setCustomEndpoint(endpoint, model) {
    this.config.endpoints.custom = endpoint;
    this.config.models.custom = model;
    this.saveConfig();
  },

  /**
   * 检查API是否可用
   */
  checkAvailability() {
    const provider = this.config.provider;
    const key = this.config.apiKeys[provider];
    this.config.enabled = !!(key && key.length > 0);
    return this.config.enabled;
  },

  /**
   * 获取缓存键
   * @param {object} hex - 卦象数据
   * @param {number} dongYao - 动爻
   * @param {string} context - 用户上下文（可选）
   */
  getCacheKey(hex, dongYao, context = '') {
    // 使用卦象ID和动爻作为缓存键
    const base = `ai_${hex.id}_${dongYao}`;
    if (context) {
      // 对上下文进行简单hash
      const hash = this.simpleHash(context);
      return `${base}_${hash}`;
    }
    return base;
  },

  /**
   * 简单hash函数
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  /**
   * 获取缓存的解读
   */
  getCachedInterpretation(cacheKey) {
    const cache = Storage.getCache(cacheKey);
    if (cache) {
      console.log('✅ 使用缓存解读');
      return cache;
    }
    return null;
  },

  /**
   * 缓存解读结果
   */
  cacheInterpretation(cacheKey, interpretation) {
    Storage.setCache(cacheKey, interpretation);
  },

  /**
   * 构建提示词
   * @param {object} hex - 卦象数据
   * @param {number} dongYao - 动爻位置
   * @param {object} options - 附加选项
   */
  buildPrompt(hex, dongYao, options = {}) {
    const dongYaoText = hex.yao?.find(y => y.position === dongYao)?.yao_ci || '';
    const yaoList = hex.yao?.map(y => `${['初', '二', '三', '四', '五', '上'][y.position - 1]}爻：${y.yao_ci}`).join('\n') || '';

    const systemPrompt = `你是一位精通易经的智者，擅长用现代语言解读卦象，给人指引和启发。
请用温暖、智慧的语言，结合求卦者的具体情况，给出有深度的解读。

解读要求：
1. 整体基调：温和而不说教，指引而不强制
2. 语言风格：通俗易懂，避免生涩术语
3. 内容深度：结合卦象特点，给出切实可行的建议
4. 尊重隐私：不要追问敏感信息
5. 格式清晰：分点陈述，易于阅读`;

    const userPrompt = `请为我解读以下卦象：

【卦名】${hex.name}
【卦辞】${hex.gua_ci}
【动爻】第${dongYao}爻：${dongYaoText}

【六爻】
${yaoList}

${options.context ? `\n【我的情况】\n${options.context}\n` : ''}

请从以下几个方面给出解读：
1. **核心启示**：这个卦象的核心含义是什么？
2. **时机判断**：现在是否是行动的好时机？
3. **具体建议**：针对事业、感情、健康分别有什么建议？
4. **注意事项**：需要特别留意什么？
5. **心态指引**：应该保持怎样的心态？

请用温暖而有智慧的语言回答，字数控制在500字以内。`;

    return {
      system: systemPrompt,
      user: userPrompt
    };
  },

  /**
   * 调用OpenAI兼容API
   */
  async callOpenAICompatible(endpoint, apiKey, model, messages) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: this.config.maxTokens,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API调用失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '解读失败，请重试';
  },

  /**
   * 调用通义千问API
   */
  async callQwen(endpoint, apiKey, model, messages) {
    // 通义千问API格式
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        input: {
          messages: messages
        },
        parameters: {
          max_tokens: this.config.maxTokens,
          temperature: 0.8
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`通义千问API调用失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.output?.text || data.output?.choices?.[0]?.message?.content || '解读失败，请重试';
  },

  /**
   * 调用AI API获取解读
   */
  async fetchInterpretation(hex, dongYao, options = {}) {
    const provider = this.config.provider;
    const apiKey = this.config.apiKeys[provider];

    if (!apiKey) {
      throw new Error('请先配置API密钥');
    }

    const endpoint = this.config.endpoints[provider];
    const model = this.config.models[provider];
    const prompts = this.buildPrompt(hex, dongYao, options);

    const messages = [
      { role: 'system', content: prompts.system },
      { role: 'user', content: prompts.user }
    ];

    let result;
    if (provider === 'qwen') {
      result = await this.callQwen(endpoint, apiKey, model, messages);
    } else {
      // OpenAI兼容格式（OpenAI、DeepSeek等）
      result = await this.callOpenAICompatible(endpoint, apiKey, model, messages);
    }

    return result;
  },

  /**
   * 获取AI解读（带缓存）
   * @param {object} hex - 卦象数据
   * @param {number} dongYao - 动爻位置
   * @param {object} options - 选项
   * @returns {Promise<object>} 解读结果
   */
  async getInterpretation(hex, dongYao, options = {}) {
    // 检查是否可用
    if (!this.config.enabled) {
      return {
        success: false,
        error: 'AI解读未配置，请先设置API密钥',
        needsConfig: true
      };
    }

    // 检查积分
    if (!User.deductPoints(this.config.costPoints)) {
      return {
        success: false,
        error: `积分不足！AI解读需要${this.config.costPoints}积分`,
        needsRecharge: true
      };
    }

    // 检查缓存
    const cacheKey = this.getCacheKey(hex, dongYao, options.context);
    const cached = this.getCachedInterpretation(cacheKey);
    if (cached) {
      return {
        success: true,
        interpretation: cached,
        fromCache: true
      };
    }

    try {
      // 显示加载状态
      UI.toast('正在生成AI解读...', 5000);

      // 调用API
      const interpretation = await this.fetchInterpretation(hex, dongYao, options);

      // 缓存结果
      this.cacheInterpretation(cacheKey, interpretation);

      return {
        success: true,
        interpretation: interpretation,
        fromCache: false
      };
    } catch (error) {
      console.error('AI解读失败:', error);
      
      // 退还积分
      User.addPoints(this.config.costPoints);

      return {
        success: false,
        error: error.message || 'AI解读失败，请稍后重试'
      };
    }
  },

  /**
   * 解析AI返回的文本为结构化数据
   */
  parseInterpretation(text) {
    const sections = {
      core: '',
      timing: '',
      advice: '',
      caution: '',
      mindset: ''
    };

    // 尝试解析各个部分
    const patterns = {
      core: /(?:核心启示|核心含义)[：:]\s*([\s\S]*?)(?=\d+\.|$)/i,
      timing: /(?:时机判断|行动时机)[：:]\s*([\s\S]*?)(?=\d+\.|$)/i,
      advice: /(?:具体建议|建议)[：:]\s*([\s\S]*?)(?=\d+\.|$)/i,
      caution: /(?:注意事项|留意事项)[：:]\s*([\s\S]*?)(?=\d+\.|$)/i,
      mindset: /(?:心态指引|心态)[：:]\s*([\s\S]*?)(?=\d+\.|$)/i
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        sections[key] = match[1].trim();
      }
    }

    return sections;
  },

  /**
   * 格式化显示AI解读
   */
  formatDisplay(interpretation) {
    // 将Markdown格式转换为HTML
    let html = interpretation
      // 粗体
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // 标题
      .replace(/###\s*(.+)/g, '<h4>$1</h4>')
      .replace(/##\s*(.+)/g, '<h3>$1</h3>')
      // 列表
      .replace(/^\d+\.\s*(.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // 段落
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    return `<div class="ai-interpretation"><p>${html}</p></div>`;
  },

  /**
   * 打开AI设置弹窗
   */
  openSettingsModal() {
    const modal = document.getElementById('aiSettingsModal');
    if (modal) {
      // 填充当前配置
      const providerSelect = document.getElementById('aiProvider');
      const keyInput = document.getElementById('aiApiKey');
      const endpointInput = document.getElementById('aiEndpoint');
      const modelInput = document.getElementById('aiModel');

      if (providerSelect) providerSelect.value = this.config.provider;
      if (keyInput) keyInput.value = this.config.apiKeys[this.config.provider] || '';
      if (endpointInput) endpointInput.value = this.config.endpoints[this.config.provider] || '';
      if (modelInput) modelInput.value = this.config.models[this.config.provider] || '';

      modal.classList.add('show');
    }
  },

  /**
   * 保存AI设置
   */
  saveSettings() {
    const provider = document.getElementById('aiProvider')?.value;
    const apiKey = document.getElementById('aiApiKey')?.value.trim();
    const endpoint = document.getElementById('aiEndpoint')?.value.trim();
    const model = document.getElementById('aiModel')?.value.trim();

    if (provider && apiKey) {
      this.config.provider = provider;
      this.config.apiKeys[provider] = apiKey;
      if (endpoint) this.config.endpoints[provider] = endpoint;
      if (model) this.config.models[provider] = model;
      this.config.enabled = true;
      this.saveConfig();

      UI.toast('AI设置保存成功！');
      UI.closeModal('aiSettingsModal');
    } else {
      UI.toast('请选择提供商并输入API密钥');
    }
  },

  /**
   * 测试AI连接
   */
  async testConnection() {
    const provider = document.getElementById('aiProvider')?.value;
    const apiKey = document.getElementById('aiApiKey')?.value.trim();

    if (!provider || !apiKey) {
      UI.toast('请先填写API密钥');
      return;
    }

    UI.toast('正在测试连接...');

    try {
      // 临时设置配置
      const originalKey = this.config.apiKeys[provider];
      this.config.apiKeys[provider] = apiKey;
      this.config.provider = provider;

      // 构建测试消息
      const messages = [
        { role: 'system', content: '你是一个助手' },
        { role: 'user', content: '请回复"连接成功"' }
      ];

      const endpoint = this.config.endpoints[provider];
      const model = this.config.models[provider];

      let result;
      if (provider === 'qwen') {
        result = await this.callQwen(endpoint, apiKey, model, messages);
      } else {
        result = await this.callOpenAICompatible(endpoint, apiKey, model, messages);
      }

      // 恢复原配置
      this.config.apiKeys[provider] = originalKey;

      UI.toast('✅ 连接成功！');
      return true;
    } catch (error) {
      UI.toast('❌ 连接失败: ' + error.message);
      return false;
    }
  }
};

// 导出
window.AIInterpret = AIInterpret;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  AIInterpret.init();
});