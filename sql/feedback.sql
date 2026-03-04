-- ============================================
-- 易经占卜 - 用户反馈系统 SQL
-- Supabase 数据库建表语句
-- ============================================

-- 1. 创建反馈表
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,                    -- 用户ID（可为空，支持匿名反馈）
  feedback_type TEXT NOT NULL,     -- 反馈类型：bug/suggest/other
  content TEXT NOT NULL,           -- 反馈内容
  screenshot_url TEXT,             -- 截图URL（可选）
  contact TEXT,                    -- 联系方式（可选）
  user_agent TEXT,                 -- 用户浏览器信息
  page_url TEXT,                   -- 反馈页面URL
  status TEXT DEFAULT 'pending',   -- 状态：pending/processing/resolved
  admin_reply TEXT,                -- 管理员回复
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- 3. 启用行级安全策略 (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
-- 允许所有人提交反馈（匿名用户也可以）
CREATE POLICY "feedback_insert_policy" ON feedback
  FOR INSERT
  WITH CHECK (true);

-- 允许用户查看自己的反馈（通过user_id匹配）
CREATE POLICY "feedback_select_own" ON feedback
  FOR SELECT
  USING (
    -- 如果有用户ID，则只允许查看自己的
    (user_id IS NOT NULL AND user_id = current_setting('request.jwt.claims', true)::json->>'sub')
    OR
    -- 或者用户未登录时，允许查看（这里我们放宽策略，允许查看所有）
    true
  );

-- 管理员可以查看所有反馈（需要配置管理员角色）
-- CREATE POLICY "feedback_select_admin" ON feedback
--   FOR SELECT
--   USING (auth.jwt() ->> 'role' = 'admin');

-- 管理员可以更新反馈状态和回复
-- CREATE POLICY "feedback_update_admin" ON feedback
--   FOR UPDATE
--   USING (auth.jwt() ->> 'role' = 'admin');

-- 5. 创建触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. 创建存储桶（用于截图上传）
-- 注意：需要在 Supabase 控制台手动创建存储桶 'feedback-screenshots'
-- 并设置为公开访问

-- 7. 存储桶策略（可选，在控制台配置更方便）
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('feedback-screenshots', 'feedback-screenshots', true)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 使用说明
-- ============================================
-- 
-- 1. 在 Supabase 控制台的 SQL Editor 中执行此脚本
-- 
-- 2. 创建存储桶：
--    - 进入 Storage 页面
--    - 点击 "Create a new bucket"
--    - 名称: feedback-screenshots
--    - 勾选 "Public bucket"
-- 
-- 3. 配置存储桶策略（允许上传）：
--    INSERT INTO storage.objects (name, bucket_id)
--    VALUES ('feedback/*', 'feedback-screenshots');
--    
--    CREATE POLICY "Allow public uploads" ON storage.objects
--    FOR INSERT WITH CHECK (bucket_id = 'feedback-screenshots');
-- 
-- 4. 测试：
--    - 提交一条反馈
--    - 在 Table Editor 中查看 feedback 表
-- 
-- ============================================
-- 管理员查询示例
-- ============================================
-- 
-- 查看所有待处理的反馈：
-- SELECT * FROM feedback WHERE status = 'pending' ORDER BY created_at DESC;
-- 
-- 统计反馈类型：
-- SELECT feedback_type, COUNT(*) FROM feedback GROUP BY feedback_type;
-- 
-- 回复反馈：
-- UPDATE feedback SET status = 'resolved', admin_reply = '感谢反馈，问题已修复' WHERE id = 'xxx';
-- 
-- ============================================