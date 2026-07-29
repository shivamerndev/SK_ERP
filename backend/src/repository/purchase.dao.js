import Purchase from "../models/purchase.model.js";

const createPurchase = async (purchaseData) => {
  const purchase = await Purchase.create(purchaseData);
  return purchase.toObject();
};

const getAllPurchases = async () => {
  const purchases = await Purchase.find().sort({ createdAt: -1 }).lean();
  return purchases;
};

const getPurchaseById = async (purchaseId) => {
  const purchase = await Purchase.findById(purchaseId).lean();
  return purchase;
};

const deletePurchase = async (purchaseId) => {
  const purchase = await Purchase.findByIdAndDelete(purchaseId);
  return purchase ? purchase.toObject() : null;
};

export default {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  deletePurchase
};
