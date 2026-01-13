import api from "@/lib/api"

export const accountService = {
  getAccounts: async () => {
    const response = await api.get("/accounts")
    return response.data
  },

  createAccount: async (accountData: any) => {
    const response = await api.post("/accounts", accountData)
    return response.data
  },
}
