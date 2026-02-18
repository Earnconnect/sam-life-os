import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Homepage from './components/tabs/Homepage'
import DailyOps from './components/tabs/DailyOps'
import SalesandPipeline from './components/tabs/SalesandPipeline'
import Building from './components/tabs/Building'
import ClientDelivery from './components/tabs/ClientDelivery'
import TaskManagement from './components/tabs/TaskManagement'
import Financial from './components/tabs/Financial'
import TimeEnergy from './components/tabs/TimeEnergy'
import TokenOptimization from './components/tabs/TokenOptimization'
import IdeasExperiments from './components/tabs/IdeasExperiments'
import WeeklyReview from './components/tabs/WeeklyReview'
import Partnership from './components/tabs/Partnership'

function App() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [darkMode, setDarkMode] = useState(false)

  const tabs = [
    { id: 'homepage', label: 'Homepage', icon: '🏠' },
    { id: 'daily', label: 'Daily Operations', icon: '📅' },
    { id: 'sales', label: 'Sales & Pipeline', icon: '🎯' },
    { id: 'building', label: 'Building', icon: '🔨' },
    { id: 'delivery', label: 'Client Delivery', icon: '📦' },
    { id: 'tasks', label: 'Task Management', icon: '✓' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'time', label: 'Time & Energy', icon: '⚡' },
    { id: 'tokens', label: 'Token Optimization', icon: '🔌' },
    { id: 'ideas', label: 'Ideas & Experiments', icon: '💡' },
    { id: 'review', label: 'Weekly Review', icon: '📊' },
    { id: 'partnership', label: 'Partnership', icon: '🤝' },
  ]

  const renderTab = () => {
    switch(activeTab) {
      case 'homepage': return <Homepage />
      case 'daily': return <DailyOps />
      case 'sales': return <SalesandPipeline />
      case 'building': return <Building />
      case 'delivery': return <ClientDelivery />
      case 'tasks': return <TaskManagement />
      case 'financial': return <Financial />
      case 'time': return <TimeEnergy />
      case 'tokens': return <TokenOptimization />
      case 'ideas': return <IdeasExperiments />
      case 'review': return <WeeklyReview />
      case 'partnership': return <Partnership />
      default: return <Homepage />
    }
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} tabs={tabs} />
        <main className="flex-1 ml-64 p-8">
          {renderTab()}
        </main>
      </div>
    </div>
  )
}

export default App
