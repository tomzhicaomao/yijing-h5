/**
 * 易经占卜 - 用户反馈模块
 * 负责用户反馈的提交和管理
 */

const Feedback = {
  /**
   * 反馈类型
   */
  TYPES: {
    BUG: 'bug',           // Bug反馈
    SUGGESTION: 'suggest', // 功能建议
    OTHER: 'other'        // 其他
  },

  /**
   * 反馈类型标签
   */
  TYPE_LABELS: {
    bug: '🐛 Bug反馈',
    suggest: '💡 功能建议',
    other: '📝 其他'
  },

  /**
   * 提交反馈
   * @param {Object} data - 反馈数据
   * @param {string} data.type - 反馈类型
   * @param {string} data.content - 反馈内容
   * @param {string} [data.screenshot] - 截图（Base64或URL）
   * @param {string} [data.contact] - 联系方式
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async submit(data) {
    // 验证
    if (!data.content || data.content.trim().length < 5) {
      return { success: false, message: '请输入至少5个字的反馈内容' };
    }

    if (data.content.length > 1000) {
      return { success: false, message: '反馈内容不能超过1000字' };
    }

    // 构建反馈对象
    const feedback = {
      feedback_type: data.type || this.TYPES.OTHER,
      content: data.content.trim(),
      contact: data.contact?.trim() || null,
      screenshot_url: null,
      user_id: User.current?.id || null,
      user_agent: navigator.userAgent,
      page_url: window.location.href
    };

    // 处理截图上传
    if (data.screenshot) {
      try {
        const url = await this.uploadScreenshot(data.screenshot);
        if (url) {
          feedback.screenshot_url = url;
        }
      } catch (error) {
        console.error('截图上传失败:', error);
        // 截图上传失败不影响反馈提交
      }
    }

    // 保存到数据库
    try {
      const success = await DB.save('feedback', feedback);
      if (success) {
        // 保存到本地历史
        this.saveToLocal(feedback);
        return { success: true, message: '感谢您的反馈！我们会认真处理' };
      }
      return { success: false, message: '提交失败，请稍后重试' };
    } catch (error) {
      console.error('提交反馈失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  },

  /**
   * 上传截图到存储服务
   * @param {string} screenshot - Base64截图数据
   * @returns {Promise<string|null>} - 图片URL
   */
  async uploadScreenshot(screenshot) {
    // 如果已经是URL，直接返回
    if (screenshot.startsWith('http')) {
      return screenshot;
    }

    // 检查是否有 Supabase Storage
    const url = window.APP_CONFIG?.SUPABASE_URL;
    const key = window.APP_CONFIG?.SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn('Supabase未配置，无法上传截图');
      return null;
    }

    try {
      // 从Base64提取图片数据
      const base64Data = screenshot.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // 生成文件名
      const fileName = `feedback/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;

      // 上传到 Supabase Storage
      const response = await fetch(`${url}/storage/v1/object/feedback-screenshots/${fileName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'x-upsert': 'true'
        },
        body: byteArray
      });

      if (response.ok) {
        // 返回公开URL
        return `${url}/storage/v1/object/public/feedback-screenshots/${fileName}`;
      }

      console.error('截图上传失败:', await response.text());
      return null;
    } catch (error) {
      console.error('截图上传异常:', error);
      return null;
    }
  },

  /**
   * 获取用户反馈历史
   * @returns {Promise<Array>}
   */
  async getHistory() {
    // 先获取本地历史
    const localHistory = this.getLocalHistory();

    // 如果用户已登录，尝试从服务器获取
    if (User.current?.id) {
      try {
        const remote = await DB.query('feedback', `user_id=eq.${User.current.id}&order=created_at.desc&limit=20`);
        if (remote && remote.length > 0) {
          // 合并本地和远程数据
          const localIds = new Set(localHistory.map(h => h.content));
          remote.forEach(r => {
            if (!localIds.has(r.content)) {
              localHistory.push({
                id: r.id,
                type: r.feedback_type,
                content: r.content,
                status: r.status,
                adminReply: r.admin_reply,
                time: r.created_at
              });
            }
          });
          // 按时间排序
          localHistory.sort((a, b) => new Date(b.time) - new Date(a.time));
        }
      } catch (error) {
        console.error('获取反馈历史失败:', error);
      }
    }

    return localHistory.slice(0, 20);
  },

  /**
   * 保存到本地历史
   * @param {Object} feedback
   */
  saveToLocal(feedback) {
    const history = this.getLocalHistory();
    history.unshift({
      id: Date.now().toString(),
      type: feedback.feedback_type,
      content: feedback.content,
      status: 'pending',
      time: new Date().toISOString()
    });
    // 只保留最近20条
    if (history.length > 20) {
      history.length = 20;
    }
    localStorage.setItem('yijing_feedback_history', JSON.stringify(history));
  },

  /**
   * 获取本地历史
   * @returns {Array}
   */
  getLocalHistory() {
    try {
      return JSON.parse(localStorage.getItem('yijing_feedback_history')) || [];
    } catch {
      return [];
    }
  },

  /**
   * 捕获当前页面截图
   * @returns {Promise<string|null>} - Base64截图数据
   */
  async captureScreen() {
    // 检查是否支持截图
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      console.warn('当前浏览器不支持屏幕截图');
      return null;
    }

    try {
      // 请求屏幕共享
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });

      // 创建视频元素捕获帧
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      // 等待一帧
      await new Promise(resolve => setTimeout(resolve, 100));

      // 创建canvas绘制
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // 停止屏幕共享
      stream.getTracks().forEach(track => track.stop());

      // 返回Base64
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('截图失败:', error);
      return null;
    }
  },

  /**
   * 获取状态标签
   * @param {string} status
   * @returns {string}
   */
  getStatusLabel(status) {
    const labels = {
      pending: '⏳ 待处理',
      processing: '🔄 处理中',
      resolved: '✅ 已解决'
    };
    return labels[status] || status;
  }
};

// 导出
window.Feedback = Feedback;