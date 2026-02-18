import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function COMPONENTNAME() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tab Title</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Description</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Content coming soon...</p>
      </div>
    </div>
  )
}
