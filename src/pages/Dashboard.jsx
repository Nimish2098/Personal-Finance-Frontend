"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { accountService } from "../services/accounts" // Add Import


import { transactionService } from "../services/transactions"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { Wallet, TrendingUp, TrendingDown, Calendar, DollarSign, Plus } from "lucide-react"

const COLORS = ["#3b82f6", "#e2e8f0"] // Blue and Light Slate for the Pie chart as per design

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [monthlySummary, setMonthlySummary] = useState(null)
  const [trendsData, setTrendsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        const [dashboard, summary, trends, recentTx] = await Promise.all([
          transactionService.getDashboardData(month, year),
          transactionService.getMonthlySummary(month, year),
          transactionService.getSpendingTrends("monthly", year, month),
          transactionService.getTransactions(0, 5) // Fetch 5 recent transactions
        ])

        // Merge recent transactions into dashboard data
        setDashboardData({
          ...dashboard,
          recentTransactions: recentTx.content || []
        })
        setMonthlySummary(summary)

        // Transform trends data for the line chart (dummy structure or real data adaptation)
        // If API returns array, map it. Otherwise mock for visualization if empty
        if (Array.isArray(trends) && trends.length > 0) {
          setTrendsData(trends)
        } else {
          // Mock data to match screenshot structure if no real data
          const mockTrends = [
            { period: 'Jan', income: 0, expense: 0 },
            // ... populate as needed based on real data flow later
            { period: 'Jan', income: dashboard?.totalIncome || 0, expense: dashboard?.totalExpense || 0 }
          ]
          setTrendsData(mockTrends)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Calculate savings rate
  const savingsRate = dashboardData?.totalIncome > 0
    ? ((dashboardData.totalIncome - dashboardData.totalExpense) / dashboardData.totalIncome) * 100
    : 0


  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Finance Tracker</h1>
            <p className="text-[var(--color-text-muted)] text-sm">Manage your money with ease</p>
          </div>
        </div>
        <Link to="/transactions" className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Balance */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-text-muted)] text-sm">Total Balance</span>
            <div className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg">
              <DollarSign className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
          </div>
          <div className={`text-2xl font-bold mb-2 ${(dashboardData?.totalBalance || 0) < 0 ? 'text-red-500' : 'text-[var(--color-text-primary)]'
            }`}>
            ${(dashboardData?.totalBalance || 0).toFixed(2)}
          </div>
          <div className="text-xs font-medium text-green-500">
            +{savingsRate.toFixed(1)}% savings rate
          </div>
        </div>

        {/* Income */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-text-muted)] text-sm">Total Income</span>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-2">
            ${(dashboardData?.totalIncome || 0).toFixed(2)}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            <Calendar className="w-3 h-3 inline mr-1" />
            All time
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-text-muted)] text-sm">Total Expenses</span>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-500 mb-0">
            ${(dashboardData?.totalExpense || 0).toFixed(2)}
          </div>
        </div>

        {/* Transactions Count */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[var(--color-text-muted)] text-sm">Transactions</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            {dashboardData?.recentTransactions?.length || 0}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            Avg: ${((dashboardData?.totalExpense || 0) / (dashboardData?.recentTransactions?.length || 1)).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-6">Monthly Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-bg-tertiary)" />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
                  labelStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-6">Expense Breakdown</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {(dashboardData?.categoryBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', border: 'none' }} itemStyle={{ color: 'var(--color-text-primary)' }} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="left"
                  iconType="circle"
                  wrapperStyle={{ color: 'var(--color-text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Categories Progress */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-6">Top Spending Categories</h3>
        <div className="space-y-6">
          {dashboardData?.categoryBreakdown?.map((cat, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-[var(--color-text-secondary)] font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-[var(--color-text-primary)]">${cat.value.toFixed(2)}</span>
              </div>
              <div className="h-2 w-full bg-blue-50 dark:bg-blue-900/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(cat.value / (dashboardData.totalExpense || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {(!dashboardData?.categoryBreakdown || dashboardData.categoryBreakdown.length === 0) && (
            <div className="text-[var(--color-text-muted)] text-sm text-center">No category data available</div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-6">Recent Transactions</h3>
        <div className="space-y-4">
          {dashboardData?.recentTransactions?.map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tx.type === 'INCOME' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                  {tx.type === 'INCOME' ? (
                    <TrendingUp className={`w-5 h-5 ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                      }`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                      }`} />
                  )}
                </div>
                <span className="font-medium text-[var(--color-text-secondary)]">{tx.category || tx.description}</span>
              </div>
              <div className="text-right">
                <div className="text-[var(--color-text-muted)] text-xs mb-1">
                  {new Date(tx.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                  }`}>
                  {tx.type === 'INCOME' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          {(!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0) && (
            <div className="text-[var(--color-text-muted)] text-sm text-center">No recent transactions</div>
          )}
        </div>
      </div>
    </div>
  )
}