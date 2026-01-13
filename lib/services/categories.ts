import api from "@/lib/api"

export const categoryService = {
  getCategories: async () => {
    const response = await api.get("/categories")
    return response.data
  },

  createCategory: async (categoryData: any) => {
    const response = await api.post("/categories", categoryData)
    return response.data
  },
}
