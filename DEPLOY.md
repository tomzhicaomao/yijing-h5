# 易经占卜 App - 部署指南

## 方式一：Vercel（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 进入项目目录
cd yijing-h5

# 3. 一键部署
vercel deploy
```

## 方式二：GitHub + Vercel（自动部署）

1. 推送代码到 GitHub
2. Vercel 后台添加仓库
3. 自动部署

## 方式三：Netlify（拖拽部署）

1. 打包 `yijing-h5` 文件夹
2. 拖拽到 https://app.netlify.com/drop

## 预览

```bash
cd yijing-h5
python3 -m http.server 8080
# 打开 http://localhost:8080
```

---

## 当前版本

- **状态**：MVP 已完成
- **核心功能**：起卦 + 卦辞 + 爻辞（古文）
- **数据**：64卦 + 384爻
- **技术**：纯前端 H5

## 后续迭代

- 白话文翻译
- UI 优化
- 新功能添加
