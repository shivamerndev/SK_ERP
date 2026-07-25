import { useState, useEffect } from "react";
import CreateForm from "../customers/components/CreateForm";
import useCustomer from "../customers/useCustomer";
import { allCustomers } from "../store/features/customer.slice";
import { useSelector } from "react-redux";
import TitleHeader from "../customers/components/TitleHeader";
import ConfirmModal from "../utils/ConfirmModal";
import Analytics from "../customers/components/Analytics";
import StatsGrid from "../customers/components/StatsGrid";
import CustomerTable from "../customers/components/CustomerTable";
import SlideDrawer from "../customers/components/SlideDrawer";


const Customers = () => {

  const { handleAllCustomers } = useCustomer();

  const customers = useSelector(allCustomers) || []

  const [showAnalytics, setShowAnalytics] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);



  useEffect(() => {
    handleAllCustomers()
  }, [])

  const [selectedCust, setSelectedCust] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  return (
    <div className="space-y-6">

      <TitleHeader setIsAddOpen={setIsAddOpen} />

      <StatsGrid />

      <Analytics setShowAnalytics={setShowAnalytics} showAnalytics={showAnalytics} />

      <CustomerTable setIsDrawerOpen={setIsDrawerOpen} setSelectedCust={setSelectedCust} setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} customers={customers} />

      {isAddOpen && <CreateForm onClose={() => setIsAddOpen(false)} />}

      {isDeleteConfirmOpen && <ConfirmModal title="Confirm Delete" message="Are you sure you want to delete this customer?" onConfirm={() => { setIsDeleteConfirmOpen(false); }} onCancel={() => { setIsDeleteConfirmOpen(false) }} />}

      {isDrawerOpen && selectedCust && <SlideDrawer selectedCust={selectedCust} setIsDrawerOpen={setIsDrawerOpen} />}

    </div>
  );
};

export default Customers;