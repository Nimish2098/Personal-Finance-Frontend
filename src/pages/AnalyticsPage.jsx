"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { transactionService } from "../services/transactions"
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts"

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export default function AnalyticsPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [cashFlowData, setCashFlowData] = useState(null)
    const [loading, setLoading] = useState(false)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    useEffect(() => {
        fetchData()
    }, [currentDate])

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await transactionService.getCashFlowAnalysis(month + 1, year)
            setCashFlowData(data)
        } catch (error) {
            console.error("Failed to fetch analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

    // Prepare chart data format
    const chartData = cashFlowData?.dailyFlow?.map(day => ({
        name: day.date.split("-").slice(2).join("/"), // Extract day "01", "02"
        inflow: day.inflow || 0,
        outflow: day.outflow || 0,
        balance: day.balance || 0
    })) || []

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Financial Analytics</h1>

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

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
                            <span className="text-[var(--color-text-muted)] text-sm">Opening Balance</span>
                            <div className="text-2xl font-bold mt-2 text-[var(--color-text-primary)]">
                                ₹{cashFlowData?.openingBalance?.toFixed(2) || '0.00'}
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
                            <span className="text-[var(--color-text-muted)] text-sm">Closing Balance</span>
                            <div className={`text-2xl font-bold mt-2 ${cashFlowData?.closingBalance >= 0 ? 'text-[var(--color-text-primary)]' : 'text-red-500'}`}>
                                ₹{cashFlowData?.closingBalance?.toFixed(2) || '0.00'}
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
                            <span className="text-[var(--color-text-muted)] text-sm">Net Savings (In - Out)</span>
                            <div className={`text-2xl font-bold mt-2 ${(cashFlowData?.totalInflow - cashFlowData?.totalOutflow) >= 0 ? 'text-green-600' : 'text-red-500'
                                }`}>
                                ₹{((cashFlowData?.totalInflow || 0) - (cashFlowData?.totalOutflow || 0)).toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
                            <span className="text-[var(--color-text-muted)] text-sm">Total Flow Volume</span>
                            <div className="text-2xl font-bold mt-2 text-blue-600">
                                ₹{((cashFlowData?.totalInflow || 0) + (cashFlowData?.totalOutflow || 0)).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Composed Chart: Cash Flow Dynamics */}
                    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-6">Cash Flow Dynamics</h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-bg-tertiary)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        orientation="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar yAxisId="left" dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="balance"
                                        name="Running Balance"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
