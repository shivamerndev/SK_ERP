import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import purchaseValidator from "../validator/purchase.validator.js";
import purchaseService from "../services/purchase.service.js";
import { AppError } from "../utils/error.utils.js";

const createPurchase = asyncHandler(async (req, res) => {
  const { error, value } = purchaseValidator(req.body);
  if (error) {
    throw new AppError(400, error.details[0].message, error);
  }

  const response = await purchaseService.createPurchase(value);
  return res.success(201, "Purchase Bill Saved Successfully 😊", response);
});

const getAllPurchases = asyncHandler(async (req, res) => {
  const response = await purchaseService.getAllPurchases();
  return res.success(200, "Purchase Bills Fetched Successfully", response);
});

const getPurchaseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await purchaseService.getPurchaseById(id);
  if (!response) {
    throw new AppError(404, "Purchase bill not found");
  }
  return res.success(200, "Purchase Bill Fetched Successfully", response);
});

const deletePurchase = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await purchaseService.deletePurchase(id);
  return res.success(200, "Purchase Bill Cancelled & Stocks Reverted Successfully", response);
});

export {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  deletePurchase
};
