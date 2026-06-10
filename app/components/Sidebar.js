'use client'

import { FiHome, FiBook, FiCalendar, FiBarChart2, FiSettings, FiPlus, FiUser } from 'react-icons/fi'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button className="sidebar-button">
          <FiHome className="sidebar-icon" />
          <span>Dashboard</span>
        </button>

        <button className="sidebar-button">
          <FiBook className="sidebar-icon" />
          <span>My Subjects</span>
        </button>

        <button className="sidebar-button">
          <FiCalendar className="sidebar-icon" />
          <span>Schedule</span>
        </button>

        <button className="sidebar-button">
          <FiBarChart2 className="sidebar-icon" />
          <span>Progress</span>
        </button>

        <button className="sidebar-button">
          <FiPlus className="sidebar-icon" />
          <span>New Subject</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-button">
          <FiUser className="sidebar-icon" />
          <span>Profile</span>
        </button>

        <button className="sidebar-button">
          <FiSettings className="sidebar-icon" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}