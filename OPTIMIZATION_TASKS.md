# yijing-h5 优化任务清单（执行版）

## 项目信息
- 项目路径：`~/.openclaw/workspace-pm01/projects/yijing-h5`
- 代码仓库：`https://github.com/tomzhicaomao/yijing-h5.git`
- 部署目标：Vercel

## 优先级任务

### P1 架构与工程化
- [ ] 统一入口：`src/main.js`
- [ ] 清理临时文件（如 `*.tmp`）
- [ ] 拆分模块：`config/divination/history/ui/user`
- [ ] 增加 `eslint` 与 `prettier`
- [ ] 保证 `npm run dev`/`npm run build`/`npm run preview` 可用

### P1 功能稳定性
- [ ] 起卦流程异常处理（空数据/非法状态）
- [ ] 历史记录读写容错
- [ ] 每日一占去重逻辑
- [ ] 关键交互 loading 与错误提示

### P2 性能与体验
- [ ] 优化首屏加载
- [ ] Service Worker 缓存策略校准
- [ ] 触屏交互与动画卡顿优化

### P2 后端接入（按需）
- [ ] 使用 Supabase Auth（禁止自建密码表）
- [ ] 历史记录表与 RLS 策略设计
- [ ] `.env` 与部署变量管理

### P3 质量体系
- [ ] 单元测试覆盖核心逻辑
- [ ] E2E 覆盖关键路径
- [ ] QA 审核模板接入团队流程

## 安全约束（强制）
- 禁止在业务表中保存明文密码
- 禁止提交密钥到仓库
- 所有关键改动必须有回滚方案

## 交付要求
1. 变更清单（文件级）
2. 本地验证命令与结果
3. QA 报告（无 P0/P1）
4. 发布说明与回滚步骤
