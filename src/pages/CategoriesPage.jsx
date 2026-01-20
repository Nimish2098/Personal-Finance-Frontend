"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
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
  const [activeMenuId, setActiveMenuId] = useState(null)

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

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.deleteCategory(id)
        await loadCategories()
      } catch (err) {
        setError("Failed to delete category")
        console.error(err)
      }
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
              <div className="flex justify-between items-start mb-2 relative">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{category.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Type: <span className="capitalize">{category.type}</span>
                  </p>
                </div>


                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === category.id ? null : category.id)}
                    className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>

                  {activeMenuId === category.id && (
                    <div className="absolute right-0 top-8 bg-[var(--color-bg-secondary)] shadow-xl rounded-lg border border-[var(--color-border)] overflow-hidden z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          handleDeleteCategory(category.id)
                          setActiveMenuId(null)
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Category"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="EXPENSE" className="text-black">Expense</option>
                <option value="INCOME" className="text-black">Income</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Create Category
            </Button>
          </form>
        </Modal>
      </div>
    </div >
  )
}
