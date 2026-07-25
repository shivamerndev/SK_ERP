import useBilling from "../billing/useBilling";
import TitleHeader from "../billing/components/TitleHeader";
import InvoiceInfoForm from "../billing/components/InvoiceInfoForm";
import ItemsWorksheet from "../billing/components/ItemsWorksheet";
import BalancesAndJama from "../billing/components/BalancesAndJama";
import FinalSettlement from "../billing/components/FinalSettlement";
import BillPreview from "../billing/components/BillPreview";

const Billing = () => {
  
  const {
    // States
    billNo,
    customerName,
    customerPhone,
    customerAddress,
    selectedCustomerId,
    date,
    time,
    topHeader,
    billTitle,
    items,
    lastBalanceAmount,
    lastBalanceFine,
    jamaDetails,
    jamaWeight,
    jamaNetWt,
    jamaTunch,
    jamaAmount,
    postToLedger,
    previewBill,
    // Setters
    setBillNo,
    setCustomerName,
    setCustomerPhone,
    setCustomerAddress,
    setSelectedCustomerId,
    setDate,
    setTime,
    setTopHeader,
    setBillTitle,
    setLastBalanceAmount,
    setLastBalanceFine,
    setJamaDetails,
    setJamaWeight,
    setJamaNetWt,
    setJamaTunch,
    setJamaAmount,
    setPostToLedger,
    // Computed
    totals,
    computedJamaFine,
    finalBaki,
    filteredCustomers,
    products,
    
    // Handlers
    handleSelectCustomer,
    handleRowChange,
    handleAddRow,
    handleRemoveRow,
    handleClearForm,
    handleSaveInvoice,
    handlePrint
  } = useBilling();

  return (
    <div className="space-y-6">
      

      <TitleHeader />

      {/* CREATE INVOICE VIEW */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 screen-only">
          
          {/* Main Input Form Column */}
          <div className="xl:col-span-3 space-y-6">
            
            <InvoiceInfoForm
              topHeader={topHeader}
              setTopHeader={setTopHeader}
              billTitle={billTitle}
              setBillTitle={setBillTitle}
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              customerAddress={customerAddress}
              setCustomerAddress={setCustomerAddress}
              setSelectedCustomerId={setSelectedCustomerId}
              billNo={billNo}
              setBillNo={setBillNo}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              filteredCustomers={filteredCustomers}
              handleSelectCustomer={handleSelectCustomer}
            />

            <ItemsWorksheet
              items={items}
              handleRowChange={handleRowChange}
              handleAddRow={handleAddRow}
              handleRemoveRow={handleRemoveRow}
              products={products}
              totals={totals}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <BalancesAndJama
                lastBalanceAmount={lastBalanceAmount}
                setLastBalanceAmount={setLastBalanceAmount}
                lastBalanceFine={lastBalanceFine}
                setLastBalanceFine={setLastBalanceFine}
                jamaDetails={jamaDetails}
                setJamaDetails={setJamaDetails}
                jamaWeight={jamaWeight}
                setJamaWeight={setJamaWeight}
                jamaNetWt={jamaNetWt}
                setJamaNetWt={setJamaNetWt}
                jamaTunch={jamaTunch}
                setJamaTunch={setJamaTunch}
                jamaAmount={jamaAmount}
                setJamaAmount={setJamaAmount}
                computedJamaFine={computedJamaFine}
              />

              <FinalSettlement
                totals={totals}
                lastBalanceAmount={lastBalanceAmount}
                lastBalanceFine={lastBalanceFine}
                jamaAmount={jamaAmount}
                computedJamaFine={computedJamaFine}
                finalBaki={finalBaki}
                postToLedger={postToLedger}
                setPostToLedger={setPostToLedger}
                selectedCustomerId={selectedCustomerId}
                handleClearForm={handleClearForm}
                handleSaveInvoice={handleSaveInvoice}
              />

            </div>

          </div>

          {/* Sidebar Invoice Preview Section */}
          <BillPreview
            previewBill={previewBill}
            handlePrint={handlePrint}
          />

      </div>

    </div>
  );
};

export default Billing;