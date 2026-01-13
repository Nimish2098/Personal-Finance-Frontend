"use client"

import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Modal from "../components/Modal"
import { accountService } from "../services/accounts"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
  name: "",
  type: "CASH",     
  balance: 0,
})



  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAccounts()
      setAccounts(data)
    } catch (err) {
      setError("Failed to load accounts")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    try {
      await accountService.createAccount(formData)
      setFormData({ name: "", initialBalance: "" })
      setIsModalOpen(false)
      await loadAccounts()
    } catch (err) {
      setError("Failed to create account")
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
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Accounts</h1>
          <Button onClick={() => setIsModalOpen(true)}>Add Account</Button>
        </div>

        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{account.name}</h3>
              <p className="text-2xl font-bold text-[var(--color-primary)]">${account.balance}</p>
            </Card>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Account">
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <Input
              label="Account Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Checking Account"
              required
            />
            <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Account Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-[var(--color-bg-tertiary)] rounded-sm text-black focus:outline-none focus:border-[var(--color-primary)]"
                required
              >
                <option value="CASH">Cash</option>
                <option value="BANK">Bank</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>

           <Input
                label="Initial Balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({ ...formData, balance: Number(e.target.value) })
                }
                required
              />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
