# 易经占卜 H5 - 配置说明

## 环境配置

在部署前，请创建 `src/js/config.js` 文件：

```javascript
window.APP_CONFIG = {
  // Supabase 配置
  SUPABASE_URL: 'your-supabase-url',
  SUPABASE_ANON_KEY: 'your-anon-key',
  
  // 功能开关
  ENABLE_HISTORY: true,
  ENABLE_RECHARGE: true,
  DEFAULT_POINTS: 10
};
```

## 部署方式

### Vercel
```bash
vercel deploy
```

### 本地预览
```bash
npx http-server . -p 8080
```

## 安全建议

1. **不要在前端暴露敏感信息**
   - 使用 Supabase RLS (Row Level Security) 保护数据
   -anon key 是公开的，但要配置好 RLS 策略

2. **RLS 策略示例**
   ```sql
   -- 用户只能查看自己的历史记录
   CREATE POLICY "history_own" ON history
     FOR ALL USING (auth.uid()::text = user_id::text);
   ```

3. **使用 Supabase Auth**
   - 建议使用 Supabase Auth SDK 替代自定义用户系统
   - 支持多种登录方式（邮箱、OAuth）

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2024-02 | 初始版本 |
| v1.1 | 2024-02 | 代码重构、PWA支持、安全优化 |