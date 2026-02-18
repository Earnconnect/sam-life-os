// OpenClaw Memory - No Supabase
// All data stored in memory files at /data/.openclaw/workspace/memory/

const MEMORY_API = '/api/memory'

export const supabase = {
  // Dummy object for compatibility - actual data comes from memory API
  from: (table) => ({
    select: () => ({ data: [], error: null }),
  })
}

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
