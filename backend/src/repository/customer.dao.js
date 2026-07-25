import Customer from "../models/customer.model.js"


const createCustomer = async (customerData) => {
    const customer = await Customer.create(customerData)
    return customer
}


const getAllCustomers = async () => {
    const customers = await Customer.find()
    return customers
}


const findCustomer = async (customerData) => {
    const { phone } = customerData
    const existingCusotmer = await Customer.findOne({ phone })
    return existingCusotmer
}


const getCustomerById = async (customerId) => {
    const customer = await Customer.findById(customerId)
    return customer
}



export default { createCustomer, getAllCustomers, findCustomer, getCustomerById }