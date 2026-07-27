import { getAllReports, deleteBill as deleteBillApi } from "../report.service"
import { useDispatch, useSelector } from "react-redux"
import { setReports, setSelectedBill } from "../../store/features/report.slice"
import { showToast } from "../../utils/toast.utils"

const useReport = () => {

    const dispatch = useDispatch()
    const { reports: history, selectedBill } = useSelector((state) => state.report)

    const handleGetReports = async () => {
        const res = await getAllReports()
        if (res.success) {
            dispatch(setReports(res.data))
            showToast(res.message)
        }
        else {
            showToast(res.message, "error")
        }
    }

    const handleDeleteBill = async (id) => {
        if (confirm("Are you sure you want to delete this invoice record from logs?")) {
            try {
                const res = await deleteBillApi(id)
                if (res.success) {
                    dispatch(setReports(history.filter((b) => b._id !== id)))
                    if (selectedBill && selectedBill._id === id) {
                        dispatch(setSelectedBill(null))
                    }
                    showToast(res.message || "Invoice deleted successfully!", "success")
                } else {
                    showToast(res.message || "Failed to delete invoice", "error")
                }
            } catch (error) {
                showToast(error.response?.data?.message || "Error deleting invoice", "error")
            }
        }
    };

    const handleSelectBill = (bill = null) => {
        dispatch(setSelectedBill(bill))
    }


    return { handleGetReports, handleDeleteBill, selectedBill, handleSelectBill, history }
}

export default useReport