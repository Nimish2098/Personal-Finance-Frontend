"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import { transactionService } from "../services/transactions"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

const COLORS = ["#14b8a6", "#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"]

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [monthlySummary, setMonthlySummary] = useState(null)
  const [trendsData, setTrendsData] = useState(null)
  const [cashFlowData, setCashFlowData] = useState(null)
  const [trendPeriod, setTrendPeriod] = useState("monthly") // "daily", "weekly", "monthly"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const fetchData = async () => {
      try {
        const [dashboard, summary, trends, cashFlow] = await Promise.all([
          transactionService.getDashboardData(month, year),
          transactionService.getMonthlySummary(month, year),
          transactionService.getSpendingTrends(trendPeriod, year, month),
          transactionService.getCashFlowAnalysis(month, year),
        ])

        setDashboardData(dashboard)
        setMonthlySummary(summary)
        setTrendsData(trends)
        setCashFlowData(cashFlow)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [trendPeriod])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Welcome back! Here&apos;s your financial overview.
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium shadow-md hover:shadow-lg hover:bg-opacity-90 transition">
            + Add Transaction
          </button>
        </div>

        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide mb-1">
              Total Balance
            </div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)]">
              ${dashboardData?.totalBalance ?? dashboardData?.netSavings ?? 0}
            </div>
          </Card>
          <Card>
            <div className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide mb-1">
              Income
            </div>
            <div className="text-3xl font-bold text-[var(--color-success)]">
              ${dashboardData?.totalIncome || 0}
            </div>
          </Card>
          <Card>
            <div className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide mb-1">
              Expenses
            </div>
            <div className="text-3xl font-bold text-[var(--color-error)]">
              ${dashboardData?.totalExpense || 0}
            </div>
          </Card>
          <Card>
            <div className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide mb-1">
              Savings
            </div>
            <div className="text-3xl font-bold text-[var(--color-primary)]">
              ${dashboardData?.netSavings || 0}
            </div>
          </Card>
        </div>

        {/* Spending Trends Over Time */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Spending Trends Over Time
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Track your income and expenses across different periods
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTrendPeriod("daily")}
                className={`px-3 py-1 rounded text-xs ${
                  trendPeriod === "daily"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTrendPeriod("weekly")}
                className={`px-3 py-1 rounded text-xs ${
                  trendPeriod === "weekly"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTrendPeriod("monthly")}
                className={`px-3 py-1 rounded text-xs ${
                  trendPeriod === "monthly"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          {trendsData && trendsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" />
                <XAxis dataKey="period" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="var(--color-success)"
                  fill="var(--color-success)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stackId="1"
                  stroke="var(--color-error)"
                  fill="var(--color-error)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              No trend data available
            </div>
          )}
        </Card>

        {/* Charts Row: Income vs Expenses + Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Enhanced Income vs Expenses */}
          {monthlySummary && (
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                Income vs Expenses Summary
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Current month comparison
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[monthlySummary]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" />
                  <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="var(--color-success)" />
                  <Bar dataKey="expense" fill="var(--color-error)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Category Breakdown - Pie Chart */}
          {dashboardData?.categoryBreakdown && (
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                Spending by Category
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Current month breakdown
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={dashboardData.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.categoryBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-40 space-y-2 text-xs">
                  {dashboardData.categoryBreakdown.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-[var(--color-text-secondary)]">
                          {entry.name}
                        </span>
                      </span>
                      <span className="text-[var(--color-text-primary)]">
                        ${entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Category Breakdown - Bar Chart View */}
        {dashboardData?.categoryBreakdown && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              Category-wise Spending Breakdown
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Detailed view of expenses by category
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Cash Flow Analysis */}
        {cashFlowData && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              Cash Flow Analysis
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Track your daily cash flow and balance
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-[var(--color-text-muted)]">Opening Balance</div>
                <div className="text-lg font-semibold text-[var(--color-text-primary)]">
                  ${cashFlowData.openingBalance || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-muted)]">Total Inflow</div>
                <div className="text-lg font-semibold text-[var(--color-success)]">
                  ${cashFlowData.totalInflow || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-muted)]">Total Outflow</div>
                <div className="text-lg font-semibold text-[var(--color-error)]">
                  ${cashFlowData.totalOutflow || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-muted)]">Closing Balance</div>
                <div className="text-lg font-semibold text-[var(--color-text-primary)]">
                  ${cashFlowData.closingBalance || 0}
                </div>
              </div>
            </div>
            {cashFlowData.dailyFlow && cashFlowData.dailyFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData.dailyFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" />
                  <XAxis dataKey="date" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inflow"
                    stroke="var(--color-success)"
                    name="Inflow"
                  />
                  <Line
                    type="monotone"
                    dataKey="outflow"
                    stroke="var(--color-error)"
                    name="Outflow"
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="var(--color-primary)"
                    name="Balance"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No cash flow data available
              </div>
            )}
          </Card>
        )}

        {/* Bottom section: Recent Transactions + Budget Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          {dashboardData?.recentTransactions && (
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Recent Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-bg-tertiary)]">
                      <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">
                        Date
                      </th>
                      <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">
                        Description
                      </th>
                      <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">
                        Category
                      </th>
                      <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentTransactions.map((tx, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                      >
                        <td className="py-3 text-[var(--color-text-secondary)]">
                          {new Date(tx.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-[var(--color-text-primary)]">
                          {tx.description}
                        </td>
                        <td className="py-3 text-[var(--color-text-secondary)]">
                          {tx.category}
                        </td>
                        <td
                          className={`py-3 text-right font-semibold ${
                            tx.type === "INCOME"
                              ? "text-[var(--color-success)]"
                              : "text-[var(--color-error)]"
                          }`}
                        >
                          {tx.type === "INCOME" ? "+" : "-"}${Math.abs(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              Budget Overview
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Track your spending limits.
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--color-text-secondary)]">Housing</span>
                  <span className="text-[var(--color-text-primary)]">$1200 / $1500</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                  <div className="h-full w-4/5 bg-[var(--color-primary)]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--color-text-secondary)]">Food</span>
                  <span className="text-[var(--color-text-primary)]">$400 / $600</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                  <div className="h-full w-2/3 bg-[var(--color-success)]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--color-text-secondary)]">Shopping</span>
                  <span className="text-[var(--color-text-primary)]">$300 / $500</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                  <div className="h-full w-3/5 bg-[var(--color-error)]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}