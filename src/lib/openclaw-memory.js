import fs from 'fs'
import path from 'path'

const MEMORY_DIR = '/data/.openclaw/workspace/memory'
const DAILY_MEMORY = '/data/.openclaw/workspace/MEMORY.md'

// Read from OpenClaw memory files
export async function readMemory(filename = 'MEMORY.md') {
  try {
    const filepath = filename === 'MEMORY.md' 
      ? DAILY_MEMORY 
      : path.join(MEMORY_DIR, filename)
    
    const content = fs.readFileSync(filepath, 'utf-8')
    return content
  } catch (err) {
    console.log('Memory file not found:', filename)
    return null
  }
}

// Parse memory file for structured data
export async function getMemoryEntries(date = null) {
  try {
    const content = await readMemory(`${date || new Date().toISOString().split('T')[0]}.md`)
    if (!content) return []
    
    // Parse markdown sections
    const entries = []
    const lines = content.split('\n')
    let currentEntry = null
    
    for (const line of lines) {
      if (line.startsWith('##')) {
        if (currentEntry) entries.push(currentEntry)
        currentEntry = { title: line.replace('## ', ''), content: '' }
      } else if (currentEntry) {
        currentEntry.content += line + '\n'
      }
    }
    if (currentEntry) entries.push(currentEntry)
    
    return entries
  } catch (err) {
    return []
  }
}

// Log activity to memory
export async function logToMemory(activity) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const filepath = path.join(MEMORY_DIR, `${today}.md`)
    
    // Create memory directory if it doesn't exist
    if (!fs.existsSync(MEMORY_DIR)) {
      fs.mkdirSync(MEMORY_DIR, { recursive: true })
    }
    
    // Read existing or create new
    let content = ''
    if (fs.existsSync(filepath)) {
      content = fs.readFileSync(filepath, 'utf-8')
    } else {
      content = `# ${today} - Daily Memory\n\n`
    }
    
    // Append new activity
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
    
    content += `\n[${timestamp}] ${activity}\n`
    
    fs.writeFileSync(filepath, content, 'utf-8')
    return true
  } catch (err) {
    console.error('Error logging to memory:', err)
    return false
  }
}

// Get system metrics from memory
export async function getSystemMetrics() {
  try {
    const mainMemory = await readMemory('MEMORY.md')
    if (!mainMemory) return { tasks: 0, projects: 0, clients: 0 }
    
    // Count mentions in memory
    const taskCount = (mainMemory.match(/task/gi) || []).length
    const projectCount = (mainMemory.match(/project|build/gi) || []).length
    const clientCount = (mainMemory.match(/client|customer/gi) || []).length
    
    return {
      tasks: taskCount,
      projects: projectCount,
      clients: clientCount
    }
  } catch (err) {
    return { tasks: 0, projects: 0, clients: 0 }
  }
}

// Watch for memory changes
export function watchMemory(callback) {
  const watcher = fs.watch(MEMORY_DIR, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      callback({
        type: eventType,
        file: filename,
        timestamp: new Date()
      })
    }
  })
  
  return () => watcher.close()
}
