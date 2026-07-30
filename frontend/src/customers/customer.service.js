import { api } from "../utils/axios.utils.js"


const createCustomerService = (customerData) => api.post("/customer/", customerData)


const getAllCustomersService = () => api.get("/customer/")


const deleteCustomerService = (id) => api.delete(`/customer/${id}`)


const recordTransactionService = (customerId, txData) => api.post(`/customer/${customerId}/transaction`, txData)


const deleteTransactionService = (customerId, txId) => api.delete(`/customer/${customerId}/transaction/${txId}`)


export { createCustomerService, getAllCustomersService, deleteCustomerService, recordTransactionService, deleteTransactionService }