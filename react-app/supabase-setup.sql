-- 易经占卜历史记录表
-- 在 Supabase 控制台执行此 SQL 创建表

-- 创建表
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

-- 创建索引以优化查询
CREATE INDEX idx_divination_history_user_id ON divination_history(user_id);
CREATE INDEX idx_divination_history_created_at ON divination_history(created_at DESC);
