import Billing from "../models/billing.model.js";

const createBill = async (billData) => {
  const bill = await Billing.create(billData);
  return bill.toObject();
};

const getAllBills = async () => {
  const bills = await Billing.find().sort({ createdAt: -1 }).lean();
  return bills;
};

const getBillById = async (billId) => {
  const bill = await Billing.findById(billId).lean();
  return bill;
};


const deleteBill = async (billId) => {
  const bill = await Billing.findByIdAndDelete(billId);
  return bill.toObject();
}

export default {
  createBill,
  getAllBills,
  getBillById,
  deleteBill
};
