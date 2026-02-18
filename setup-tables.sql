-- Create all tables for Sam's Life OS

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'in-progress', 'pending')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  mrr_value NUMERIC DEFAULT 0,
  product TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  health_score INT DEFAULT 85,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Prospects table (for sales pipeline)
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stage TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'prospect', 'qualified', 'closed')),
  next_action TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Financials table
CREATE TABLE IF NOT EXISTS financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('revenue', 'expense')),
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Token logs table
CREATE TABLE IF NOT EXISTS token_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL CHECK (service IN ('openai', 'claude', 'assemblyai')),
  cost NUMERIC NOT NULL,
  token_count INT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'in-progress',
  progress INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Daily checkins table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  energy_level INT,
  focus TEXT,
  summary TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Time logs table
CREATE TABLE IF NOT EXISTS time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity TEXT,
  duration_minutes INT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'idea',
  outcome TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Weekly reviews table
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of DATE,
  decisions TEXT,
  lessons TEXT,
  what_worked TEXT,
  blockers TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Partnership notes table
CREATE TABLE IF NOT EXISTS partnership_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'jacky_note',
  created_at TIMESTAMP DEFAULT now()
);

-- Activity logs table (for system tracking)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now()
);

-- Sessions table (for tracking OpenClaw sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow anonymous read/write)
CREATE POLICY "Enable all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON prospects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON financials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON token_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON daily_checkins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON time_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON weekly_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON partnership_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- Insert test data
INSERT INTO tasks (title, status, priority, due_date) VALUES
('Test: Check Life OS Dashboard', 'in-progress', 'high', CURRENT_DATE);

INSERT INTO clients (name, status, mrr_value, product, health_score) VALUES
('TechCorp Solutions', 'active', 2499, 'MeetingMind', 85),
('Finance Professionals Ltd', 'active', 2499, 'Lodigi', 88),
('Marketing Agency Pro', 'active', 2499, 'MeetingMind', 82);

INSERT INTO prospects (name, stage, next_action) VALUES
('Startup AI Labs', 'lead', 'Send intro email'),
('Enterprise Corp', 'prospect', 'Schedule demo'),
('Tech Innovations', 'qualified', 'Prepare proposal');

INSERT INTO financials (category, amount, type, description, date) VALUES
('MeetingMind - TechCorp', 2499, 'revenue', 'Monthly subscription', CURRENT_DATE - 10),
('Lodigi - Finance Pros', 2499, 'revenue', 'Monthly subscription', CURRENT_DATE - 10),
('MeetingMind - Marketing Agency', 2499, 'revenue', 'Monthly subscription', CURRENT_DATE),
('API Costs (OpenAI)', 700, 'expense', 'Token usage', CURRENT_DATE),
('Hosting & Infrastructure', 500, 'expense', 'Netlify + Supabase', CURRENT_DATE),
('Software Licenses', 300, 'expense', 'n8n + tools', CURRENT_DATE - 5);

INSERT INTO token_logs (service, cost, token_count, date) VALUES
('openai', 120, 700000, CURRENT_DATE - 4),
('openai', 140, 800000, CURRENT_DATE - 3),
('openai', 130, 750000, CURRENT_DATE - 2),
('openai', 150, 850000, CURRENT_DATE - 1),
('openai', 160, 900000, CURRENT_DATE),
('claude', 95, 500000, CURRENT_DATE - 4),
('claude', 110, 550000, CURRENT_DATE - 3),
('claude', 105, 530000, CURRENT_DATE - 2),
('claude', 120, 600000, CURRENT_DATE - 1),
('claude', 130, 650000, CURRENT_DATE),
('assemblyai', 45, 15, CURRENT_DATE - 4),
('assemblyai', 50, 17, CURRENT_DATE - 3),
('assemblyai', 48, 16, CURRENT_DATE - 2),
('assemblyai', 55, 18, CURRENT_DATE - 1),
('assemblyai', 60, 20, CURRENT_DATE);

INSERT INTO partnership_notes (content, type) VALUES
('Building Sam''s Life OS - real-time system integration complete', 'jacky_note'),
('Dashboard deployed and live at sam-life-os-prod.netlify.app', 'jacky_note'),
('Waiting for Supabase tables to be created - then everything will sync', 'jacky_note');
