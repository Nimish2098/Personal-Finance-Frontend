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
        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-[var(--color-text-muted)] text-sm mb-2">Total Income</div>
            <div className="text-3xl font-bold text-[var(--color-success)]">${dashboardData?.totalIncome || 0}</div>
          </Card>
          <Card>
            <div className="text-[var(--color-text-muted)] text-sm mb-2">Total Expense</div>
            <div className="text-3xl font-bold text-[var(--color-error)]">${dashboardData?.totalExpense || 0}</div>
          </Card>
          <Card>
            <div className="text-[var(--color-text-muted)] text-sm mb-2">Net Savings</div>
            <div className="text-3xl font-bold text-[var(--color-primary)]">${dashboardData?.netSavings || 0}</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {monthlySummary && (
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Monthly Trend</h3>
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
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Recent Transactions */}
        {dashboardData?.recentTransactions && (
          <Card>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-bg-tertiary)]">
                    <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Date</th>
                    <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Description</th>
                    <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Category</th>
                    <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">Amount</th>
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
                      <td className="py-3 text-[var(--color-text-primary)]">{tx.description}</td>
                      <td className="py-3 text-[var(--color-text-secondary)]">{tx.category}</td>
                      <td
                        className={`py-3 text-right font-semibold ${tx.type === "INCOME " ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}
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
      </div>
    </div>
  )
}
