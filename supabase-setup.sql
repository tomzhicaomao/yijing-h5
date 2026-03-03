-- 在 Supabase SQL Editor 中执行

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  points INTEGER DEFAULT 10,
  invite_code TEXT UNIQUE,
  invited_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建历史记录表
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  hexagram_id INTEGER NOT NULL,
  hexagram_name TEXT NOT NULL,
  hexagram_symbol TEXT,
  ai_interpretation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 兼容已存在表结构
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by INTEGER REFERENCES users(id);
ALTER TABLE history ADD COLUMN IF NOT EXISTS ai_interpretation TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS users_invite_code_idx ON users(invite_code);

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- 历史表策略
CREATE POLICY "history_select" ON history FOR SELECT USING (true);
CREATE POLICY "history_insert" ON history FOR INSERT WITH CHECK (true);
CREATE POLICY "history_select_own" ON history FOR SELECT USING (true);
CREATE POLICY "history_insert_own" ON history FOR INSERT WITH CHECK (true);
