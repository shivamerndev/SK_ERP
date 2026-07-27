import billingRepo from "../repository/billing.dao.js";
import customerRepo from "../repository/customer.dao.js";

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

export default {
  createBill,
  getAllBills,
  getBillById
};
