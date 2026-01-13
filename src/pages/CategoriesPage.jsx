"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Modal from "../components/Modal"
import { categoryService } from "../services/categories"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", type: "EXPENSE" })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (err) {
      setError("Failed to load categories")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      await categoryService.createCategory(formData)
      setFormData({ name: "", type: "EXPENSE" })
      setIsModalOpen(false)
      await loadCategories()
    } catch (err) {
      setError("Failed to create category")
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
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Categories</h1>
          <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
        </div>

        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{category.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Type: <span className="capitalize">{category.type}</span>
              </p>
            </Card>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <Input
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Groceries"
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
            <Button type="submit" className="w-full">
              Create Category
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
