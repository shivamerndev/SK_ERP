import { api } from "../utils/axios.utils.js"


const createCustomerService = (customerData) => api.post("/customer/", customerData)


const getAllCustomersService = () => api.get("/customer/")


export { createCustomerService, getAllCustomersService }