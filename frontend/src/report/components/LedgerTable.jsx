
const LedgerTable = ({ selectedBill }) => {

    return (
        <div className="print-invoice print-only">
            <div className="print-container">
                {/* Header section */}
                <div className="print-header font-serif">
                    <p className="traditional-hail">{selectedBill.topHeader}</p>
                    <h1 className="traditional-title">{selectedBill.title}</h1>
                </div>

                {/* Meta client detail info row */}
                <div className="print-meta-grid">
                    <div className="meta-col-left font-sans font-bold">
                        <p>Bill No. &nbsp;<span className="">{selectedBill.billNo}</span></p>
                        <p className="meta-client-name mt-1">{selectedBill.customerName}</p>
                    </div>
                    <div className="meta-col-right text-right font-sans font-bold">
                        <p className="">{selectedBill.time}</p>
                        <p className=" mt-1">{selectedBill.date}</p>
                    </div>
                </div>

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
                        {selectedBill.items?.map((row, idx) => (
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
                        <tr className="row-total-sale">
                            <td className="col-amount  text-center font-bold">{selectedBill.totals?.amount || ""}</td>
                            <td className="col-item text-left font-black">TOTAL SALE</td>
                            <td className="col-weight  text-right font-bold">{selectedBill.totals?.weight}</td>
                            <td className="col-panni">&nbsp;</td>
                            <td className="col-less  text-right font-bold">{selectedBill.totals?.less || ""}</td>
                            <td className="col-netwt  text-right font-bold">{selectedBill.totals?.netWt}</td>
                            <td className="col-tunch">&nbsp;</td>
                            <td className="col-lab">&nbsp;</td>
                            <td className="col-fine  text-right font-bold">{selectedBill.totals?.fine}</td>
                        </tr>

                        {/* LAST BALANCE ROW */}
                        <tr className="row-last-bal">
                            <td className="col-amount  text-center font-bold">{selectedBill.lastBalance?.amount || ""}</td>
                            <td className="col-item text-left text-slate-500 font-bold">Last Bal. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className=" text-xs">{selectedBill.date}</span></td>
                            <td className="col-weight">&nbsp;</td>
                            <td className="col-panni">&nbsp;</td>
                            <td className="col-less">&nbsp;</td>
                            <td className="col-netwt">&nbsp;</td>
                            <td className="col-tunch">&nbsp;</td>
                            <td className="col-lab">&nbsp;</td>
                            <td className="col-fine  text-right font-bold">{selectedBill.lastBalance?.fine || "0"}</td>
                        </tr>

                        {/* TOTAL SALE + LAST BAL ROW */}
                        <tr className="row-inter-total">
                            <td className="col-amount  text-center font-bold">
                                {(selectedBill.totals?.amount || 0) + (selectedBill.lastBalance?.amount || 0) || ""}
                            </td>
                            <td className="col-item text-left font-black">Total</td>
                            <td className="col-weight">&nbsp;</td>
                            <td className="col-panni">&nbsp;</td>
                            <td className="col-less">&nbsp;</td>
                            <td className="col-netwt">&nbsp;</td>
                            <td className="col-tunch">&nbsp;</td>
                            <td className="col-lab">&nbsp;</td>
                            <td className="col-fine  text-right font-bold">
                                {(selectedBill.totals?.fine || 0) + (selectedBill.lastBalance?.fine || 0) || ""}
                            </td>
                        </tr>

                        {/* JAMA DETAIL ROW */}
                        <tr className="row-jama-detail">
                            <td className="col-amount  text-center font-bold">
                                {selectedBill.jamaDetail?.amount || ""}
                            </td>
                            <td className="col-item text-left text-slate-600 font-bold">
                                Jama Detail <br />
                                <span className="font-normal">{selectedBill.jamaDetail?.details || ""}</span>
                            </td>
                            <td className="col-weight  text-right">{selectedBill.jamaDetail?.weight || ""}</td>
                            <td className="col-panni">&nbsp;</td>
                            <td className="col-less">&nbsp;</td>
                            <td className="col-netwt  text-right">{selectedBill.jamaDetail?.netWt || ""}</td>
                            <td className="col-tunch  text-right">{selectedBill.jamaDetail?.tunch || ""}</td>
                            <td className="col-lab">&nbsp;</td>
                            <td className="col-fine  text-right font-bold">
                                {selectedBill.jamaDetail?.fine || ""}
                            </td>
                        </tr>

                        {/* BAKI FINAL ROW */}
                        <tr className="row-baki-final">
                            <td className="col-amount  text-center font-black text-lg">{selectedBill.finalBaki?.amount}</td>
                            <td className="col-item text-left font-black text-base">(BAKI) &nbsp;&nbsp;&nbsp;Final &nbsp;&nbsp;&nbsp;Total Kachhi - 1</td>
                            <td className="col-weight">&nbsp;</td>
                            <td className="col-panni">&nbsp;</td>
                            <td className="col-less">&nbsp;</td>
                            <td className="col-netwt">&nbsp;</td>
                            <td className="col-tunch font-black text-center text-sm">(BAKI)</td>
                            <td className="col-lab">&nbsp;</td>
                            <td className="col-fine  text-right font-black text-lg">{selectedBill.finalBaki?.fine}</td>
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    )
}

export default LedgerTable