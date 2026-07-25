import { useDispatch } from "react-redux";
import { setCustomers } from "../store/features/customer.slice";
import { createCustomerService, getAllCustomersService } from "./customer.service";
import { toast } from "react-hot-toast";

const useCustomer = () => {

  const dispatch = useDispatch();


  const handleCreateCustomer = async (customerData) => {

    const res = await createCustomerService(customerData)
    console.log(res.data)
  }

  const handleAllCustomers = async () => {
    const res = await getAllCustomersService()
    dispatch(setCustomers(res.data.data))
  }


  const handleExport = () => {
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
      toast.error("Failed to export database.", "error");
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
          c.name &&
          c.phone &&
          typeof c.creditLimit === "number" &&
          Array.isArray(c.transactions)
        );

        if (!isValid) {
          toast.error("Invalid structure inside backup file.");
          return;
        }

        setCustomers(importedData);
        toast.success("Database restored successfully!");
      } catch (err) {
        toast.error("Failed to parse JSON file.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset file input
  };

  const openWhatsApp = (c) => {
    const bal = getBalance(c);
    if (bal <= 0) return;

    const prefilledText = `Dear *${c.name}*,\n\nThis is a friendly reminder from *ERP Suite Store* regarding your outstanding balance of *₹${bal.toLocaleString("en-IN")}*.\n\nPlease clear it at your earliest convenience using UPI, cash, or bank transfer.\n\nThank you for your business!\n_Sent via ERP Suite_`;

    // Clean phone number (replace non digits)
    const phoneClean = c.phone.replace(/\D/g, "");
    // Prefill 91 for Indian country code if not present
    const finalPhone = phoneClean.length === 10 ? "91" + phoneClean : phoneClean;
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(prefilledText)}`;

    window.open(url, "_blank");
  };



  return {
    handleCreateCustomer,
    handleAllCustomers,
    handleExport,
    handleImport,
    openWhatsApp
  }

};

export default useCustomer;