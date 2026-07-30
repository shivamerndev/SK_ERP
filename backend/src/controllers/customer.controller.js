import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import customerValidator from "../validator/customer.validator.js";
import customerService from "../services/customer.service.js";
import { AppError } from "../utils/error.utils.js";

const createCustomer = asyncHandler(async (req, res) => {

    const { error, value } = customerValidator(req.body)
    if (error) throw new AppError(400, error.details[0].message, error)

    const response = await customerService.createCustomer(value)
    return res.success(201, "New Customer Added Successfully 😊", response)
})


const getAllCustomers = asyncHandler(async (req, res) => {
    const response = await customerService.getAllCustomers()
    return res.success(200, "Customers Fetched Successfully", response)
})


const deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params
    const response = await customerService.deleteCustomer(id)
    if (!response) throw new AppError(404, "Customer not found")
    return res.success(200, "Customer Deleted Successfully", response)
})


const addTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { date, type, amount, description, method } = req.body
    
    if (!date || !type || !amount) {
        throw new AppError(400, "Date, type, and amount are required fields")
    }

    const txData = {
        date,
        type,
        amount: parseFloat(amount),
        description: description || "",
        ...(type === "PAID" ? { method } : {})
    }

    const response = await customerService.addTransaction(id, txData)
    if (!response) throw new AppError(404, "Customer not found")
    return res.success(200, "Transaction Added Successfully", response)
})


const deleteTransaction = asyncHandler(async (req, res) => {
    const { id, txId } = req.params
    const response = await customerService.deleteTransaction(id, txId)
    if (!response) throw new AppError(404, "Customer or Transaction not found")
    return res.success(200, "Transaction Deleted Successfully", response)
})


export { createCustomer, getAllCustomers, deleteCustomer, addTransaction, deleteTransaction }