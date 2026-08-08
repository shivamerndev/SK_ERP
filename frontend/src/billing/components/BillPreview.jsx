import { FileText, Download, X } from "lucide-react";
import { createPortal } from "react-dom";
import useBilling from "../useBilling";

const BillPreview = () => {
  const { previewBill, setPreviewBill, handlePrint } = useBilling();

  if (!previewBill) return null;

  return (
    <>
      {/* MODAL BACKDROP OVERLAY */}
      <div className="fixed uppercase inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 screen-only">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Invoice Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePrint(previewBill)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Print PDF
              </button>
              <button
                type="button"
                onClick={() => setPreviewBill(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="text-center font-bold text-slate-700 border-b border-dashed border-slate-200 pb-2">
                <p className="text-[11px] text-slate-500">{previewBill.topHeader}</p>
                <p className="text-base font-black tracking-wider text-slate-800 mt-0.5">{previewBill.title}</p>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <p><span className="font-bold text-slate-800">Bill No:</span> #{previewBill.billNo}</p>
                  <p className="mt-1 font-bold text-slate-900 text-sm">{previewBill.customerName}</p>
                  {previewBill.customerPhone && <p className="mt-0.5 text-slate-500">{previewBill.customerPhone}</p>}
                </div>
                <div className="text-right text-slate-500">
                  <p className="font-medium">{previewBill.date}</p>
                  <p className="mt-0.5">{previewBill.time}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t border-b border-slate-200/80 py-2 space-y-1">
                <div className="grid grid-cols-5 text-xs font-bold border-b border-slate-200 pb-1 text-slate-700">
                  <span className="col-span-2">Item</span>
                  <span className="text-right">Net Wt</span>
                  <span className="text-right">Amt</span>
                  <span className="text-right">Fine</span>
                </div>
                {previewBill.items.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-5 text-xs text-slate-600 font-semibold py-1 border-b border-slate-100 last:border-0">
                    <span className="col-span-2 truncate">{row.item}</span>
                    <span className="text-right">{row.netWt}g</span>
                    <span className="text-right">{row.amount ? `₹${row.amount}` : "-"}</span>
                    <span className="text-right">{row.fine ? `${row.fine}g` : "-"}</span>
                  </div>
                ))}
              </div>

              {/* Summary totals */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Total Sale Wt / Fine:</span>
                  <span>{previewBill.totals.netWt}g / {previewBill.totals.fine}g</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Total Sale Labor Amt:</span>
                  <span>₹{previewBill.totals.amount}</span>
                </div>
                {previewBill.lastBalance && (previewBill.lastBalance.amount > 0 || previewBill.lastBalance.fine > 0) && (
                  <div className="flex justify-between text-slate-500 font-semibold border-t border-slate-100 pt-1">
                    <span>Last Balance:</span>
                    <span>{previewBill.lastBalance.fine}g / ₹{previewBill.lastBalance.amount}</span>
                  </div>
                )}
                {previewBill.silverRate > 0 && (
                  <div className="flex justify-between text-indigo-600 font-semibold border-t border-slate-100 pt-1">
                    <span>Bhaw Settle ({previewBill.silverRate}/kg):</span>
                    <span>+₹{previewBill.convertedFineAmount}</span>
                  </div>
                )}
                {previewBill.jamaDetail.details && (
                  <div className="flex justify-between text-indigo-600 font-semibold border-t border-slate-100 pt-1">
                    <span>Jama ({previewBill.jamaDetail.details}):</span>
                    <span>{previewBill.jamaDetail.fine}g / ₹{previewBill.jamaDetail.amount}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 border-t border-slate-300 pt-2 text-sm bg-slate-100 p-2.5 rounded-lg mt-2">
                  <span>BAKI AMT / FINE:</span>
                  <span className="text-blue-700">₹{previewBill.finalBaki.amount} / {previewBill.finalBaki.fine}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY TRADITIONAL ESTIMATE SLIP CONTAINER */}
      {previewBill && createPortal(
        <div className="print-invoice print-only uppercase">
          <div className="print-container">
            {/* Header section */}
            <div className="print-header font-serif">
              <p className="traditional-hail">{previewBill.topHeader}</p>
              <h1 className="traditional-title">{previewBill.title}</h1>
            </div>

            {/* Meta client detail info row */}
            <div className="print-meta-grid">
              <div className="meta-col-left font-sans font-bold">
                <p>Bill No. &nbsp;<span className="">{previewBill.billNo}</span></p>
                <p className="meta-client-name mt-1">{previewBill.customerName}</p>
              </div>
              <div className="meta-col-right text-right font-sans font-bold">
                <p className="">{previewBill.time}</p>
                <p className=" mt-1">{previewBill.date}</p>
              </div>
            </div>

            {/* Ledger Table */}
            <table className="traditional-bill-table font-sans">
              <thead>
                <tr>
                  <th className="col-amount text-center font-bold" style={{ border: '1px solid black' }}>Amount</th>
                  <th className="col-item text-left font-bold" style={{ border: '1px solid black' }}>Item</th>
                  <th className="col-weight text-right font-bold" style={{ border: '1px solid black' }}>Weight</th>
                  <th className="col-panni text-left font-bold" style={{ border: '1px solid black' }}>Panni Detail</th>
                  <th className="col-less text-right font-bold" style={{ border: '1px solid black' }}>Less</th>
                  <th className="col-netwt text-right font-bold" style={{ border: '1px solid black' }}>Net Wt.</th>
                  <th className="col-tunch text-right font-bold" style={{ border: '1px solid black' }}>Tunch</th>
                  <th className="col-lab text-right font-bold" style={{ border: '1px solid black' }}>Lab.</th>
                  <th className="col-fine text-right font-bold" style={{ border: '1px solid black' }}>Fine</th>
                </tr>
              </thead>
              <tbody>
                {previewBill.items.map((row, idx) => (
                  <tr key={idx}>
                    <td className="col-amount  text-center">{row.amount || ""}</td>
                    <td className="col-item text-left font-bold">{row.item}</td>
                    <td className="col-weight  text-right">{row.weight}</td>
                    <td className="col-panni  text-left">{row.panniDetail || ""}</td>
                    <td className="col-less  text-right">{row.less || ""}</td>
                    <td className="col-netwt  text-right">{row.netWt || ""}</td>
                    <td className="col-tunch  text-right">{row.tunch}</td>
                    <td className="col-lab  text-right">{row.lab || ""}</td>
                    <td className="col-fine  text-right">{row.fine || ""}</td>
                  </tr>
                ))}

                {/* TOTAL SALE ROW */}
                {!(previewBill.silverRate > 0) && (
                  <tr className="row-total-sale">
                    <td className="col-amount  text-center font-bold">{previewBill.totals.amount || ""}</td>
                    <td className="col-item text-left font-black">TOTAL SALE</td>
                    <td className="col-weight  text-right font-bold">{previewBill.totals.weight}</td>
                    <td className="col-panni">&nbsp;</td>
                    <td className="col-less  text-right font-bold">{previewBill.totals.less || ""}</td>
                    <td className="col-netwt  text-right font-bold">{previewBill.totals.netWt}</td>
                    <td className="col-tunch">&nbsp;</td>
                    <td className="col-lab">&nbsp;</td>
                    <td className="col-fine  text-right font-bold">{previewBill.totals.fine}</td>
                  </tr>
                )}

                {/* LAST BALANCE ROW */}
                <tr className="row-last-bal">
                  <td className="col-amount  text-center font-bold">{previewBill.lastBalance.amount || ""}</td>
                  <td className="col-item text-left text-slate-500 font-bold">Last Bal. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className=" text-xs">{previewBill.date}</span></td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine  text-right font-bold">{previewBill.lastBalance.fine || "0"}</td>
                </tr>

                {/* TOTAL SALE + LAST BAL ROW */}
                <tr className="row-inter-total">
                  <td className="col-amount  text-center font-bold">
                    {previewBill.totals.amount + previewBill.lastBalance.amount || ""}
                  </td>
                  <td className="col-item text-left font-black">Total</td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine  text-right font-bold">
                    {previewBill.totals.fine + previewBill.lastBalance.fine || ""}
                  </td>
                </tr>

                {/* BHAW FINE SETTLEMENT ROW */}
                {previewBill.silverRate > 0 && (
                  <tr className="row-bhaw-settle">
                    <td className="col-amount  text-center font-bold">
                      {previewBill.convertedFineAmount || ""}
                    </td>
                    <td className="col-item text-left font-bold">
                      Bhaw - {previewBill.time}
                    </td>
                    <td className="col-weight  text-right font-bold">
                      {previewBill.silverRate}
                    </td>
                    <td className="col-panni">&nbsp;</td>
                    <td className="col-less">&nbsp;</td>
                    <td className="col-netwt">&nbsp;</td>
                    <td className="col-tunch">&nbsp;</td>
                    <td className="col-lab">&nbsp;</td>
                    <td className="col-fine  text-right font-bold">
                      {previewBill.totals.fine + (previewBill.lastBalance.fine || 0) - (previewBill.jamaDetail.fine || 0)}
                    </td>
                  </tr>
                )}

                {/* JAMA DETAIL ROW */}
                <tr className="row-jama-detail">
                  <td className="col-amount  text-center font-bold">
                    {previewBill.jamaDetail.amount || ""}
                  </td>
                  <td className="col-item text-left font-bold">
                    {previewBill.silverRate > 0 ? (previewBill.jamaDetail.details || "CASH JAMA") : (
                      <>
                        Jama Detail <br />
                        <span className="font-normal">{previewBill.jamaDetail.details || ""}</span>
                      </>
                    )}
                  </td>
                  <td className="col-weight  text-right">
                    {previewBill.silverRate > 0 ? "" : (previewBill.jamaDetail.weight || "")}
                  </td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt  text-right">
                    {previewBill.silverRate > 0 ? "" : (previewBill.jamaDetail.netWt || "")}
                  </td>
                  <td className="col-tunch  text-right">
                    {previewBill.silverRate > 0 ? "" : (previewBill.jamaDetail.tunch || "")}
                  </td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine  text-right font-bold">
                    {previewBill.silverRate > 0 ? "" : (previewBill.jamaDetail.fine || "")}
                  </td>
                </tr>

                {/* BAKI FINAL ROW */}
                <tr className="row-baki-final">
                  <td className="col-amount  text-center font-black text-lg">{previewBill.finalBaki.amount}</td>
                  <td className="col-item text-left font-black text-base">
                    (BAKI) &nbsp;&nbsp;&nbsp;Final
                  </td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch font-black text-center text-sm">(BAKI)</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine  text-right font-black text-lg">{previewBill.finalBaki.fine}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>,
        document.body
      )}

      {/* PRINT-ONLY MEDIA STYLES */}
      <style>{`
        /* Screen only hide print elements */
        .print-only {
          display: none;
        }

        @media print {
          /* Hide all sibling elements of the print container under body */
          body > *:not(.print-invoice) {
            display: none !important;
          }
          
          /* Override body margins and styles for printer */
          body, html {
            background-color: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            font-family: Arial, sans-serif !important;
          }

          @page {
            size: auto;
            margin: 10mm;
          }

          .print-only {
            display: block !important;
          }

          /* Traditional slip layout structure */
          .print-container {
            width: 95% !important;
            max-width: 800px !important;
            margin: 15px auto !important;
            padding: 5px !important;
            background-color: #fff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-header {
            text-align: center;
            margin-bottom: 20px;
          }

          .traditional-hail {
            font-size: 14px !important;
            font-weight: bold !important;
            margin: 0 0 4px 0 !important;
            letter-spacing: 1px;
            font-family: inherit;
          }

          .traditional-title {
            font-size: 15px !important;
            font-weight: bold !important;
            margin: 0 !important;
            text-decoration: underline !important;
            letter-spacing: 1.5px;
            font-family: inherit;
          }

          .print-meta-grid {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important;
            font-size: 13px !important;
            padding: 0 4px !important;
          }

          .meta-client-name {
            font-size: 13px !important;
            font-weight: bold !important;
            letter-spacing: 0.5px;
          }

          /* Main Table Styling - Double lines, thin gridlines */
          .traditional-bill-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border-top: 2px solid #000 !important;
            border-bottom: 2px solid #000 !important;
            font-size: 12px !important;
          }

          .traditional-bill-table th {
            border: 1px solid #000 !important;
            font-weight: bold !important;
            padding: 6px 4px !important;
            font-size: 12px !important;
            text-align: inherit;
            background-color: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .traditional-bill-table td {
            border: 1px solid #000 !important;
            padding: 6px 6px !important;
            height: 22px;
          }

          /* Explicit Column widths */
          .col-amount { width: 10% !important; text-align: center !important; }
          .col-item { width: 30% !important; }
          .col-weight { width: 10% !important; text-align: center !important; }
          .col-panni { width: 15% !important; }
          .col-less { width: 8% !important; text-align: center !important; }
          .col-netwt { width: 10% !important; text-align: center !important; }
          .col-tunch { width: 8% !important; text-align: center !important; }
          .col-lab { width: 10% !important; text-align: center !important; }
          .col-fine { width: 10% !important; text-align: center !important; }

          /* Row Total Sale styling */
          .row-total-sale {
            border-top: 2px solid #000 !important;
            border-bottom: 1px solid #000 !important;
          }
          .row-total-sale td {
            font-weight: bold !important;
            background-color: #fff !important;
            border: 1px solid #000 !important;
          }

          /* Last Balance Row styling */
          .row-last-bal td {
            background-color: #fff !important;
            border: 1px solid #000 !important;
          }

          /* Inter Total Row styling */
          .row-inter-total td {
            font-weight: bold !important;
            border: 1px solid #000 !important;
          }

          /* Jama Detail Row styling */
          .row-jama-detail td {
            border: 1px solid #000 !important;
          }

          /* Baki Final Row styling (heavy highlight) */
          .row-baki-final {
            border-bottom: 2px solid #000 !important;
          }
          .row-baki-final td {
            font-weight: bold !important;
            border: 1px solid #000 !important;
            padding: 8px 6px !important;
          }
        }
      `}</style>
    </>
  );
};

export default BillPreview;
