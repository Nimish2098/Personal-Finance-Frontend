"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Edit2, Trash2 } from "lucide-react" // Import icons
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Modal from "../components/Modal"
import { budgetService } from "../services/budgets"
import { categoryService } from "../services/categories"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [activeMenuId, setActiveMenuId] = useState(null) // NEW State
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    loadBudgets()
    loadCategories()
  }, [])

  const loadBudgets = async () => {
    try {
      const data = await budgetService.getBudgets()
      setBudgets(data)
    } catch (err) {
      setError("Failed to load budgets")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data.filter((c) => c.type === "EXPENSE"))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount), // Try 'amount' first as per typical DTO, but ensure number
        budgetAmount: parseFloat(formData.amount), // Send both just in case backend DTO field name is different
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      }

      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, payload)
      } else {
        await budgetService.createBudget(payload)
      }
      setFormData({
        categoryId: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
      setEditingBudget(null)
      setIsModalOpen(false)
      await loadBudgets()
    } catch (err) {
      setError(editingBudget ? "Failed to update budget" : "Failed to create budget")
      console.error(err)
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      categoryId: budget.categoryId || "",
      amount: budget.budgetAmount || "",
      month: budget.month,
      year: budget.year,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetService.deleteBudget(id)
        await loadBudgets()
      } catch (err) {
        setError("Failed to delete budget")
        console.error(err)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBudget(null)
    setFormData({
      categoryId: "",
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    })
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Budgets
          </h1>
          <Button onClick={() => setIsModalOpen(true)}>Add Budget</Button>
        </div>

        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = budget.budgetAmount > 0
              ? (budget.spentAmount / budget.budgetAmount) * 100
              : 0
            const isOverBudget = percentage > 100

            return (
              <Card key={budget.id}>
                <div className="flex justify-between items-start mb-4 relative">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {budget.categoryName}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {new Date(budget.year, budget.month - 1).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === budget.id ? null : budget.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {activeMenuId === budget.id && (
                      <div className="absolute right-0 top-8 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden z-10 min-w-[120px]">
                        <button
                          onClick={() => {
                            handleEdit(budget)
                            setActiveMenuId(null)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(budget.id)
                            setActiveMenuId(null)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Budget</span>
                    <span className="text-[var(--color-text-primary)] font-semibold">
                      ${budget.budgetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Spent</span>
                    <span
                      className={`font-semibold ${isOverBudget
                        ? "text-[var(--color-error)]"
                        : "text-[var(--color-text-primary)]"
                        }`}
                    >
                      ${budget.spentAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                    <div
                      className={`h-full transition-all ${isOverBudget
                        ? "bg-[var(--color-error)]"
                        : percentage > 80
                          ? "bg-[var(--color-primary)]"
                          : "bg-[var(--color-success)]"
                        }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] text-right">
                    {percentage.toFixed(1)}% used
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {
          budgets.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              No budgets set. Click "Add Budget" to create one.
            </div>
          )
        }

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingBudget ? "Edit Budget" : "Add New Budget"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
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

            <Input
              label="Budget Amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Month
                </label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-white border border-[var(--color-bg-tertiary)] rounded-sm text-black focus:outline-none focus:border-[var(--color-primary)]"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(2000, m - 1).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Year
                </label>
                <Input
                  type="number"
                  min="2020"
                  max="2100"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {editingBudget ? "Update Budget" : "Create Budget"}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}