import fs from 'fs'
import path from 'path'

const MEMORY_DIR = '/data/.openclaw/workspace/memory'
const MAIN_MEMORY = '/data/.openclaw/workspace/MEMORY.md'

// API endpoint to get memory data
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, date } = req.query

    if (type === 'today') {
      const today = new Date().toISOString().split('T')[0]
      const filepath = path.join(MEMORY_DIR, `${today}.md`)
      
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        return res.status(200).json({ date: today, content })
      }
      return res.status(200).json({ date: today, content: 'No entries yet' })
    }

    if (type === 'main') {
      if (fs.existsSync(MAIN_MEMORY)) {
        const content = fs.readFileSync(MAIN_MEMORY, 'utf-8')
        return res.status(200).json({ file: 'MEMORY.md', content })
      }
      return res.status(404).json({ error: 'Main memory file not found' })
    }

    if (type === 'activities') {
      const today = new Date().toISOString().split('T')[0]
      const filepath = path.join(MEMORY_DIR, `${today}.md`)
      
      if (!fs.existsSync(filepath)) {
        return res.status(200).json({ activities: [] })
      }

      const content = fs.readFileSync(filepath, 'utf-8')
      const lines = content.split('\n')
      const activities = lines
        .filter(line => line.startsWith('['))
        .map(line => ({
          time: line.match(/\[(.*?)\]/)?.[1],
          text: line.replace(/\[\d{1,2}:\d{2}:\d{2}\s[AP]M\]\s/, '')
        }))

      return res.status(200).json({ activities })
    }

    return res.status(400).json({ error: 'Invalid request' })
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
