const SEED_BILL = {
  id: "bill-seed-79",
  billNo: "79",
  customerName: "VIKASH BHAGAT JI JAMUI",
  customerPhone: "9876543210",
  customerAddress: "Jamui",
  date: "2026-06-24",
  time: "09:21 PM",
  topHeader: "|| SHREE GANESHAYAA NAMAH ||",
  title: "ROUGH ESTIMATE",
  items: [
    { item: "OP* KATORI", weight: "101", panniDetail: "", less: "0", netWt: 101, tunch: "50", lab: "850", amount: 86, fine: 51 },
    { item: "PS DLX", weight: "3168", panniDetail: "8*2.7+49*2.3", less: "134", netWt: 3034, tunch: "56.5", lab: "", amount: 0, fine: 1714 },
    { item: "SM 70 PAYAL", weight: "126", panniDetail: "4*2.4", less: "10", netWt: 116, tunch: "55", lab: "", amount: 0, fine: 64 },
    { item: "BMP LX KANGNI", weight: "72", panniDetail: "25", less: "25", netWt: 47, tunch: "64", lab: "6000", amount: 282, fine: 30 },
    { item: "SPJ MICRO BICHIYA", weight: "122", panniDetail: "11", less: "11", netWt: 111, tunch: "60", lab: "3800", amount: 422, fine: 67 },
    { item: "SPJ SADA BICHIYA", weight: "96", panniDetail: "8", less: "8", netWt: 88, tunch: "60", lab: "2500", amount: 220, fine: 53 },
    { item: "BMP 60 BICHIYA", weight: "92", panniDetail: "3", less: "3", netWt: 89, tunch: "56", lab: "2500", amount: 223, fine: 50 },
    { item: "MICRO BICHIYA", weight: "96", panniDetail: "6", less: "6", netWt: 90, tunch: "56", lab: "4000", amount: 360, fine: 50 },
    { item: "MIX RING", weight: "37", panniDetail: "3.4", less: "3", netWt: 34, tunch: "65", lab: "17*12", amount: 204, fine: 22 },
    { item: "SS NICE GOT", weight: "500", panniDetail: "", less: "0", netWt: 500, tunch: "60", lab: "800", amount: 400, fine: 300 }
  ],
  totals: {
    weight: 4410,
    less: 200,
    netWt: 4210,
    amount: 2197,
    fine: 2401
  },
  lastBalance: {
    amount: 0,
    fine: 0
  },
  jamaDetail: {
    details: "KACHHI/807",
    weight: 3528,
    netWt: 3528,
    tunch: "45.5",
    fine: 1605,
    amount: 0
  },
  finalBaki: {
    amount: 2197,
    fine: 796
  },
  postedToUdhaar: false
};

const getBillHistory = () => {
  const saved = localStorage.getItem("erp_bills");
  return saved ? JSON.parse(saved) : [SEED_BILL];
};

const saveBillHistory = (history) => {
  localStorage.setItem("erp_bills", JSON.stringify(history));
};

const getUdhaarCustomers = () => {
  const rawCustomers = localStorage.getItem("erp_udhaar_customers");
  return rawCustomers ? JSON.parse(rawCustomers) : [];
};

const saveUdhaarCustomers = (customers) => {
  localStorage.setItem("erp_udhaar_customers", JSON.stringify(customers));
};

const getProductsList = () => {
  const rawProducts = localStorage.getItem("erp_products");
  return rawProducts ? JSON.parse(rawProducts) : [];
};

const getGeneralTransactions = () => {
  const rawTransactions = localStorage.getItem("erp_general_transactions");
  return rawTransactions ? JSON.parse(rawTransactions) : [];
};

const saveGeneralTransactions = (transactions) => {
  localStorage.setItem("erp_general_transactions", JSON.stringify(transactions));
};

export {
  SEED_BILL,
  getBillHistory,
  saveBillHistory,
  getUdhaarCustomers,
  saveUdhaarCustomers,
  getProductsList,
  getGeneralTransactions,
  saveGeneralTransactions
};
