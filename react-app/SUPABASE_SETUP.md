# Supabase 云端同步配置指南

## 1️⃣ 在 Supabase 控制台执行 SQL

访问：https://esmgqpttyqufbqlgxslj.supabase.co

进入 **SQL Editor**，执行以下 SQL：

```sql
-- 易经占卜历史记录表
CREATE TABLE IF NOT EXISTS divination_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT,
  divination_type TEXT,
  hexagram_id INTEGER,
  hexagram_name TEXT,
  transformed_hexagram_id INTEGER,
  transformed_hexagram_name TEXT,
  moving_lines INTEGER[],
  interpretation TEXT,
  master_advice TEXT,
  luck_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE divination_history ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的历史记录
CREATE POLICY "users_own_history" ON divination_history
  FOR ALL USING (auth.uid() = user_id);

-- 允许匿名插入（需要用户登录）
CREATE POLICY "authenticated_insert" ON divination_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 允许认证用户查询
CREATE POLICY "authenticated_select" ON divination_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 创建索引
CREATE INDEX idx_divination_history_user_id ON divination_history(user_id);
CREATE INDEX idx_divination_history_created_at ON divination_history(created_at DESC);
```

## 2️⃣ 在 Vercel 添加环境变量

访问：https://vercel.com/dashboard

选择 `yijing-h5` 项目 → **Settings** → **Environment Variables**

添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://esmgqpttyqufbqlgxslj.supabase.co` | Production |
| `VITE_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Production |
| `VITE_DEEPSEEK_API_KEY` | `sk-your-api-key` | Production (可选) |

## 3️⃣ 启用 Supabase 认证（可选）

在 Supabase 控制台：
1. 进入 **Authentication** → **Providers**
2. 启用 **Email** 认证
3. 配置邮件模板（可选）

## 4️⃣ 测试验证

部署完成后访问线上版本：

1. 打开浏览器开发者工具（F12）
2. 进行占卜操作
3. 查看 **Network** 标签，应该有 Supabase API 调用
4. 检查 **Console**，无错误
5. 刷新页面，历史记录应从云端加载

## 📊 功能说明

### 当前实现
- ✅ 本地存储（localStorage）作为缓存
- ✅ 云端同步（Supabase）作为主存储
- ✅ 用户认证后可跨设备同步历史记录
- ✅ 未登录时使用本地存储

### 数据安全
- 行级安全策略（RLS）确保用户只能访问自己的数据
- 匿名 Key 仅允许访问授权数据
- 敏感操作需要用户认证

## 🐛 故障排查

### 问题：历史记录未同步
1. 检查 Vercel 环境变量是否正确
2. 检查 Supabase 表是否创建成功
3. 查看浏览器 Console 错误信息

### 问题：用户无法登录
1. 检查 Supabase Authentication 是否启用
2. 验证 Email Provider 配置
3. 检查邮件是否被标记为垃圾邮件

## 📝 备注

- 代码已实现降级策略：Supabase 失败时自动使用 localStorage
- 建议在生产环境充分测试后再推广使用
