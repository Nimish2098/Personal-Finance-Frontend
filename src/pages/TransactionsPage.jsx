"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import Card from "../components/Card"
import Button from "../components/Button"
import { transactionService } from "../services/transactions"
import { categoryService } from "../services/categories"
import { accountService } from "../services/accounts"
import { Download, ChevronDown, ChevronUp } from "lucide-react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
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
      setLoading(true)
      const results = await Promise.allSettled([
        transactionService.getTransactions(0, 10),
        categoryService.getCategories(),
        accountService.getAccounts(),
      ])

      const [txResult, catResult, accResult] = results

      // Handle Transactions
      if (txResult.status === "fulfilled") {
        setTransactions(txResult.value.content)
      } else {
        console.error("Failed to load transactions:", txResult.reason)
        setError((prev) => prev + " Failed to load transactions.")
      }

      // Handle Categories
      if (catResult.status === "fulfilled") {
        setCategories(catResult.value)
      }

      // Handle Accounts
      if (accResult.status === "fulfilled") {
        const accs = accResult.value
        setAccounts(accs)
        // Default to first account if available and not set
        if (accs.length > 0 && !formData.accountId) {
          setFormData(prev => ({ ...prev, accountId: accs[0].id }))
        }
      }
    } catch (err) {
      setError("Critical failed to load data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async (e) => {
    e.preventDefault()
    setError("") // Clear previous errors
    if (!formData.accountId) {
      setError("Please select an account")
      return
    }
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
    }

    console.log("Submitting payload:", payload)

    try {
      await transactionService.createTransaction(payload)
      // Reset form but keep account/date
      setFormData(prev => ({
        ...prev,
        description: "",
        amount: "",
        categoryId: "",
        type: "EXPENSE"
      }))

      await loadData() // Reload list
      setIsFormOpen(false) // Close form on success
    } catch (err) {
      console.error("Create Transaction Error:", err)
      const errorMsg = err.response?.data?.message || err.message || "Unknown error"
      setError(`Failed to create transaction: ${errorMsg}`)
    }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="space-x-2 flex items-center">
          <Button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center">
            Add Transaction
            {isFormOpen ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
          </Button>

        </div>
      </div>

      {/* Collapsible Form Card */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">New Transaction</h2>

              <form onSubmit={handleCreateTransaction} className="space-y-6">
                {/* Toggle Type */}
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${formData.type === "EXPENSE"
                      ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "INCOME" })}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${formData.type === "INCOME"
                      ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Income
                  </button>
                </div>

                {/* Amount & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium ml-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium ml-1">Category</label>
                    <div className="relative">
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 appearance-none"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 font-medium ml-1">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Account & Date (Auxiliary Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium ml-1">Account</label>
                    <div className="relative">
                      <select
                        value={formData.accountId}
                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 appearance-none"
                      >
                        <option value="">Select account</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium ml-1">Date</label>
                    <input
                      type="date"
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 rounded-xl shadow-lg shadow-blue-500/30 font-bold"
                >
                  Add Transaction
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Transactions List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Description</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Category</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Type</th>
                  <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{tx.description}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{tx.categoryName}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type?.toUpperCase() === "INCOME"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 text-sm text-right font-bold ${tx.type?.toUpperCase() === "INCOME" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {tx.type?.toUpperCase() === "INCOME" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 text-sm">
                      No transactions found. Start by adding one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  )
}
