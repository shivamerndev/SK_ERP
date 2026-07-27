import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import billingValidator from "../validator/billing.validator.js";
import billingService from "../services/billing.service.js";
import { AppError } from "../utils/error.utils.js";

const createBill = asyncHandler(async (req, res) => {
  const { error, value } = billingValidator(req.body);
  if (error) {
    throw new AppError(400, error.details[0].message, error);
  }

  const response = await billingService.createBill(value);
  return res.success(201, "Bill Saved Successfully 😊", response);
});

const getAllBills = asyncHandler(async (req, res) => {
  const response = await billingService.getAllBills();
  return res.success(200, "Bills Fetched Successfully", response);
});

const getBillById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await billingService.getBillById(id);
  if (!response) {
    throw new AppError(404, "Bill not found");
  }
  return res.success(200, "Bill Fetched Successfully", response);
});

export {
  createBill,
  getAllBills,
  getBillById
};
