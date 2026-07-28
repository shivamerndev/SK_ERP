import Customer from "../models/customer.model.js"


const createCustomer = async (customerData) => {
    const customer = await Customer.create(customerData).lean()
    return customer
}


const getAllCustomers = async () => {
    const customers = await Customer.find().select("fullName loyality phone totalLend totalSpent address").lean()
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


const updateCustomerBalances = async (customerId, spentInc, lendInc) => {
    const customer = await Customer.findByIdAndUpdate(
        customerId,
        { $inc: { totalSpent: spentInc, totalLend: lendInc } },
        { new: true }
    ).lean()
    return customer
}

const searchCustomers = async (query) => {
    const regex = new RegExp(query, "i");
    const customers = await Customer.find({
        $or: [
            { fullName: regex },
            { address: regex },
            { shopName: regex }
        ]
    }).select("fullName loyality phone totalLend totalSpent address shopName").lean();
    return customers;
}


export default { createCustomer, getAllCustomers, findCustomer, getCustomerById, updateCustomerBalances, searchCustomers }