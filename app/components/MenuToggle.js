'use client'

import { useState, useEffect } from 'react'

export default function MenuToggle() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar')
    const menuToggle = document.querySelector('.menu-toggle')

    if (sidebar && menuToggle) {
      if (isOpen) {
        sidebar.classList.add('active')
        menuToggle.classList.add('active')
      } else {
        sidebar.classList.remove('active')
        menuToggle.classList.remove('active')
      }
    }
  }, [isOpen])

  return (
    <button
      className="menu-toggle"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  )
}