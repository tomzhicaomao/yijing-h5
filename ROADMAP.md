# 易经 H5 路线图

## 版本历史

| 版本 | 功能 | 状态 |
| ---- | ---- | ---- |
| v0.1 | MVP（古文版） | ✅ |
| v0.2 | +白话文翻译 | ✅ 部分 |
| v0.3 | 紫色星空主题 + 每日一占 | ✅ |
| v0.4 | 高端APP风格 + 白话文 | ✅ |
| v1.0 | 代码重构 + PWA支持 | 🔄 进行中 |

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
│       └── app.js      # 主应用
├── data/
│   └── yijing.json     # 64卦数据
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
- [ ] AI 智能解读
- [ ] 微信小程序版
- [ ] 用户反馈系统
- [ ] 数据统计分析