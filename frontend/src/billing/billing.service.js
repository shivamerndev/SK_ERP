import { api } from "../utils/axios.utils.js";

const getBillHistory = () => api.get("/billing");

const saveBillHistory = (billData) => api.post("/billing", billData);


export { getBillHistory, saveBillHistory };