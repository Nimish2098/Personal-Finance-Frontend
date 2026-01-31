"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import Card from "../components/Card"
import Button from "../components/Button"
import { transactionService } from "../services/transactions"
import { categoryService } from "../services/categories"
import { accountService } from "../services/accounts"
import { Download, ChevronDown, ChevronUp, Upload, Plus, FileText } from "lucide-react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false) // State for dropdown
  const fileInputRef = useRef(null)
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setLoading(true)
      await transactionService.importTransactions(file)
      await loadData() // Reload to see new items
      setError("")
      alert("Transactions imported successfully!")
    } catch (err) {
      console.error("Import failed:", err)
      const msg = err.response?.data || "Failed to import file"
      setError(typeof msg === 'string' ? msg : "Failed to import file")
    } finally {
      setLoading(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ""
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
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Transactions</h1>

        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />

          <div className="flex gap-2">
            <Button onClick={() => setIsImportMenuOpen(!isImportMenuOpen)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add / Import
              <ChevronDown className={`w-4 h-4 transition-transform ${isImportMenuOpen ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {isImportMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-xl rounded-xl overflow-hidden z-20">
              <button
                onClick={() => {
                  setIsFormOpen(true)
                  setIsImportMenuOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] text-left gap-3"
              >
                <Plus className="w-4 h-4 text-blue-500" />
                Manual Entry
              </button>
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                  setIsImportMenuOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] text-left gap-3 border-t border-[var(--color-border)]"
              >
                <FileText className="w-4 h-4 text-green-500" />
                Import CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">New Transaction</h2>

              <form onSubmit={handleCreateTransaction} className="space-y-6">
                {/* Toggle Type */}
                <div className="flex bg-[var(--color-bg-tertiary)] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${formData.type === "EXPENSE"
                      ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "INCOME" })}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${formData.type === "INCOME"
                      ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                  >
                    Income
                  </button>
                </div>

                {/* Amount & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)] font-medium ml-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)] font-medium ml-1">Category</label>
                    <div className="relative">
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-text-primary)] appearance-none"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-text-secondary)]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm text-[var(--color-text-secondary)] font-medium ml-1">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                  />
                </div>

                {/* Account & Date (Auxiliary Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)] font-medium ml-1">Account</label>
                    <div className="relative">
                      <select
                        value={formData.accountId}
                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-text-primary)] appearance-none"
                      >
                        <option value="">Select account</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id} className="text-black">{acc.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-text-secondary)]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--color-text-secondary)] font-medium ml-1">Date</label>
                    <input
                      type="date"
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-text-primary)]"
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
        <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Recent Transactions</h3>

        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-bg-tertiary)]/50 border-b border-[var(--color-border)]">
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">Description</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">Category</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">Type</th>
                  <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-[var(--color-text-muted)]">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-primary)] font-medium">{tx.description}</td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-secondary)]">{tx.categoryName}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type?.toUpperCase() === "INCOME"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 text-sm text-right font-bold ${tx.type?.toUpperCase() === "INCOME" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {tx.type?.toUpperCase() === "INCOME" ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-[var(--color-text-muted)] text-sm">
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
