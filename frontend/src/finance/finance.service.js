import { api } from "../utils/axios.utils.js";

export const financeService = {
  getExpenses: () => api.get("/expenses"),
  createExpense: (payload) => api.post("/expenses", payload),
  updateExpense: (id, payload) => api.put(`/expenses/${id}`, payload),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};
