import api from "./api"

export const transactionService = {
  getTransactions: async (page = 0, size = 10) => {
  const response = await api.get("/transactions/paged", {
    params: { page, size },
  })
  return response.data
},


  createTransaction: async (transactionData) => {
    const response = await api.post("/transactions", transactionData)
    return response.data
  },

  getMonthlySummary: async (month, year) => {
  const response = await api.get(
    `/transactions/summary/monthly?month=${month}&year=${year}`
  )
  return response.data
},

getDashboardData: async (month, year) => {
  const response = await api.get(
    `/transactions/dashboard?month=${month}&year=${year}`
  )
  return response.data
},
getSpendingTrends: async (period, year, month = null) => {
  const params = { period, year }
  if (month) params.month = month
  const response = await api.get("/transactions/trends", { params })
  return response.data
},

getCashFlowAnalysis: async (month, year) => {
  const response = await api.get(
    `/transactions/cashflow?month=${month}&year=${year}`
  )
  return response.data
},

  exportCSV: async () => {
    const response = await api.get("/transactions/export/csv", {
      responseType: "blob",
    })
    return response.data
  },
}
