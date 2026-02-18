import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TrendingUp, Plus } from 'lucide-react'

export default function SalesandPipeline() {
  const [prospects, setProspects] = useState([])
  const [newProspect, setNewProspect] = useState({ name: '', stage: 'lead', next_action: '' })

  useEffect(() => {
    loadProspects()
  }, [])

  async function loadProspects() {
    try {
      const { data } = await supabase.from('prospects').select('*').order('created_at', { ascending: false })
      setProspects(data || [])
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const addProspect = async () => {
    if (!newProspect.name) return
    try {
      const { error } = await supabase.from('prospects').insert([newProspect])
      if (!error) {
        setNewProspect({ name: '', stage: 'lead', next_action: '' })
        loadProspects()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎯 Sales & Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Prospects, funnel stages, conversion tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Leads</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{prospects.filter(p => p.stage === 'lead').length}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Prospects</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{prospects.filter(p => p.stage === 'prospect').length}</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Qualified</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">{prospects.filter(p => p.stage === 'qualified').length}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Closed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-300">{prospects.filter(p => p.stage === 'closed').length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Plus size={18} /> Add New Prospect</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newProspect.name}
            onChange={(e) => setNewProspect({...newProspect, name: e.target.value})}
            placeholder="Prospect name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            value={newProspect.stage}
            onChange={(e) => setNewProspect({...newProspect, stage: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>
          <input
            type="text"
            value={newProspect.next_action}
            onChange={(e) => setNewProspect({...newProspect, next_action: e.target.value})}
            placeholder="Next action"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button onClick={addProspect} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Prospect</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Pipeline</h2>
        <div className="space-y-2">
          {prospects.length === 0 ? (
            <p className="text-gray-500">No prospects yet</p>
          ) : (
            prospects.map(p => (
              <div key={p.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                <p className="text-xs text-gray-500 mt-1">{p.stage} • {p.next_action}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
