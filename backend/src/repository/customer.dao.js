import Customer from "../models/customer.model.js"


const createCustomer = async (customerData) => {
    const customer = await Customer.create(customerData).lean()
    return customer
}


const getAllCustomers = async () => {
    const customers = await Customer.find().select("fullName loyality phone totalLend totalSpent").lean()
    return customers
}


const findCustomer = async (customerData) => {
    const { phone } = customerData
    const existingCusotmer = await Customer.findOne({ phone }).lean()
    return existingCusotmer
}


const getCustomerById = async (customerId) => {
    const customer = await Customer.findById(customerId).lean()
    return customer
}



export default { createCustomer, getAllCustomers, findCustomer, getCustomerById }