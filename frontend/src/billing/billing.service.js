import { api } from "../utils/axios.utils.js";

const getBillHistory = () => api.get("/billing");

const saveBillHistory = (billData) => api.post("/billing", billData);

const getProductsList = () => [
  { id: "p1", name: "OP* KATORI" },
  { id: "p2", name: "PS DLX" },
  { id: "p3", name: "SM 70 PAYAL" },
  { id: "p4", name: "BMP LX KANGNI" },
  { id: "p5", name: "SPJ MICRO BICHIYA" },
  { id: "p6", name: "SPJ SADA BICHIYA" },
  { id: "p7", name: "BMP 60 BICHIYA" },
  { id: "p8", name: "MICRO BICHIYA" },
  { id: "p9", name: "MIX RING" },
  { id: "p10", name: "SS NICE GOT" }
];

export {
  getBillHistory,
  saveBillHistory,
  getProductsList
};
