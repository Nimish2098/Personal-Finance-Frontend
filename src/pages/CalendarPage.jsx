"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { transactionService } from "../services/transactions"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [calendarData, setCalendarData] = useState([])
    const [loading, setLoading] = useState(false)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    useEffect(() => {
        fetchData()
    }, [currentDate])

    const fetchData = async () => {
        setLoading(true)
        try {
            // API expects 1-indexed month
            const data = await transactionService.getSpendingTrends("daily", year, month + 1)
            setCalendarData(data)
        } catch (error) {
            console.error("Failed to fetch calendar data:", error)
        } finally {
            setLoading(false)
        }
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    // Calendar Logic
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []
    // Padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null)
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }

    const getDataForDay = (day) => {
        if (!day) return null
        // Format: YYYY-MM-DD
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return calendarData.find(d => d.period === dateStr)
    }

    return (
        <div className="p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Calendar</h1>
                <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] p-2 rounded-xl border border-[var(--color-border)]">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors text-[var(--color-text-primary)]"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-medium w-40 text-center text-[var(--color-text-primary)]">
                        {MONTHS[month]} {year}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors text-[var(--color-text-primary)]"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] flex flex-col overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
                    {WEEKDAYS.map(day => (
                        <div key={day} className="p-4 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {days.map((day, idx) => {
                        const data = getDataForDay(day)
                        const hasData = data && (data.income > 0 || data.expense > 0)

                        return (
                            <div
                                key={idx}
                                className={`
                  border-b border-r border-[var(--color-border)] p-2 min-h-[100px] relative transition-colors
                  ${!day ? 'bg-[var(--color-bg-tertiary)] opacity-50' : 'hover:bg-[var(--color-bg-tertiary)]'}
                  ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}
                `}
                            >
                                {day && (
                                    <>
                                        <span className={`
                      text-sm font-medium inline-flex w-7 h-7 items-center justify-center rounded-full
                      ${new Date().toDateString() === new Date(year, month, day).toDateString()
                                                ? 'bg-blue-600 text-white'
                                                : 'text-[var(--color-text-secondary)]'}
                    `}>
                                            {day}
                                        </span>

                                        {loading ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-text-muted)]" />
                                            </div>
                                        ) : (hasData && (
                                            <div className="mt-2 space-y-1 text-xs">
                                                {data.income > 0 && (
                                                    <div className="text-green-600 font-medium px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 rounded truncate">
                                                        +₹{data.income.toFixed(2)}
                                                    </div>
                                                )}
                                                {data.expense > 0 && (
                                                    <div className="text-red-500 font-medium px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 rounded truncate">
                                                        -₹{data.expense.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
