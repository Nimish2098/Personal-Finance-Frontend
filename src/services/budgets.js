import api from "./api"

export const budgetService = {
  getBudgets: async (month = null, year = null) => {
    if (month && year) {
      return (await api.get(`/budgets/month?month=${month}&year=${year}`)).data
    }
    const response = await api.get("/budgets")
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
    // Backend doesn't have /dashboard, using /month
    const response = await api.get(
      `/budgets/month?month=${month}&year=${year}`
    )
    return response.data
  },
}