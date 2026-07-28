import { useState, useEffect } from "react";
import CreateForm from "../customers/components/CreateForm";
import useCustomer from "../customers/useCustomer";
import { allCustomers } from "../store/features/customer.slice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TitleHeader from "../customers/components/TitleHeader";
import ConfirmModal from "../utils/ConfirmModal";
import Analytics from "../customers/components/Analytics";
import StatsGrid from "../customers/components/StatsGrid";
import CustomerTable from "../customers/components/CustomerTable";
import SlideDrawer from "../customers/components/SlideDrawer";


const Customers = () => {

  const { handleAllCustomers } = useCustomer();
  const location = useLocation();

  const customers = useSelector(allCustomers) || []

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  useEffect(() => {
    handleAllCustomers()
  }, [])


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const customerId = params.get("id");
    if (customerId && customers.length > 0) {
      const cust = customers.find(c => String(c._id) === String(customerId));
      if (cust) {
        setSelectedCust(cust);
        setIsDrawerOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [customers, location.search]);


  return (
    <div className="space-y-4">

      <TitleHeader setIsAddOpen={setIsAddOpen} />

      {/* <StatsGrid /> */}

      {/* <Analytics /> */}

      <CustomerTable setIsDrawerOpen={setIsDrawerOpen} setSelectedCust={setSelectedCust} setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} customers={customers} />

      {isAddOpen && <CreateForm onClose={() => setIsAddOpen(false)} />}

      {isDeleteConfirmOpen && <ConfirmModal title="Confirm Delete" message="Are you sure you want to delete this customer?" onConfirm={() => { setIsDeleteConfirmOpen(false); }} onCancel={() => { setIsDeleteConfirmOpen(false) }} />}

      {isDrawerOpen && selectedCust && <SlideDrawer selectedCust={selectedCust} setIsDrawerOpen={setIsDrawerOpen} />}

    </div>
  );
};

export default Customers;