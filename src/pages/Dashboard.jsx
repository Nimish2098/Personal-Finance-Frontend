"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import { transactionService } from "../services/transactions"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#14b8a6", "#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"]

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [monthlySummary, setMonthlySummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const now = new Date()
    const month = now.getMonth() + 1 // JS months are 0-based
    const year = now.getFullYear()

    const fetchData = async () => {
      try {
        const [dashboard, summary] = await Promise.all([
          transactionService.getDashboardData(month, year),
          transactionService.getMonthlySummary(month, year),
        ])

        setDashboardData(dashboard)
        setMonthlySummary(summary)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
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

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {monthlySummary && (
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                Income vs Expenses
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Monthly comparison for the last month
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    {
                      name: "This Month",
                      income: monthlySummary.income,
                      expense: monthlySummary.expense,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" />
                  <XAxis  dataKey="name" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="var(--color-success)" />
                  <Line type="monotone" dataKey="expense" stroke="var(--color-error)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

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
            {/* Placeholder budget sections – replace with real data if needed */}
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
