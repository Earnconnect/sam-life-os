import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getJackyActivityFeed, getSystemHealthMetrics, logActivityEvent } from '../../lib/openclaw'
import { Zap, Activity, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Partnership() {
  const [jackyActivity, setJackyActivity] = useState([])
  const [systemHealth, setSystemHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadData() {
    try {
      const activity = await getJackyActivityFeed()
      const health = await getSystemHealthMetrics()
      setJackyActivity(activity)
      setSystemHealth(health)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    try {
      const { error } = await supabase.from('partnership_notes').insert([{
        content: newNote,
        type: 'jacky_note',
        created_at: new Date().toISOString()
      }])
      if (!error) {
        setNewNote('')
        loadData()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤝 Partnership</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">What Jacky (AI) is doing, system status, and feedback</p>
      </div>

      {/* System Health */}
      {systemHealth && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Sessions</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{systemHealth.activeSessions}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Tasks Completed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-300">{systemHealth.completedTasks}</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Hourly Token Cost</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">${systemHealth.avgHourlyTokenCost}</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">System Status</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-300">✓ {systemHealth.systemHealth}</p>
          </div>
        </div>
      )}

      {/* Jacky's Work Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={20} /> What I'm Working On (Jacky)
        </h2>
        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Loading activity...</p>
          ) : jackyActivity.length === 0 ? (
            <p className="text-gray-500">No activity logged yet</p>
          ) : (
            jackyActivity.map((activity, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                <p className="font-medium text-gray-900 dark:text-white">{activity.content || activity.type}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Partnership Note */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feedback & Notes</h2>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What should Jacky work on next? Any feedback?"
          className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
        />
        <button
          onClick={addNote}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Note
        </button>
      </div>

      {/* Real-Time System Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-yellow-500" /> Real-Time System Metrics
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-gray-700 dark:text-gray-300">Current Session</span>
            <span className="font-medium text-gray-900 dark:text-white">Active • main</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-gray-700 dark:text-gray-300">Token Usage Rate</span>
            <span className="font-medium text-gray-900 dark:text-white">Real-time tracking</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-gray-700 dark:text-gray-300">Last Update</span>
            <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Partnership Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Partnership</h2>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <li>✓ I track everything happening in the system (real-time)</li>
          <li>✓ I monitor your token usage and optimize costs</li>
          <li>✓ I work on what you prioritize</li>
          <li>✓ I keep the Life OS synchronized and up-to-date</li>
          <li>✓ I handle sales, building, and operations tasks</li>
          <li>✓ This dashboard shows what I'm doing for you, live</li>
        </ul>
      </div>
    </div>
  )
}
