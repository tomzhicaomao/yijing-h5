# yijing-h5 部署与回滚指南

## 本地开发
```bash
cd ~/.openclaw/workspace-pm01/projects/yijing-h5
npm install
npm run dev
```

## 构建预览
```bash
npm run build
npm run preview
```

## Vercel 部署

### 方式一：Git 自动部署（推荐）
1. 推送到 `main` 分支
2. Vercel 自动构建并发布

### 方式二：CLI 部署
```bash
npm i -g vercel
vercel deploy
```

## 环境变量（如接入 Supabase）
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

说明：
- 仅前端可公开 `anon key`
- `service_role` 绝不进入前端环境变量

## 发布前检查清单
- [ ] `npm run build` 成功
- [ ] 核心流程手测通过
- [ ] QA 无 P0/P1
- [ ] 回滚点可用（上一个稳定版本 tag）

## 回滚策略
1. 回退到上一个稳定 tag
2. 重新触发部署
3. 验证核心流程

示例：
```bash
git checkout <stable-tag>
git push origin HEAD:main --force-with-lease
```

> 仅在确认回滚方案后执行强推。
