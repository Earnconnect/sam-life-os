import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, AlertCircle, CheckCircle2, Zap, Activity, RefreshCw } from 'lucide-react'
import { 
  fetchClients, 
  fetchFinancials, 
  fetchProspects, 
  fetchActivityLog,
  fetchTokenLogs,
  healthCheck
} from '../../lib/api-client'

export default function Homepage() {
  const [data, setData] = useState({
    clients: 0,
    revenue: 0,
    expenses: 0,
    mrr: 0,
    tokenCost: 0,
    prospects: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState('connecting')

  useEffect(() => {
    loadAllData()
    const interval = setInterval(loadAllData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadAllData() {
    try {
      setLoading(true)

      // Check API health
      const health = await healthCheck()
      setApiStatus(health.status === 'ok' ? 'connected' : 'disconnected')

      // Fetch all data in parallel
      const [clientsRes, finRes, prospectsRes, activityRes, tokensRes] = await Promise.all([
        fetchClients().catch(() => []),
        fetchFinancials().catch(() => ({ revenue: [], expenses: [], total: { revenue: 0, expenses: 0, mrr: 0 } })),
        fetchProspects().catch(() => []),
        fetchActivityLog(10).catch(() => []),
        fetchTokenLogs().catch(() => [])
      ])

      // Process clients
      const activeClients = Array.isArray(clientsRes) ? clientsRes.filter(c => c.status === 'active') : []
      const clientCount = activeClients.length

      // Process financials
      const finData = finRes || { revenue: [], expenses: [], total: { revenue: 0, expenses: 0, mrr: 0 } }
      const revenue = finData.total?.revenue || 0
      const expenses = finData.total?.expenses || 0
      const mrr = finData.total?.mrr || 0

      // Process prospects
      const prospects = Array.isArray(prospectsRes) ? prospectsRes : []
      const prospectCount = prospects.filter(p => p.stage !== 'closed-lost').length

      // Process tokens
      const tokens = Array.isArray(tokensRes) ? tokensRes : []
      const tokenCost = tokens.reduce((sum, t) => sum + (t.cost || 0), 0)

      // Process activity
      const activity = Array.isArray(activityRes) ? activityRes : []

      setData({
        clients: clientCount,
        revenue,
        expenses,
        mrr,
        tokenCost,
        prospects: prospectCount,
      })

      setRecentActivity(activity.slice(0, 10))
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setApiStatus('error')
      setLoading(false)
    }
  }

  const profit = data.revenue - data.expenses
  const profitMargin = data.revenue > 0 ? ((profit / data.revenue) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${apiStatus === 'connected' ? 'text-green-400' : apiStatus === 'error' ? 'text-red-400' : 'text-yellow-400'}`} />
          <span className="text-sm text-gray-300">
            {apiStatus === 'connected' && 'OpenClaw Synced'}
            {apiStatus === 'disconnected' && 'Connecting...'}
            {apiStatus === 'error' && 'Connection Error'}
          </span>
        </div>
        <button
          onClick={loadAllData}
          className="flex items-center gap-2 px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-gray-300"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 p-6 rounded-lg border border-emerald-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-sm font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold text-emerald-300 mt-2">${data.revenue.toFixed(0)}</h3>
              <p className="text-emerald-300 text-xs mt-1">MRR: ${data.mrr.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400 opacity-50" />
          </div>
        </div>

        {/* Profit Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg border border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Profit</p>
              <h3 className="text-3xl font-bold text-blue-300 mt-2">${profit.toFixed(0)}</h3>
              <p className="text-blue-300 text-xs mt-1">Margin: {profitMargin}%</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-gradient-to-br from-red-900 to-red-800 p-6 rounded-lg border border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm font-medium">Expenses</p>
              <h3 className="text-3xl font-bold text-red-300 mt-2">${data.expenses.toFixed(0)}</h3>
              <p className="text-red-300 text-xs mt-1">APIs: ${data.tokenCost.toFixed(2)}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400 opacity-50" />
          </div>
        </div>

        {/* Clients Card */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg border border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Active Clients</p>
              <h3 className="text-3xl font-bold text-purple-300 mt-2">{data.clients}</h3>
              <p className="text-purple-300 text-xs mt-1">Goal: 30 clients</p>
            </div>
            <Users className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </div>

        {/* Prospects Card */}
        <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-lg border border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium">Pipeline</p>
              <h3 className="text-3xl font-bold text-orange-300 mt-2">{data.prospects}</h3>
              <p className="text-orange-300 text-xs mt-1">Opportunities</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400 opacity-50" />
          </div>
        </div>

        {/* Token Usage Card */}
        <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 p-6 rounded-lg border border-cyan-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm font-medium">API Costs</p>
              <h3 className="text-3xl font-bold text-cyan-300 mt-2">${data.tokenCost.toFixed(2)}</h3>
              <p className="text-cyan-300 text-xs mt-1">Total Spent</p>
            </div>
            <Zap className="w-8 h-8 text-cyan-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{activity.message || activity.title || 'Activity'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp || activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No recent activity. Start logging to see updates here.</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-4 rounded">
            <p className="text-gray-400 text-xs">Avg Client Value</p>
            <p className="text-xl font-bold text-white mt-2">
              ${data.clients > 0 ? (data.mrr / data.clients).toFixed(0) : 0}
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <p className="text-gray-400 text-xs">Revenue/Expense Ratio</p>
            <p className="text-xl font-bold text-white mt-2">
              {data.expenses > 0 ? (data.revenue / data.expenses).toFixed(2) : '∞'}x
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <p className="text-gray-400 text-xs">Cost Per Client</p>
            <p className="text-xl font-bold text-white mt-2">
              ${data.clients > 0 ? (data.expenses / data.clients).toFixed(0) : 0}
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <p className="text-gray-400 text-xs">Growth Target</p>
            <p className="text-xl font-bold text-white mt-2">
              {data.clients}/30 clients
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
