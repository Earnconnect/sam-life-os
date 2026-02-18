import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MEMORY_DIR = '/data/.openclaw/workspace/memory'
const MAIN_MEMORY = '/data/.openclaw/workspace/MEMORY.md'

const app = express()
app.use(express.json())

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')))

// Memory API endpoints
app.get('/api/memory', (req, res) => {
  try {
    const { type } = req.query
    const today = new Date().toISOString().split('T')[0]

    if (type === 'today') {
      const filepath = path.join(MEMORY_DIR, `${today}.md`)
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        return res.json({ date: today, content })
      }
      return res.json({ date: today, content: 'No entries for today' })
    }

    if (type === 'activities') {
      const filepath = path.join(MEMORY_DIR, `${today}.md`)
      const activities = []
      
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        const lines = content.split('\n')
        lines.forEach(line => {
          if (line.match(/\[\d{1,2}:\d{2}/)) {
            const timeMatch = line.match(/\[(.*?)\]/)
            const text = line.replace(/\[.*?\]\s/, '')
            if (timeMatch && text) {
              activities.push({ time: timeMatch[1], text })
            }
          }
        })
      }
      
      return res.json({ activities })
    }

    if (type === 'tasks') {
      const filepath = path.join(MEMORY_DIR, `${today}.md`)
      const tasks = []
      
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        const taskMatches = content.match(/- \*\*.*?\*\*:.*?(?=\n|$)/g) || []
        taskMatches.forEach(match => {
          const titleMatch = match.match(/\*\*(.*?)\*\*/)
          const statusMatch = match.match(/\((.*?)\)/)
          tasks.push({
            title: titleMatch?.[1] || match,
            status: statusMatch?.[1] || 'pending'
          })
        })
      }
      
      return res.json({ tasks })
    }

    if (type === 'metrics') {
      const filepath = path.join(MEMORY_DIR, `${today}.md`)
      const metrics = { tasks: 0, revenue: 0, expenses: 0, energy: 0, clients: 0 }
      
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        metrics.tasks = (content.match(/- \*\*/g) || []).length
      }
      
      if (fs.existsSync(MAIN_MEMORY)) {
        const mainContent = fs.readFileSync(MAIN_MEMORY, 'utf-8')
        const revenueMatch = mainContent.match(/\$(\d+(?:,\d{3})*)/g) || []
        metrics.revenue = revenueMatch.length > 0 ? parseInt(revenueMatch[0].replace(/[$,]/g, '')) : 0
        metrics.clients = (mainContent.match(/client/gi) || []).length
      }
      
      return res.json(metrics)
    }

    return res.status(400).json({ error: 'Invalid type' })
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/memory', (req, res) => {
  try {
    const { activity } = req.body
    if (!activity) return res.status(400).json({ error: 'No activity provided' })

    const today = new Date().toISOString().split('T')[0]
    const filepath = path.join(MEMORY_DIR, `${today}.md`)

    // Ensure directory exists
    if (!fs.existsSync(MEMORY_DIR)) {
      fs.mkdirSync(MEMORY_DIR, { recursive: true })
    }

    // Read existing or create new
    let content = ''
    if (fs.existsSync(filepath)) {
      content = fs.readFileSync(filepath, 'utf-8')
    } else {
      content = `# ${today} — Daily Memory\n\n`
    }

    // Add activity with timestamp
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    content += `\n[${time}] ${activity}`

    fs.writeFileSync(filepath, content, 'utf-8')
    return res.json({ success: true, message: 'Activity logged' })
  } catch (err) {
    console.error('Error logging:', err)
    res.status(500).json({ error: err.message })
  }
})

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Life OS running on http://localhost:${PORT}`)
  console.log(`📝 Memory: ${MEMORY_DIR}`)
})
