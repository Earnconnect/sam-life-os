import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TrendingUp, Users, AlertCircle, CheckCircle2, Zap } from 'lucide-react'

export default function Homepage() {
  const [data, setData] = useState({
    clients: 0,
    revenue: 0,
    expenses: 0,
    tokenCost: 0,
    prospects: 0,
    energy: 7,
    focus: '',
    blockers: [],
    wins: [],
  })
  const [loading, setLoading] = useState(true)
  const [newWin, setNewWin] = useState('')

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    try {
      // Fetch clients
      const { data: clientsData } = await supabase.from('clients').select('*').eq('status', 'active')
      const clientCount = clientsData?.length || 0

      // Fetch financials
      const { data: finData } = await supabase.from('financials').select('*')
      const revenue = finData?.filter(f => f.type === 'revenue').reduce((sum, f) => sum + f.amount, 0) || 0
      const expenses = finData?.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0) || 0

      // Fetch tokens
      const { data: tokenData } = await supabase.from('token_logs').select('*')
      const tokenCost = tokenData?.reduce((sum, t) => sum + t.cost, 0) || 0

      // Fetch prospects
      const { data: prospectData } = await supabase.from('prospects').select('*').eq('status', 'active')
      const prospectCount = prospectData?.length || 0

      setData(prev => ({
        ...prev,
        clients: clientCount,
        revenue,
        expenses,
        tokenCost,
        prospects: prospectCount,
      }))
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const profit = data.revenue - data.expenses
  const margin = data.revenue > 0 ? ((profit / data.revenue) * 100).toFixed(1) : 0

  const addWin = () => {
    if (newWin.trim()) {
      setData(prev => ({ ...prev, wins: [...prev.wins, newWin] }))
      setNewWin('')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">⚡ Sam's Life OS</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your complete operating system. Real-time view of everything.</p>
      </div>

      {/* Energy & Focus Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">Energy Level Today</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={data.energy}
              onChange={(e) => setData(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-3xl">{data.energy <= 3 ? '😴' : data.energy <= 6 ? '😐' : '🔥'}</span>
            <span className="text-2xl font-bold text-blue-600">{data.energy}/10</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">Today's Focus</label>
          <input
            type="text"
            value={data.focus}
            onChange={(e) => setData(prev => ({ ...prev, focus: e.target.value }))}
            placeholder="What are you focusing on today?"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-300 mt-1">{data.clients}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-300 mt-1">${(data.revenue / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Token Cost</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-300 mt-1">${data.tokenCost.toFixed(0)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-300 mt-1">{margin}%</p>
        </div>
      </div>

      {/* Sales Pipeline & Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Sales Pipeline
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Prospects: <span className="font-bold text-gray-900 dark:text-white">{data.prospects}</span></p>
            <p className="text-xs text-gray-500 mt-3">Funnel stages coming from prospects table</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users size={20} /> Active Clients
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">MeetingMind: <span className="font-bold text-gray-900 dark:text-white">$2,499</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lodigi: <span className="font-bold text-gray-900 dark:text-white">$2,499</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Other: <span className="font-bold text-gray-900 dark:text-white">$2,499</span></p>
          </div>
        </div>
      </div>

      {/* Blockers & Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" /> Top Blockers
          </h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-600 dark:text-gray-400">• No Supabase tables yet (creating tonight)</li>
            <li className="text-sm text-gray-600 dark:text-gray-400">• Need to log first prospect</li>
            <li className="text-sm text-gray-600 dark:text-gray-400">• Time management optimization needed</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" /> Today's Wins
          </h2>
          <div className="space-y-2">
            {data.wins.map((win, idx) => (
              <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>{win}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newWin}
                onChange={(e) => setNewWin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWin()}
                placeholder="Add today's win..."
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button onClick={addWin} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Next Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">For Sam:</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Reach out to 5 prospects</li>
              <li>✓ Complete client project delivery</li>
              <li>✓ Set up Supabase tables tonight</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">For Jacky (AI):</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Monitor sales pipeline daily</li>
              <li>✓ Optimize token usage</li>
              <li>✓ Prepare weekly review summary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
