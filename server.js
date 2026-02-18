import express from 'express'
import cors from 'cors'
import {
  getTasks, addTask, updateTask, deleteTask,
  getClients, addClient, updateClient, deleteClient,
  getProspects, addProspect, updateProspect,
  getProjects, addProject, updateProject,
  getFinancials, logRevenue, logExpense,
  getTokenLogs, logTokenUsage,
  getDailyCheckins, logDailyCheckin,
  getIdeas, addIdea,
  getWeeklyReviews, addWeeklyReview,
  getActivityLog,
  exportAllData, importData,
  initializeDataStore
} from './src/lib/openclaw-data.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize data store on startup
initializeDataStore()

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ============================================
// TASKS
// ============================================

app.get('/api/tasks', (req, res) => {
  const tasks = getTasks()
  res.json(tasks)
})

app.post('/api/tasks', (req, res) => {
  const task = addTask(req.body)
  res.json(task || { error: 'Failed to add task' })
})

app.put('/api/tasks/:id', (req, res) => {
  const task = updateTask(req.params.id, req.body)
  res.json(task || { error: 'Failed to update task' })
})

app.delete('/api/tasks/:id', (req, res) => {
  const success = deleteTask(req.params.id)
  res.json({ success })
})

// ============================================
// CLIENTS
// ============================================

app.get('/api/clients', (req, res) => {
  const clients = getClients()
  res.json(clients)
})

app.post('/api/clients', (req, res) => {
  const client = addClient(req.body)
  res.json(client || { error: 'Failed to add client' })
})

app.put('/api/clients/:id', (req, res) => {
  const client = updateClient(req.params.id, req.body)
  res.json(client || { error: 'Failed to update client' })
})

app.delete('/api/clients/:id', (req, res) => {
  const success = deleteClient(req.params.id)
  res.json({ success })
})

// ============================================
// PROSPECTS
// ============================================

app.get('/api/prospects', (req, res) => {
  const prospects = getProspects()
  res.json(prospects)
})

app.post('/api/prospects', (req, res) => {
  const prospect = addProspect(req.body)
  res.json(prospect || { error: 'Failed to add prospect' })
})

app.put('/api/prospects/:id', (req, res) => {
  const prospect = updateProspect(req.params.id, req.body)
  res.json(prospect || { error: 'Failed to update prospect' })
})

// ============================================
// PROJECTS
// ============================================

app.get('/api/projects', (req, res) => {
  const projects = getProjects()
  res.json(projects)
})

app.post('/api/projects', (req, res) => {
  const project = addProject(req.body)
  res.json(project || { error: 'Failed to add project' })
})

app.put('/api/projects/:id', (req, res) => {
  const project = updateProject(req.params.id, req.body)
  res.json(project || { error: 'Failed to update project' })
})

// ============================================
// FINANCIALS
// ============================================

app.get('/api/financials', (req, res) => {
  const financials = getFinancials()
  res.json(financials)
})

app.post('/api/financials/revenue', (req, res) => {
  const item = logRevenue(req.body)
  res.json(item || { error: 'Failed to log revenue' })
})

app.post('/api/financials/expense', (req, res) => {
  const item = logExpense(req.body)
  res.json(item || { error: 'Failed to log expense' })
})

// ============================================
// TOKENS
// ============================================

app.get('/api/tokens', (req, res) => {
  const logs = getTokenLogs()
  res.json(logs)
})

app.post('/api/tokens', (req, res) => {
  const log = logTokenUsage(req.body)
  res.json(log || { error: 'Failed to log token usage' })
})

// ============================================
// CHECKINS
// ============================================

app.get('/api/checkins', (req, res) => {
  const checkins = getDailyCheckins()
  res.json(checkins)
})

app.post('/api/checkins', (req, res) => {
  const checkin = logDailyCheckin(req.body)
  res.json(checkin || { error: 'Failed to log checkin' })
})

// ============================================
// IDEAS
// ============================================

app.get('/api/ideas', (req, res) => {
  const ideas = getIdeas()
  res.json(ideas)
})

app.post('/api/ideas', (req, res) => {
  const idea = addIdea(req.body)
  res.json(idea || { error: 'Failed to add idea' })
})

// ============================================
// REVIEWS
// ============================================

app.get('/api/reviews', (req, res) => {
  const reviews = getWeeklyReviews()
  res.json(reviews)
})

app.post('/api/reviews', (req, res) => {
  const review = addWeeklyReview(req.body)
  res.json(review || { error: 'Failed to add review' })
})

// ============================================
// ACTIVITY LOG
// ============================================

app.get('/api/activity', (req, res) => {
  const limit = req.query.limit || 50
  const activity = getActivityLog(parseInt(limit))
  res.json(activity)
})

// ============================================
// DATA EXPORT/IMPORT
// ============================================

app.get('/api/export', (req, res) => {
  const data = exportAllData()
  res.json(data)
})

app.post('/api/import', (req, res) => {
  const success = importData(req.body)
  res.json({ success })
})

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Life OS Server running on port ${PORT}`)
  console.log(`📊 Dashboard: http://localhost:${PORT}`)
  console.log(`📁 Data directory: /data/.openclaw/workspace/data`)
  console.log(`📝 Memory directory: /data/.openclaw/workspace/memory`)
})
