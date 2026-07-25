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


export { createCustomer, getAllCustomers }