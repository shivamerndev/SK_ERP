import { AppError } from "../utils/error.utils.js";
import customerRepo from "../repository/customer.dao.js"

const createCustomer = async (customerData) => {

    const existingCustomer = await customerRepo.findCustomer(customerData)
    if (existingCustomer) throw new AppError(400, "Customer already exists", existingCustomer)

    const customer = await customerRepo.createCustomer(customerData)
    return customer

}

const getAllCustomers = async () => {
    const customers = await customerRepo.getAllCustomers()
    return customers
}

const searchCustomers = async (query) => {
    const customers = await customerRepo.searchCustomers(query)
    return customers
}

export default { createCustomer, getAllCustomers, searchCustomers }