import { api } from "../utils/axios.utils";

export const purchaseService = {
  getPurchases: () => api.get("/purchases"),
  getProducts: () => api.get("/product"),
  createPurchase: (payload) => api.post("/purchases", payload),
  deletePurchase: (id) => api.delete(`/purchases/${id}`),
};