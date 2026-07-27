import billingRepo from "../repository/billing.dao.js";
import customerRepo from "../repository/customer.dao.js";
import { AppError } from "../utils/error.utils.js";

const createBill = async (billData) => {

  const bill = await billingRepo.createBill(billData);

  if (bill.postedToUdhaar && bill.customerId) {
    const spentInc = bill.totals?.amount || 0;
    const lendInc = bill.finalBaki?.amount || 0;
    await customerRepo.updateCustomerBalances(bill.customerId, spentInc, lendInc);
  }

  return bill;
};

const getAllBills = async () => {
  let bills = await billingRepo.getAllBills();
  return bills;
};

const getBillById = async (billId) => {
  const bill = await billingRepo.getBillById(billId);
  return bill;
};


const deleteBill = async (billId) => {

  const bill = await billingRepo.getBillById(billId);
  if (!bill) {
    throw new AppError(404, "Bill not found");
  }
  const response = await billingRepo.deleteBill(billId);

  if (bill.postedToUdhaar && bill.customerId) {
    const spentDec = -(bill.totals?.amount || 0);
    const lendDec = -(bill.finalBaki?.amount || 0);
    await customerRepo.updateCustomerBalances(bill.customerId, spentDec, lendDec);
  }

  return response;
}

export default {
  createBill,
  getAllBills,
  getBillById,
  deleteBill
};
