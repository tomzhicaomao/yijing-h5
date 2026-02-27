# 易经 H5 路线图

## 版本历史

| 版本 | 功能 | 状态 |
| ---- | ---- | ---- |
| v0.1 | MVP（古文版） | ✅ |
| v0.2 | +白话文翻译 | ✅ 部分 |
| v0.3 | 紫色星空主题 + 每日一占 | ✅ |
| v0.4 | 高端APP风格 + 白话文 | ✅ |
| v1.0 | 代码重构 + PWA支持 | ✅ |
| v1.1 | AI智能解读功能 | ✅ |
| v1.2 | 用户反馈系统 | ✅ |

## v1.0 更新内容

### 🔧 代码重构
- [x] 模块化拆分 (config/storage/db/yijing/user/ui/app)
- [x] CSS 独立文件
- [x] 移除内联样式
- [x] 遵循 Google JavaScript 风格指南

### 🔒 安全优化
- [x] 配置文件分离 (config.js)
- [x] 环境变量支持
- [x] API Key 隔离

### ⚡ PWA 支持
- [x] manifest.json
- [x] Service Worker (sw.js)
- [x] 离线缓存
- [x] 安装支持

### 🎨 UI/UX 优化
- [x] 加载状态动画
- [x] Toast 提示组件
- [x] 移动端键盘适配
- [x] 平滑滚动

### 📱 移动端优化
- [x] Safe Area 支持
- [x] 触摸优化
- [x] inputmode 数字键盘

## 文件结构

```
yijing-h5/
├── index.html          # 主页面 (重构后)
├── index-new.html      # 新版本预览
├── manifest.json       # PWA 配置
├── sw.js              # Service Worker
├── package.json       # 项目配置
├── README.md          # 说明文档
├── src/
│   ├── css/
│   │   └── main.css   # 主样式
│   └── js/
│       ├── config.js   # 配置模块
│       ├── storage.js  # 本地存储
│       ├── db.js       # 数据库操作
│       ├── yijing.js   # 易经核心
│       ├── user.js     # 用户模块
│       ├── ui.js       # UI组件
│       ├── app.js      # 主应用
│       ├── ai-interpret.js # AI解读模块 (v1.1)
│       └── feedback.js # 反馈模块 (v1.2)
├── data/
│   └── yijing.json     # 64卦数据
├── sql/
│   └── feedback.sql    # 反馈表建表语句 (v1.2)
└── icons/
    └── icon-192.svg    # 应用图标
```

## 部署

### Vercel (推荐)
```bash
vercel deploy
```

### 本地预览
```bash
npx http-server . -p 8080
```

## 安全建议

1. **不要在前端暴露敏感信息**
   - Supabase anon key 是公开的，但必须配置 RLS 策略
   - 生产环境建议使用 Supabase Auth SDK

2. **RLS 策略示例**
   ```sql
   -- 用户只能查看自己的历史记录
   CREATE POLICY "history_own" ON history
     FOR ALL USING (auth.uid()::text = user_id::text);
   ```

## 后续计划

- [ ] 完善白话文翻译 (64卦完整版)
- [x] AI 智能解读 ✅ v1.1
- [ ] 微信小程序版
- [x] 用户反馈系统 ✅ v1.2
- [ ] 数据统计分析

---

## v1.1 更新内容 (AI智能解读)

### 🤖 AI解读功能
- [x] 支持多种AI服务商（通义千问、DeepSeek、OpenAI、自定义API）
- [x] 根据卦象生成个性化深度解读
- [x] 本地缓存机制（7天有效），避免重复调用节省成本
- [x] 积分消耗机制（每次AI解读消耗2积分）
- [x] 用户隐私保护（不发送敏感用户数据）

### 🔧 技术实现
- [x] 新增 `src/js/ai-interpret.js` 模块
- [x] AI设置弹窗UI
- [x] AI解读按钮与结果展示区域
- [x] 缓存系统（基于localStorage）
- [x] API密钥本地存储

### 📝 AI解读内容
- 核心启示
- 时机判断
- 具体建议（事业、感情、健康）
- 注意事项
- 心态指引

### 💡 使用说明
1. 点击「AI智能解读」按钮
2. 首次使用需配置AI密钥
3. 支持的AI服务商：
   - 通义千问（阿里云）：https://dashscope.console.aliyun.com/
   - DeepSeek：https://platform.deepseek.com/
   - OpenAI：https://platform.openai.com/api-keys
   - 自定义API（兼容OpenAI格式）

---

## v1.2 更新内容 (用户反馈系统)

### 💬 反馈功能
- [x] 反馈入口按钮（侧边浮动按钮 💬）
- [x] 反馈弹窗UI
  - [x] 反馈类型选择（Bug/建议/其他）
  - [x] 文本输入框（1000字限制，实时字数统计）
  - [x] 截图上传（支持屏幕截图和图片文件上传）
  - [x] 联系方式输入（可选）
- [x] 反馈历史查看
- [x] 管理员回复展示

### 🔧 技术实现
- [x] 新增 `src/js/feedback.js` 反馈模块
- [x] 新增 `sql/feedback.sql` 数据库建表语句
- [x] 本地缓存 + 远端同步机制
- [x] 支持匿名反馈

### 📁 数据表结构 (Supabase)
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,                    -- 用户ID
  feedback_type TEXT NOT NULL,     -- 类型：bug/suggest/other
  content TEXT NOT NULL,           -- 内容
  screenshot_url TEXT,             -- 截图URL
  contact TEXT,                    -- 联系方式
  status TEXT DEFAULT 'pending',   -- 状态
  admin_reply TEXT,                -- 管理员回复
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 📋 文件更新
```
yijing-h5/
├── src/js/feedback.js    # 新增：反馈模块
├── sql/feedback.sql      # 新增：数据库建表语句
├── index.html            # 更新：添加反馈UI
└── ROADMAP.md            # 更新：文档
```

### 💡 使用说明
1. 点击右下角 💬 按钮打开反馈弹窗
2. 选择反馈类型
3. 输入问题描述
4. 可选：添加截图、联系方式
5. 提交反馈
6. 可在「反馈历史」中查看处理状态