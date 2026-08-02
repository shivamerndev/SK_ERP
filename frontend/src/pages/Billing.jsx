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

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const target = e.target;
    if (!["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
    if (target.type === "submit" || target.type === "button") return;

    const form = e.currentTarget;
    const focusables = Array.from(
      form.querySelectorAll(
        'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled])'
      )
    ).filter((el) => el.type !== "submit" && el.type !== "button" && el.tabIndex !== -1);

    const index = focusables.indexOf(target);
    if (index !== -1) {
      if (index < focusables.length - 1) {
        e.preventDefault();
        const nextElement = focusables[index + 1];
        nextElement.focus();
        try {
          if (typeof nextElement.select === "function") {
            nextElement.select();
          }
        } catch (err) {
          // ignore select errors for input types like date
        }
      }
    }
  };

  return (
    <div className="space-y-6">

      <LiveChart/>

      <form onSubmit={handleForm(handleSaveInvoice)} onKeyDown={handleKeyDown} className="space-y-6 screen-only">

        <InvoiceInfoForm />

        <ItemsWorksheet />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <BalancesAndJama />

          <FinalSettlement />

        </div>

        <BillPreview />

      </form>

    </div>
  );
};

export default Billing;