import { api } from "../utils/axios.utils.js";

const getAllReports = async () => {

    const res = await api.get("/billing")
    return res.data
}

const deleteBill = async (id) => {
    const res = await api.delete(`/billing/${id}`)
    return res.data
}

export {
    getAllReports,
    deleteBill
}