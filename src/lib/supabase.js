import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://llstjelzrvspxvoffpuc.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3RqZWx6cnZzcHh2b2ZmcHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTgwNjIsImV4cCI6MjA4Njk5NDA2Mn0.Ag2zCHFcgnArH3EB0e4OelmX0PHKrFW66aVwztCqg2o'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Real-time data fetchers
export async function fetchDailyCheckIn() {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
  return data?.[0] || null
}

export async function fetchActiveClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('status', 'active')
  return data || []
}

export async function fetchPipeline() {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function fetchTokenUsage() {
  const { data, error } = await supabase
    .from('token_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)
  return data || []
}

export async function fetchFinancials() {
  const { data, error } = await supabase
    .from('financials')
    .select('*')
    .order('date', { ascending: false })
  return data || []
}

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}
