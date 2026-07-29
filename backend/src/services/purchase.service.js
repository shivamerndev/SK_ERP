import purchaseRepo from "../repository/purchase.dao.js";
import Product from "../models/product.model.js";
import { AppError } from "../utils/error.utils.js";

const createPurchase = async (purchaseData) => {
  const purchase = await purchaseRepo.createPurchase(purchaseData);

  // Increment stock for each item in the purchase bill
  if (purchase.items && purchase.items.length > 0) {
    for (const item of purchase.items) {
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
      
      let product = null;
      if (item.sku && isValidObjectId(item.sku)) {
        product = await Product.findById(item.sku);
      }
      if (!product) {
        product = await Product.findOne({ name: item.productName });
      }

      if (!product) {
        // Create new product if it does not exist in inventory
        await Product.create({
          name: item.productName,
          pieces: item.quantity || 0,
          tunch: item.effectivePurity || 92.5,
          lab: item.labRate || 0,
          weight: [item.weight || 0],
          category: "payal"
        });
      } else {
        // Increment stock and record weight
        product.pieces = (product.pieces || 0) + (item.quantity || 0);
        if (item.weight) {
          product.weight.push(item.weight);
        }
        await product.save();
      }
    }
  }

  return purchase;
};

const getAllPurchases = async () => {
  const purchases = await purchaseRepo.getAllPurchases();
  return purchases;
};

const getPurchaseById = async (purchaseId) => {
  const purchase = await purchaseRepo.getPurchaseById(purchaseId);
  return purchase;
};

const deletePurchase = async (purchaseId) => {
  const purchase = await purchaseRepo.getPurchaseById(purchaseId);
  if (!purchase) {
    throw new AppError(404, "Purchase bill not found");
  }

  const response = await purchaseRepo.deletePurchase(purchaseId);

  // Revert/Deduct stock for each item in the cancelled purchase bill
  if (purchase.items && purchase.items.length > 0) {
    for (const item of purchase.items) {
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
      
      let product = null;
      if (item.sku && isValidObjectId(item.sku)) {
        product = await Product.findById(item.sku);
      }
      if (!product) {
        product = await Product.findOne({ name: item.productName });
      }

      if (product) {
        product.pieces = Math.max(0, (product.pieces || 0) - (item.quantity || 0));
        await product.save();
      }
    }
  }

  return response;
};

export default {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  deletePurchase
};
