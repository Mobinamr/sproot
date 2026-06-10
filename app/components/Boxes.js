'use client'

import { useState, useEffect } from 'react'

export default function Boxes() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get current month calendar data
  const getCalendarDays = () => {
    const year = currentTime.getFullYear()
    const month = currentTime.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const calendarDays = getCalendarDays()
  const currentDay = currentTime.getDate()
  const currentMonth = currentTime.getMonth()
  const currentYear = currentTime.getFullYear()

  // Define which days have dots (you can change these numbers)
  const redDotDays = [8, 15] // 2 red dots on these days
  const blueDotDays = [22] // 1 blue dot on this day

  return (
    <div className="boxes-container">
      <div className="column column-left">
        <div className="box grid-box">
          <div className="point-grid">
            {[...Array(12)].map((_, row) => (
              <div key={row} className="point-row">
                {[...Array(12)].map((_, col) => (
                  <div key={col} className="point"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="box calendar-box">
          <div className="calendar">
            <div className="calendar-header">
              <h3>{monthNames[currentMonth]} {currentYear}</h3>
            </div>
            <div className="calendar-weekdays">
              {dayNames.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day === currentDay ? 'today' : ''} ${!day ? 'empty' : ''}`}
                >
                  <span className="day-number">{day}</span>
                  {redDotDays.includes(day) && (
                    <div className="event-dot red-dot"></div>
                  )}
                  {blueDotDays.includes(day) && (
                    <div className="event-dot blue-dot"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="column column-right">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  )
}