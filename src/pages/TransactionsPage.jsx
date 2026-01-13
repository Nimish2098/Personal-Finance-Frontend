"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Modal from "../components/Modal"
import { transactionService } from "../services/transactions"
import { categoryService } from "../services/categories"
import { accountService } from "../services/accounts"


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "EXPENSE",
    categoryId: "",
    accountId: "",
    transactionDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
          const [txPage, catData, accData] = await Promise.all([
          transactionService.getTransactions(0, 10),
          categoryService.getCategories(),
          accountService.getAccounts(),
        ])

        setTransactions(txPage.content)   
        setCategories(catData)
        setAccounts(accData)
    } catch (err) {
      setError("Failed to load data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async (e) => {
    e.preventDefault()
    try {
      await transactionService.createTransaction(formData)
      setFormData({
          description: "",
          amount: "",
          type: "EXPENSE",
          categoryId: "",
          accountId: "",
          transactionDate: new Date().toISOString().split("T")[0],
        })

      setIsModalOpen(false)
      await loadData()
      if (!formData.accountId) {
  setError("Please select an account")
  return
}
    } catch (err) {
      setError("Failed to create transaction")
      console.error(err)
    }
  }

  const handleExportCSV = async () => {
    try {
      const blob = await transactionService.exportCSV()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "transactions.csv")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      setError("Failed to export transactions")
      console.error(err)
    }
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Transactions</h1>
          <div className="space-x-2">
            <Button onClick={() => setIsModalOpen(true)}>Add Transaction</Button>
            <Button variant="secondary" onClick={handleExportCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-bg-tertiary)]">
                  <th className="text-left py-3 text-[var(--color-text-muted)] font-medium">Date</th>
                  <th className="text-left py-3 text-[var(--color-text-muted)] font-medium">Description</th>
                  <th className="text-left py-3 text-[var(--color-text-muted)] font-medium">Category</th>
                  <th className="text-left py-3 text-[var(--color-text-muted)] font-medium">Type</th>
                  <th className="text-right py-3 text-[var(--color-text-muted)] font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] transition-colors"
                  >
                    <td className="py-3 text-[var(--color-text-secondary)]">
                      {new Date(tx.transactionDate).toLocaleDateString()}

                    </td>
                    <td className="py-3 text-[var(--color-text-primary)]">{tx.description}</td>
                    <td className="py-3 text-[var(--color-text-secondary)]">{tx.categoryName}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${tx.type?.toUpperCase() === "INCOME"
                            ? "bg-[var(--color-success)] bg-opacity-20 text-[var(--color-success)]"
                            : "bg-[var(--color-error)] bg-opacity-20 text-[var(--color-error)]"
                          }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-3 text-right font-semibold ${tx.type?.toUpperCase() === "INCOME" ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                        }`}
                    >
                      {tx.type?.toUpperCase() === "INCOME" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transaction">
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Grocery shopping"
              required
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-[var(--color-bg-tertiary)] rounded-sm text-black focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-[var(--color-bg-tertiary)] rounded-sm text-black focus:outline-none focus:border-[var(--color-primary)]"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Account
            </label>
            <select
              value={formData.accountId}
              onChange={(e) =>
                setFormData({ ...formData, accountId: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-[var(--color-bg-tertiary)] rounded-sm text-black focus:outline-none focus:border-[var(--color-primary)]"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

            <Input
              label="Date"
              type="date"
              value={formData.transactionDate}
              onChange={(e) =>
                setFormData({ ...formData, transactionDate: e.target.value })
              }
              required
            />
            <Button type="submit" className="w-full">
              Add Transaction
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
