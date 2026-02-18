import axios from 'axios'
import { supabase } from './supabase'

// OpenClaw system integration - real-time data from the operating system
const OPENCLAW_BASE = 'http://localhost:3000' // OpenClaw local API

export async function getSystemStatus() {
  try {
    // Get current session info
    const response = await axios.get(`${OPENCLAW_BASE}/api/status`, { timeout: 5000 })
    return response.data
  } catch (err) {
    console.log('OpenClaw API not available locally, using fallback')
    return null
  }
}

export async function getActiveSessions() {
  try {
    const response = await axios.get(`${OPENCLAW_BASE}/api/sessions`, { timeout: 5000 })
    return response.data || []
  } catch (err) {
    return []
  }
}

export async function getRecentActivity() {
  try {
    // Read activity from system logs
    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    return data || []
  } catch (err) {
    return []
  }
}

export async function getRealTimeTokenUsage() {
  try {
    const { data } = await supabase
      .from('token_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (!data) return { hourly: 0, daily: 0, total: 0 }
    
    const now = new Date()
    const oneHourAgo = new Date(now - 60 * 60 * 1000)
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000)
    
    const hourlyUsage = data
      .filter(log => new Date(log.created_at) > oneHourAgo)
      .reduce((sum, log) => sum + log.cost, 0)
    
    const dailyUsage = data
      .filter(log => new Date(log.created_at) > oneDayAgo)
      .reduce((sum, log) => sum + log.cost, 0)
    
    const totalUsage = data.reduce((sum, log) => sum + log.cost, 0)
    
    return {
      hourly: hourlyUsage,
      daily: dailyUsage,
      total: totalUsage,
      logs: data.slice(0, 20)
    }
  } catch (err) {
    return { hourly: 0, daily: 0, total: 0, logs: [] }
  }
}

export async function getJackyActivityFeed() {
  try {
    const { data } = await supabase
      .from('partnership_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
    return data || []
  } catch (err) {
    return []
  }
}

export async function logActivityEvent(event) {
  try {
    const { error } = await supabase.from('activity_logs').insert([{
      event_type: event.type,
      description: event.description,
      metadata: event.metadata || {},
      created_at: new Date().toISOString()
    }])
    return !error
  } catch (err) {
    return false
  }
}

export async function getSystemHealthMetrics() {
  try {
    // Aggregate data to show system health
    const { data: tokens } = await supabase.from('token_logs').select('cost').order('created_at', { ascending: false }).limit(24)
    const { data: sessions } = await supabase.from('sessions').select('*')
    const { data: tasks } = await supabase.from('tasks').select('status')
    
    const avgTokenCost = tokens?.length > 0 
      ? tokens.reduce((sum, t) => sum + t.cost, 0) / tokens.length 
      : 0
    
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
    const activeTasks = tasks?.filter(t => t.status !== 'completed').length || 0
    
    return {
      activeSessions: sessions?.length || 0,
      avgHourlyTokenCost: avgTokenCost.toFixed(2),
      completedTasks,
      activeTasks,
      totalTasks: tasks?.length || 0,
      systemHealth: 'Operational'
    }
  } catch (err) {
    return {
      activeSessions: 0,
      avgHourlyTokenCost: 0,
      completedTasks: 0,
      activeTasks: 0,
      totalTasks: 0,
      systemHealth: 'Unknown'
    }
  }
}

// Monitor OpenClaw in real-time
export function subscribeToSystemEvents(callback) {
  // Set up real-time subscription to activity logs
  const subscription = supabase
    .from('activity_logs')
    .on('*', payload => {
      callback(payload)
    })
    .subscribe()
  
  return () => subscription.unsubscribe()
}
