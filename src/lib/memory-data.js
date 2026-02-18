// OpenClaw Memory Data Layer - reads from memory files
// No Supabase - everything stored locally in /data/.openclaw/workspace/memory/

const API_BASE = '/api/memory'

export async function fetchMemoryData(type = 'today') {
  try {
    const response = await fetch(`${API_BASE}?type=${type}`)
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Error fetching memory:', err)
    return {}
  }
}

export async function getTasks() {
  try {
    const data = await fetchMemoryData('tasks')
    return data.tasks || []
  } catch (err) {
    return []
  }
}

export async function getClients() {
  try {
    const data = await fetchMemoryData('clients')
    return data.clients || []
  } catch (err) {
    return []
  }
}

export async function getActivities() {
  try {
    const data = await fetchMemoryData('activities')
    return data.activities || []
  } catch (err) {
    return []
  }
}

export async function getFinancials() {
  try {
    const data = await fetchMemoryData('financials')
    return data.financials || []
  } catch (err) {
    return []
  }
}

export async function getDailyMetrics() {
  try {
    const data = await fetchMemoryData('metrics')
    return data
  } catch (err) {
    return { tasks: 0, revenue: 0, expenses: 0, energy: 0 }
  }
}

export async function logActivity(activity) {
  try {
    const response = await fetch(`${API_BASE}?type=log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity })
    })
    return response.ok
  } catch (err) {
    console.error('Error logging activity:', err)
    return false
  }
}
