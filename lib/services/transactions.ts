import api from "@/lib/api"

export const transactionService = {
  getTransactions: async () => {
    const response = await api.get("/transactions")
    return response.data
  },

  createTransaction: async (transactionData: any) => {
    const response = await api.post("/transactions", transactionData)
    return response.data
  },

  getMonthlySummary: async () => {
    const response = await api.get("/transactions/summary/monthly")
    return response.data
  },

  getDashboardData: async () => {
    const response = await api.get("/transactions/dashboard")
    return response.data
  },

  exportCSV: async () => {
    const response = await api.get("/transactions/export/csv", {
      responseType: "blob",
    })
    return response.data
  },
}
