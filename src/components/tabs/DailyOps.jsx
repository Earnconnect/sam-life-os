import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Calendar, Clock, CheckCircle2 } from 'lucide-react'

export default function DailyOps() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
      setTasks(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📅 Daily Operations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Today's schedule, tasks, and energy check-in</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Calendar size={18} /> Today's Date</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Clock size={18} /> Tasks Today</h2>
          <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status !== 'completed').length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><CheckCircle2 size={18} /> Completed</h2>
          <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Tasks</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 10).map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <input type="checkbox" className="w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.priority} • {task.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Summary</h2>
        <textarea placeholder="What did you accomplish today? How are you feeling?" className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Summary</button>
      </div>
    </div>
  )
}
