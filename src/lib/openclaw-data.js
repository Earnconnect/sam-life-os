import fs from 'fs'
import path from 'path'

const DATA_DIR = '/data/.openclaw/workspace/data'
const MEMORY_DIR = '/data/.openclaw/workspace/memory'

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Initialize data storage
export function initializeDataStore() {
  ensureDir(DATA_DIR)
  ensureDir(MEMORY_DIR)
}

// ============================================
// TASKS
// ============================================

export function getTasks() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'tasks.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading tasks:', err)
    return []
  }
}

export function addTask(task) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'tasks.json')
    
    const tasks = getTasks()
    const newTask = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...task
    }
    
    tasks.push(newTask)
    fs.writeFileSync(filepath, JSON.stringify(tasks, null, 2))
    
    // Log to memory
    logActivityToMemory(`Task Created: "${task.title}" (${task.status || 'todo'})`)
    
    return newTask
  } catch (err) {
    console.error('Error adding task:', err)
    return null
  }
}

export function updateTask(id, updates) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'tasks.json')
    
    const tasks = getTasks()
    const index = tasks.findIndex(t => t.id === id)
    
    if (index === -1) return null
    
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() }
    fs.writeFileSync(filepath, JSON.stringify(tasks, null, 2))
    
    logActivityToMemory(`Task Updated: "${tasks[index].title}"`)
    
    return tasks[index]
  } catch (err) {
    console.error('Error updating task:', err)
    return null
  }
}

export function deleteTask(id) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'tasks.json')
    
    const tasks = getTasks()
    const filtered = tasks.filter(t => t.id !== id)
    
    fs.writeFileSync(filepath, JSON.stringify(filtered, null, 2))
    
    logActivityToMemory(`Task Deleted`)
    
    return true
  } catch (err) {
    console.error('Error deleting task:', err)
    return false
  }
}

// ============================================
// CLIENTS
// ============================================

export function getClients() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'clients.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading clients:', err)
    return []
  }
}

export function addClient(client) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'clients.json')
    
    const clients = getClients()
    const newClient = {
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...client
    }
    
    clients.push(newClient)
    fs.writeFileSync(filepath, JSON.stringify(clients, null, 2))
    
    logActivityToMemory(`New Client: ${client.name}`)
    
    return newClient
  } catch (err) {
    console.error('Error adding client:', err)
    return null
  }
}

export function updateClient(id, updates) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'clients.json')
    
    const clients = getClients()
    const index = clients.findIndex(c => c.id === id)
    
    if (index === -1) return null
    
    clients[index] = { ...clients[index], ...updates, updatedAt: new Date().toISOString() }
    fs.writeFileSync(filepath, JSON.stringify(clients, null, 2))
    
    logActivityToMemory(`Client Updated: ${clients[index].name}`)
    
    return clients[index]
  } catch (err) {
    console.error('Error updating client:', err)
    return null
  }
}

export function deleteClient(id) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'clients.json')
    
    const clients = getClients()
    const filtered = clients.filter(c => c.id !== id)
    
    fs.writeFileSync(filepath, JSON.stringify(filtered, null, 2))
    
    logActivityToMemory(`Client Removed`)
    
    return true
  } catch (err) {
    console.error('Error deleting client:', err)
    return false
  }
}

// ============================================
// PROSPECTS / PIPELINE
// ============================================

export function getProspects() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'prospects.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading prospects:', err)
    return []
  }
}

export function addProspect(prospect) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'prospects.json')
    
    const prospects = getProspects()
    const newProspect = {
      id: `prospect-${Date.now()}`,
      createdAt: new Date().toISOString(),
      stage: 'lead',
      ...prospect
    }
    
    prospects.push(newProspect)
    fs.writeFileSync(filepath, JSON.stringify(prospects, null, 2))
    
    logActivityToMemory(`New Prospect: ${prospect.name} (${prospect.stage || 'lead'})`)
    
    return newProspect
  } catch (err) {
    console.error('Error adding prospect:', err)
    return null
  }
}

export function updateProspect(id, updates) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'prospects.json')
    
    const prospects = getProspects()
    const index = prospects.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    prospects[index] = { ...prospects[index], ...updates, updatedAt: new Date().toISOString() }
    fs.writeFileSync(filepath, JSON.stringify(prospects, null, 2))
    
    logActivityToMemory(`Prospect Updated: ${prospects[index].name}`)
    
    return prospects[index]
  } catch (err) {
    console.error('Error updating prospect:', err)
    return null
  }
}

// ============================================
// PROJECTS / BUILDING
// ============================================

export function getProjects() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'projects.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading projects:', err)
    return []
  }
}

export function addProject(project) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'projects.json')
    
    const projects = getProjects()
    const newProject = {
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      ...project
    }
    
    projects.push(newProject)
    fs.writeFileSync(filepath, JSON.stringify(projects, null, 2))
    
    logActivityToMemory(`New Project: ${project.name}`)
    
    return newProject
  } catch (err) {
    console.error('Error adding project:', err)
    return null
  }
}

export function updateProject(id, updates) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'projects.json')
    
    const projects = getProjects()
    const index = projects.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() }
    fs.writeFileSync(filepath, JSON.stringify(projects, null, 2))
    
    logActivityToMemory(`Project Updated: ${projects[index].name}`)
    
    return projects[index]
  } catch (err) {
    console.error('Error updating project:', err)
    return null
  }
}

// ============================================
// FINANCIALS
// ============================================

export function getFinancials() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'financials.json')
    
    if (!fs.existsSync(filepath)) {
      return { revenue: [], expenses: [], total: { mrr: 0, revenue: 0, expenses: 0 } }
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading financials:', err)
    return { revenue: [], expenses: [], total: { mrr: 0, revenue: 0, expenses: 0 } }
  }
}

export function logRevenue(item) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'financials.json')
    
    const financials = getFinancials()
    const newItem = {
      id: `revenue-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'revenue',
      ...item
    }
    
    financials.revenue.push(newItem)
    
    // Recalculate totals
    financials.total.revenue = financials.revenue.reduce((sum, r) => sum + (r.amount || 0), 0)
    financials.total.mrr = financials.revenue
      .filter(r => r.recurring === true)
      .reduce((sum, r) => sum + (r.amount || 0), 0)
    
    fs.writeFileSync(filepath, JSON.stringify(financials, null, 2))
    
    logActivityToMemory(`Revenue Logged: $${item.amount} - ${item.description}`)
    
    return newItem
  } catch (err) {
    console.error('Error logging revenue:', err)
    return null
  }
}

export function logExpense(item) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'financials.json')
    
    const financials = getFinancials()
    const newItem = {
      id: `expense-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'expense',
      ...item
    }
    
    financials.expenses.push(newItem)
    
    // Recalculate totals
    financials.total.expenses = financials.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    
    fs.writeFileSync(filepath, JSON.stringify(financials, null, 2))
    
    logActivityToMemory(`Expense Logged: $${item.amount} - ${item.description}`)
    
    return newItem
  } catch (err) {
    console.error('Error logging expense:', err)
    return null
  }
}

// ============================================
// TOKEN / API COSTS
// ============================================

export function getTokenLogs() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'tokens.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading token logs:', err)
    return []
  }
}

export function logTokenUsage(usage) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'tokens.json')
    
    const logs = getTokenLogs()
    const newLog = {
      id: `token-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...usage
    }
    
    logs.push(newLog)
    fs.writeFileSync(filepath, JSON.stringify(logs, null, 2))
    
    return newLog
  } catch (err) {
    console.error('Error logging token usage:', err)
    return null
  }
}

// ============================================
// DAILY CHECKINS
// ============================================

export function getDailyCheckins() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'checkins.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading checkins:', err)
    return []
  }
}

export function logDailyCheckin(checkin) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'checkins.json')
    
    const checkins = getDailyCheckins()
    const newCheckin = {
      id: `checkin-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...checkin
    }
    
    checkins.push(newCheckin)
    fs.writeFileSync(filepath, JSON.stringify(checkins, null, 2))
    
    logActivityToMemory(`Daily Checkin: Energy ${checkin.energy}/10, Focus ${checkin.focus}/10`)
    
    return newCheckin
  } catch (err) {
    console.error('Error logging checkin:', err)
    return null
  }
}

// ============================================
// IDEAS & EXPERIMENTS
// ============================================

export function getIdeas() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'ideas.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading ideas:', err)
    return []
  }
}

export function addIdea(idea) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'ideas.json')
    
    const ideas = getIdeas()
    const newIdea = {
      id: `idea-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft',
      ...idea
    }
    
    ideas.push(newIdea)
    fs.writeFileSync(filepath, JSON.stringify(ideas, null, 2))
    
    logActivityToMemory(`New Idea: ${idea.title}`)
    
    return newIdea
  } catch (err) {
    console.error('Error adding idea:', err)
    return null
  }
}

// ============================================
// WEEKLY REVIEWS
// ============================================

export function getWeeklyReviews() {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'reviews.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading reviews:', err)
    return []
  }
}

export function addWeeklyReview(review) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'reviews.json')
    
    const reviews = getWeeklyReviews()
    const newReview = {
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      week: getWeekNumber(),
      ...review
    }
    
    reviews.push(newReview)
    fs.writeFileSync(filepath, JSON.stringify(reviews, null, 2))
    
    logActivityToMemory(`Weekly Review: ${review.title}`)
    
    return newReview
  } catch (err) {
    console.error('Error adding review:', err)
    return null
  }
}

// ============================================
// ACTIVITY LOG
// ============================================

export function getActivityLog(limit = 50) {
  try {
    ensureDir(DATA_DIR)
    const filepath = path.join(DATA_DIR, 'activity.json')
    
    if (!fs.existsSync(filepath)) {
      return []
    }
    
    const data = fs.readFileSync(filepath, 'utf-8')
    const activities = JSON.parse(data)
    
    return activities.slice(-limit).reverse()
  } catch (err) {
    console.error('Error reading activity log:', err)
    return []
  }
}

// ============================================
// MEMORY & LOGGING
// ============================================

function logActivityToMemory(message) {
  try {
    ensureDir(MEMORY_DIR)
    const today = new Date().toISOString().split('T')[0]
    const filepath = path.join(MEMORY_DIR, `${today}.md`)
    
    let content = ''
    if (fs.existsSync(filepath)) {
      content = fs.readFileSync(filepath, 'utf-8')
    } else {
      content = `# ${today} - Daily Log\n\n`
    }
    
    const timestamp = new Date().toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
    
    content += `- [${timestamp}] ${message}\n`
    
    fs.writeFileSync(filepath, content, 'utf-8')
  } catch (err) {
    console.error('Error logging to memory:', err)
  }
}

function getWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now - start
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay / 7)
}

// ============================================
// SYNC & EXPORT
// ============================================

export function exportAllData() {
  return {
    tasks: getTasks(),
    clients: getClients(),
    prospects: getProspects(),
    projects: getProjects(),
    financials: getFinancials(),
    tokens: getTokenLogs(),
    checkins: getDailyCheckins(),
    ideas: getIdeas(),
    reviews: getWeeklyReviews(),
    activity: getActivityLog(),
    timestamp: new Date().toISOString()
  }
}

export function importData(data) {
  try {
    ensureDir(DATA_DIR)
    
    if (data.tasks) fs.writeFileSync(path.join(DATA_DIR, 'tasks.json'), JSON.stringify(data.tasks, null, 2))
    if (data.clients) fs.writeFileSync(path.join(DATA_DIR, 'clients.json'), JSON.stringify(data.clients, null, 2))
    if (data.prospects) fs.writeFileSync(path.join(DATA_DIR, 'prospects.json'), JSON.stringify(data.prospects, null, 2))
    if (data.projects) fs.writeFileSync(path.join(DATA_DIR, 'projects.json'), JSON.stringify(data.projects, null, 2))
    if (data.financials) fs.writeFileSync(path.join(DATA_DIR, 'financials.json'), JSON.stringify(data.financials, null, 2))
    if (data.tokens) fs.writeFileSync(path.join(DATA_DIR, 'tokens.json'), JSON.stringify(data.tokens, null, 2))
    if (data.checkins) fs.writeFileSync(path.join(DATA_DIR, 'checkins.json'), JSON.stringify(data.checkins, null, 2))
    if (data.ideas) fs.writeFileSync(path.join(DATA_DIR, 'ideas.json'), JSON.stringify(data.ideas, null, 2))
    if (data.reviews) fs.writeFileSync(path.join(DATA_DIR, 'reviews.json'), JSON.stringify(data.reviews, null, 2))
    
    return true
  } catch (err) {
    console.error('Error importing data:', err)
    return false
  }
}
