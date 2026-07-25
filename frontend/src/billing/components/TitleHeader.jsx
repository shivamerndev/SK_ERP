import React from "react";

const TitleHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 screen-only">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing Panel</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create estimates, calculate purities/labor rates, and export classic receipts.
        </p>
      </div>
    </div>
  );
};

export default TitleHeader;
