import useBilling from "../billing/useBilling";
import InvoiceInfoForm from "../billing/components/InvoiceInfoForm";
import ItemsWorksheet from "../billing/components/ItemsWorksheet";
import BalancesAndJama from "../billing/components/BalancesAndJama";
import FinalSettlement from "../billing/components/FinalSettlement";
import BillPreview from "../billing/components/BillPreview";
import LiveChart from "../billing/components/LiveChart";
import handleForm from "../utils/formHandler.utils.js";

const Billing = () => {
  // Initialize hooks & API loads in the parent component
  const { handleSaveInvoice } = useBilling(true);

  return (
    <div className="space-y-6">

      <LiveChart/>
      <hr className="text-black/50"/>
      {/* CREATE INVOICE VIEW */}
      <form onSubmit={handleForm(handleSaveInvoice)} className="grid grid-cols-1 xl:grid-cols-4 gap-6 screen-only">

        {/* Main Input Form Column */}
        <div className="xl:col-span-3 space-y-6">

          <InvoiceInfoForm />

          <ItemsWorksheet />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <BalancesAndJama />

            <FinalSettlement />

          </div>

        </div>

        {/* Sidebar Invoice Preview Section */}
        <BillPreview />

      </form>

    </div>
  );
};

export default Billing;