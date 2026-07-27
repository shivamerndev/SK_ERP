import { useDispatch, useSelector } from "react-redux";
import { 
  setSalesRecords, 
  setSalesLoading, 
  setSalesError, 
  addSaleRecord, 
  deleteSaleRecord 
} from "../store/features/sales.slice";
import { getBillHistory, saveBillHistory } from "../billing/billing.service";
import { deleteBill } from "../report/report.service";
import { toast } from "react-hot-toast";

const useSales = () => {
  const dispatch = useDispatch();
  const { salesRecords, isLoading, error } = useSelector((state) => state.sales);

  const fetchSalesRecords = async () => {
    dispatch(setSalesLoading(true));
    try {
      const res = await getBillHistory();
      const bills = res.data?.data || [];
      dispatch(setSalesRecords(bills));
    } catch (err) {
      console.error(err);
      dispatch(setSalesError(err.response?.data?.message || "Failed to load sales bills"));
      toast.error(err.response?.data?.message || "Failed to load sales bills");
    }
  };

  const createSaleBill = async (billData) => {
    try {
      const res = await saveBillHistory(billData);
      const savedBill = res.data?.data;
      if (savedBill) {
        dispatch(addSaleRecord(savedBill));
        toast.success(`Invoice No. ${savedBill.billNo} saved successfully!`);
        return savedBill;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save invoice");
      throw err;
    }
  };

  const deleteSaleBill = async (id) => {
    try {
      const res = await deleteBill(id);
      dispatch(deleteSaleRecord(id));
      toast.success(res.message || "Invoice deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete invoice");
      throw err;
    }
  };

  return {
    salesRecords,
    isLoading,
    error,
    fetchSalesRecords,
    createSaleBill,
    deleteSaleBill
  };
};

export default useSales;
