import React, { useState } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab, darkMode, setDarkMode, tabs }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg transform transition-transform lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } z-40`}>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white">⚡ Sam's Life OS</h1>
          <p className="text-blue-100 dark:text-gray-400 text-sm mt-1">Operating System</p>
        </div>

        <nav className="space-y-1 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white font-semibold shadow-md'
                  : 'text-white hover:bg-blue-700 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-700 dark:bg-gray-700 text-white hover:bg-blue-800 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
