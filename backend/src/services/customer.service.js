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

const deleteCustomer = async (customerId) => {
    const response = await customerRepo.deleteCustomer(customerId)
    return response
}

const addTransaction = async (customerId, txData) => {
    const response = await customerRepo.addTransaction(customerId, txData)
    return response
}

const deleteTransaction = async (customerId, txId) => {
    const response = await customerRepo.deleteTransaction(customerId, txId)
    return response
}

const searchCustomers = async (query) => {
    const customers = await customerRepo.searchCustomers(query)
    return customers
}

const updateCustomer = async (customerId, updateData) => {
    if (updateData.phone) {
        const existingCustomer = await customerRepo.findCustomer({ phone: updateData.phone })
        if (existingCustomer && String(existingCustomer._id) !== String(customerId)) {
            throw new AppError(400, "Another customer with this phone number already exists")
        }
    }
    const response = await customerRepo.updateCustomer(customerId, updateData)
    return response
}

export default { createCustomer, getAllCustomers, deleteCustomer, addTransaction, deleteTransaction, searchCustomers, updateCustomer }