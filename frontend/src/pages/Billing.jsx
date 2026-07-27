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
    silverRate,
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
    setSilverRate,
    setPostToLedger,
    // Computed
    totals,
    computedJamaFine,
    convertedFineAmount,
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


  let seed = {
    id: "bill-seed-79",
    billNo: "79",
    customerName: "VIKASH BHAGAT JI JAMUI",
    customerPhone: "9876543210",
    customerAddress: "Jamui",
    date: "2026-06-24",
    time: "09:21 PM",
    topHeader: "|| SHREE GANESHAYAA NAMAH ||",
    title: "ROUGH ESTIMATE",
    items: [
      { item: "OP* KATORI", weight: "101", panniDetail: "", less: "0", netWt: 101, tunch: "50", lab: "850", amount: 86, fine: 51 },
      { item: "PS DLX", weight: "3168", panniDetail: "8*2.7+49*2.3", less: "134", netWt: 3034, tunch: "56.5", lab: "", amount: 0, fine: 1714 },
      { item: "SM 70 PAYAL", weight: "126", panniDetail: "4*2.4", less: "10", netWt: 116, tunch: "55", lab: "", amount: 0, fine: 64 },
      { item: "BMP LX KANGNI", weight: "72", panniDetail: "25", less: "25", netWt: 47, tunch: "64", lab: "6000", amount: 282, fine: 30 },
      { item: "SPJ MICRO BICHIYA", weight: "122", panniDetail: "11", less: "11", netWt: 111, tunch: "60", lab: "3800", amount: 422, fine: 67 },
      { item: "SPJ SADA BICHIYA", weight: "96", panniDetail: "8", less: "8", netWt: 88, tunch: "60", lab: "2500", amount: 220, fine: 53 },
      { item: "BMP 60 BICHIYA", weight: "92", panniDetail: "3", less: "3", netWt: 89, tunch: "56", lab: "2500", amount: 223, fine: 50 },
      { item: "MICRO BICHIYA", weight: "96", panniDetail: "6", less: "6", netWt: 90, tunch: "56", lab: "4000", amount: 360, fine: 50 },
      { item: "MIX RING", weight: "37", panniDetail: "3.4", less: "3", netWt: 34, tunch: "65", lab: "17*12", amount: 204, fine: 22 },
      { item: "SS NICE GOT", weight: "500", panniDetail: "", less: "0", netWt: 500, tunch: "60", lab: "800", amount: 400, fine: 300 }
    ],
    totals: {
      weight: 4410,
      less: 200,
      netWt: 4210,
      amount: 2197,
      fine: 2401
    },
    lastBalance: {
      amount: 0,
      fine: 0
    },
    jamaDetail: {
      details: "KACHHI/807",
      weight: 3528,
      netWt: 3528,
      tunch: "45.5",
      fine: 1605,
      amount: 0
    },
    finalBaki: {
      amount: 2197,
      fine: 796
    },
    postedToUdhaar: false
  };

  // console.log(seed) for checking

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
              silverRate={silverRate}
              setSilverRate={setSilverRate}
              convertedFineAmount={convertedFineAmount}
              totals={totals}
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
              silverRate={silverRate}
              convertedFineAmount={convertedFineAmount}
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