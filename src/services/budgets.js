import api from "./api"

export const budgetService = {
  getBudgets: async (month = null, year = null) => {
    const params = {}
    if (month) params.month = month
    if (year) params.year = year
    const response = await api.get("/budgets", { params })
    return response.data
  },

  createBudget: async (budgetData) => {
    const response = await api.post("/budgets", budgetData)
    return response.data
  },

  updateBudget: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData)
    return response.data
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`)
    return response.data
  },

  getBudgetOverview: async (month, year) => {
    const response = await api.get(
      `/budgets/dashboard?month=${month}&year=${year}`
    )
    return response.data
  },
}