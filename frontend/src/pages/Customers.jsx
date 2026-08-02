import { useState, useEffect } from "react";
import CreateForm from "../customers/components/CreateForm";
import EditForm from "../customers/components/EditForm";
import useCustomer from "../customers/useCustomer";
import { allCustomers } from "../store/features/customer.slice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TitleHeader from "../customers/components/TitleHeader";
import ConfirmModal from "../utils/ConfirmModal";
import StatsGrid from "../customers/components/StatsGrid";
import CustomerTable from "../customers/components/CustomerTable";
import SlideDrawer from "../customers/components/SlideDrawer";


const Customers = () => {

  const { handleAllCustomers, handleDeleteCustomer } = useCustomer();
  const location = useLocation();

  const customers = useSelector(allCustomers) || []

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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


  return ( customers &&
    <div className="space-y-4">

      <TitleHeader setIsAddOpen={setIsAddOpen} />

      <StatsGrid customers={customers}/>

      <CustomerTable 
        setIsDrawerOpen={setIsDrawerOpen} 
        setSelectedCust={setSelectedCust} 
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} 
        setIsEditOpen={setIsEditOpen}
        customers={customers} 
      />

      {isAddOpen && <CreateForm onClose={() => setIsAddOpen(false)} />}

      {isEditOpen && selectedCust && <EditForm customer={selectedCust} onClose={() => setIsEditOpen(false)} />}

      {isDeleteConfirmOpen && (
        <ConfirmModal 
          title="Confirm Delete" 
          message="Are you sure you want to delete this customer?" 
          onConfirm={async () => { 
            if (selectedCust?._id) { 
              await handleDeleteCustomer(selectedCust._id); 
            } 
            setIsDeleteConfirmOpen(false); 
          }} 
          onCancel={() => { setIsDeleteConfirmOpen(false) }} 
        />
      )}

      {isDrawerOpen && selectedCust && <SlideDrawer selectedCust={selectedCust} setIsDrawerOpen={setIsDrawerOpen} />}

    </div>
  );
};

export default Customers;