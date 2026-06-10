'use client'

import { useState, useEffect } from 'react'
import { FiHome, FiBook, FiCalendar, FiBarChart2, FiSettings, FiPlus, FiUser } from 'react-icons/fi'
import { TbGridDots } from 'react-icons/tb'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const mainContent = document.querySelector('.main-content')
    if (mainContent) {
      if (isCollapsed) {
        mainContent.classList.add('expanded')
      } else {
        mainContent.classList.remove('expanded')
      }
    }
  }, [isCollapsed])

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar"
      >
        <TbGridDots />
      </button>

      <nav className="sidebar-nav">
        <button className="sidebar-button">
          <FiHome className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </button>

        <button className="sidebar-button">
          <FiBook className="sidebar-icon" />
          <span className="sidebar-text">My Subjects</span>
        </button>

        <button className="sidebar-button">
          <FiCalendar className="sidebar-icon" />
          <span className="sidebar-text">Schedule</span>
        </button>

        <button className="sidebar-button">
          <FiBarChart2 className="sidebar-icon" />
          <span className="sidebar-text">Progress</span>
        </button>

        <button className="sidebar-button">
          <FiPlus className="sidebar-icon" />
          <span className="sidebar-text">New Subject</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-button">
          <FiUser className="sidebar-icon" />
          <span className="sidebar-text">Profile</span>
        </button>

        <button className="sidebar-button">
          <FiSettings className="sidebar-icon" />
          <span className="sidebar-text">Settings</span>
        </button>
      </div>
    </aside>
  )
}