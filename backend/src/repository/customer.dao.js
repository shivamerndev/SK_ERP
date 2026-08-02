import mongoose from "mongoose";
import Customer from "../models/customer.model.js"


const createCustomer = async (customerData) => {
    const customer = await Customer.create(customerData)
    return customer.toObject ? customer.toObject() : customer
}


const getAllCustomers = async () => {
    const customers = await Customer.find().lean()
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


const deleteCustomer = async (customerId) => {
    const response = await Customer.findByIdAndDelete(customerId)
    return response
}


const updateCustomerBalances = async (customerId, spentInc, lendInc, billInfo = null) => {
    const updateQuery = {
        $inc: { totalSpent: spentInc, totalLend: lendInc }
    };

    if (billInfo) {
        if (lendInc > 0) {
            updateQuery.$push = {
                transactions: {
                    _id: new mongoose.Types.ObjectId(),
                    date: billInfo.date,
                    type: "LENT",
                    amount: lendInc,
                    description: `Lent via Bill No. ${billInfo.billNo}`,
                    billId: billInfo._id
                }
            };
        } else if (lendInc < 0) {
            updateQuery.$pull = {
                transactions: { billId: billInfo._id }
            };
        }
    }

    const customer = await Customer.findByIdAndUpdate(
        customerId,
        updateQuery,
        { new: true }
    ).lean()
    return customer
}


const addTransaction = async (customerId, txData) => {
    const incAmount = txData.type === "LENT" ? txData.amount : -txData.amount;
    const customer = await Customer.findByIdAndUpdate(
        customerId,
        {
            $push: { transactions: txData },
            $inc: { totalLend: incAmount }
        },
        { new: true }
    ).lean();
    return customer;
}


const deleteTransaction = async (customerId, txId) => {
    const customer = await Customer.findById(customerId).lean();
    if (!customer) return null;

    const tx = customer.transactions.find(t => String(t._id) === String(txId));
    if (!tx) return customer;

    const decAmount = tx.type === "LENT" ? -tx.amount : tx.amount;

    const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
            $pull: { transactions: { _id: txId } },
            $inc: { totalLend: decAmount }
        },
        { new: true }
    ).lean();
    return updatedCustomer;
}


const searchCustomers = async (query) => {
    const regex = new RegExp(query, "i");
    const customers = await Customer.find({
        $or: [
            { fullName: regex },
            { address: regex },
            { shopName: regex }
        ]
    }).lean();
    return customers;
}

const updateCustomer = async (customerId, updateData) => {
    const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).lean();
    return updatedCustomer;
}


export default { createCustomer, getAllCustomers, findCustomer, getCustomerById, deleteCustomer, updateCustomerBalances, addTransaction, deleteTransaction, searchCustomers, updateCustomer }