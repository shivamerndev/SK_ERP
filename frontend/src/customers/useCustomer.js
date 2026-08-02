import { useDispatch } from "react-redux";
import { setCustomers } from "../store/features/customer.slice";
import { 
  createCustomerService, 
  getAllCustomersService, 
  updateCustomerService,
  deleteCustomerService, 
  recordTransactionService, 
  deleteTransactionService 
} from "./customer.service";
import { toast } from "react-hot-toast";

const useCustomer = () => {

  const dispatch = useDispatch();


  const handleCreateCustomer = async (customerData) => {
    try {
      const res = await createCustomerService(customerData)
      if (res.data?.success || res.status === 201) {
        toast.success(res.data?.message || "Customer created successfully!");
        handleAllCustomers();
        return true;
      } else {
        toast.error(res.data?.message || "Failed to create customer");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  }

  const handleAllCustomers = async () => {
    try {
      const res = await getAllCustomersService()
      dispatch(setCustomers(res.data.data))
    } catch (error) {
      console.error("Failed to fetch customers:", error)
    }
  }

  const handleUpdateCustomer = async (id, customerData) => {
    try {
      const res = await updateCustomerService(id, customerData)
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || "Customer updated successfully!");
        handleAllCustomers();
        return true;
      } else {
        toast.error(res.data?.message || "Failed to update customer");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  }

  const handleDeleteCustomer = async (id) => {
    try {
      const res = await deleteCustomerService(id)
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || "Customer deleted successfully!");
        handleAllCustomers();
        return true;
      } else {
        toast.error(res.data?.message || "Failed to delete customer");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  }

  const handleRecordTransaction = async (customerId, txData) => {
    try {
      const res = await recordTransactionService(customerId, txData)
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || "Transaction recorded successfully!");
        handleAllCustomers();
        return true;
      } else {
        toast.error(res.data?.message || "Failed to record transaction");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  }

  const handleDeleteTransaction = async (customerId, txId) => {
    try {
      const res = await deleteTransactionService(customerId, txId)
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || "Transaction deleted successfully!");
        handleAllCustomers();
        return true;
      } else {
        toast.error(res.data?.message || "Failed to delete transaction");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  }


  const handleExport = (customers) => {
    try {
      const dataStr = JSON.stringify(customers, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `erp_customers_backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast.success("Database backup downloaded successfully!");
    } catch (e) {
      toast.error("Failed to export database.");
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData)) {
          toast.error("Invalid format: Backup must be a list of customers.");
          return;
        }

        // Schema validation
        const isValid = importedData.every(c =>
          c.id &&
          c.fullName &&
          c.phone &&
          typeof c.creditLimit === "number" &&
          Array.isArray(c.transactions)
        );

        if (!isValid) {
          toast.error("Invalid structure inside backup file.");
          return;
        }

        dispatch(setCustomers(importedData));
        toast.success("Database restored successfully!");
      } catch (err) {
        toast.error("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset file input
  };


  return {
    handleCreateCustomer,
    handleAllCustomers,
    handleUpdateCustomer,
    handleDeleteCustomer,
    handleRecordTransaction,
    handleDeleteTransaction,
    handleExport,
    handleImport
  }

};

export default useCustomer;