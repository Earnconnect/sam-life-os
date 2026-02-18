// API Client for communicating with the local OpenClaw data server

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// Helper for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error)
    throw error
  }
}

// ============================================
// TASKS
// ============================================

export async function fetchTasks() {
  return apiCall('/tasks')
}

export async function createTask(task) {
  return apiCall('/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  })
}

export async function updateTaskAPI(id, updates) {
  return apiCall(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

export async function deleteTaskAPI(id) {
  return apiCall(`/tasks/${id}`, {
    method: 'DELETE'
  })
}

// ============================================
// CLIENTS
// ============================================

export async function fetchClients() {
  return apiCall('/clients')
}

export async function createClient(client) {
  return apiCall('/clients', {
    method: 'POST',
    body: JSON.stringify(client)
  })
}

export async function updateClientAPI(id, updates) {
  return apiCall(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

export async function deleteClientAPI(id) {
  return apiCall(`/clients/${id}`, {
    method: 'DELETE'
  })
}

// ============================================
// PROSPECTS
// ============================================

export async function fetchProspects() {
  return apiCall('/prospects')
}

export async function createProspect(prospect) {
  return apiCall('/prospects', {
    method: 'POST',
    body: JSON.stringify(prospect)
  })
}

export async function updateProspectAPI(id, updates) {
  return apiCall(`/prospects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

// ============================================
// PROJECTS
// ============================================

export async function fetchProjects() {
  return apiCall('/projects')
}

export async function createProject(project) {
  return apiCall('/projects', {
    method: 'POST',
    body: JSON.stringify(project)
  })
}

export async function updateProjectAPI(id, updates) {
  return apiCall(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

// ============================================
// FINANCIALS
// ============================================

export async function fetchFinancials() {
  return apiCall('/financials')
}

export async function logRevenueAPI(item) {
  return apiCall('/financials/revenue', {
    method: 'POST',
    body: JSON.stringify(item)
  })
}

export async function logExpenseAPI(item) {
  return apiCall('/financials/expense', {
    method: 'POST',
    body: JSON.stringify(item)
  })
}

// ============================================
// TOKEN LOGS
// ============================================

export async function fetchTokenLogs() {
  return apiCall('/tokens')
}

export async function logTokenAPI(usage) {
  return apiCall('/tokens', {
    method: 'POST',
    body: JSON.stringify(usage)
  })
}

// ============================================
// CHECKINS
// ============================================

export async function fetchCheckins() {
  return apiCall('/checkins')
}

export async function createCheckinAPI(checkin) {
  return apiCall('/checkins', {
    method: 'POST',
    body: JSON.stringify(checkin)
  })
}

// ============================================
// IDEAS
// ============================================

export async function fetchIdeas() {
  return apiCall('/ideas')
}

export async function createIdeaAPI(idea) {
  return apiCall('/ideas', {
    method: 'POST',
    body: JSON.stringify(idea)
  })
}

// ============================================
// REVIEWS
// ============================================

export async function fetchReviews() {
  return apiCall('/reviews')
}

export async function createReviewAPI(review) {
  return apiCall('/reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  })
}

// ============================================
// ACTIVITY LOG
// ============================================

export async function fetchActivityLog(limit = 50) {
  return apiCall(`/activity?limit=${limit}`)
}

// ============================================
// DATA EXPORT/IMPORT
// ============================================

export async function exportData() {
  return apiCall('/export')
}

export async function importDataAPI(data) {
  return apiCall('/import', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// ============================================
// HEALTH CHECK
// ============================================

export async function healthCheck() {
  try {
    return await apiCall('/health')
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}
