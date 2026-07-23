const O2D = () => {
	const orderLifecycle = [
		"New Order",
		"Verification",
		"PO Created",
		"Inventory Allocated",
		"Dispatch Pending",
		"Ready for Shipment",
		"In Transit",
		"Delivered",
		"Closed",
	];

	return (
		<div className="page-container flex flex-col gap-6 animate-fade-in">
			<header className="page-header">
				<h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">📦 Order to Delivery (O2D) Module</h1>
				<p className="text-slate-500 text-sm font-medium">End-to-end customer order fulfillment, inventory allocation, shipment tracking, and document verification.</p>
			</header>

			<section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
				<h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">Standard Order Lifecycle Flow</h2>
				<div className="flow-stepper flex items-center justify-between overflow-x-auto py-4 gap-4 scrollbar-none">
					{orderLifecycle.map((step, idx) => (
						<div key={idx} className={`flow-step flex flex-col items-center gap-2.5 min-w-[100px] relative ${idx <= 4 ? "completed" : idx === 5 ? "active" : ""}`}>
							<div className={`step-badge w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
								idx <= 4 
									? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
									: idx === 5 
									? "bg-blue-500 text-white ring-4 ring-blue-500/30 shadow-md shadow-blue-500/20" 
									: "bg-slate-100 text-slate-400 border border-slate-200"
							}`}>
								{idx + 1}
							</div>
							<span className={`step-name text-xs text-center transition-colors ${
								idx <= 5 ? "text-slate-800 font-bold" : "text-slate-400 font-medium"
							}`}>
								{step}
							</span>
						</div>
					))}
				</div>
			</section>

			<section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
				<h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">Active Orders Overview</h2>
				<div className="table-wrapper overflow-x-auto rounded-xl border border-slate-200/80">
					<table className="erp-table light-theme-table w-full text-left text-sm border-collapse">
						<thead>
							<tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider">
								<th className="p-3.5 px-4">Order ID</th>
								<th className="p-3.5 px-4">Customer</th>
								<th className="p-3.5 px-4">Items</th>
								<th className="p-3.5 px-4">Total Amount</th>
								<th className="p-3.5 px-4">Current Stage</th>
								<th className="p-3.5 px-4">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-slate-700">
							<tr className="hover:bg-slate-50/50 transition-colors">
								<td className="p-4 font-mono font-bold text-xs text-purple-600 bg-purple-50/30">#ORD-2026-901</td>
								<td className="p-4 font-semibold text-slate-800">TechSolutions Corp</td>
								<td className="p-4 font-medium">500 x Laptops</td>
								<td className="p-4 font-bold text-slate-900">₹32,50,000</td>
								<td className="p-4">
									<span className="stage-pill px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
										Ready for Shipment
									</span>
								</td>
								<td className="p-4">
									<button 
										onClick={() => alert("Tracking order #ORD-2026-901...")}
										className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:text-blue-700 transition-colors cursor-pointer"
									>
										Track Order
									</button>
								</td>
							</tr>
							<tr className="hover:bg-slate-50/50 transition-colors">
								<td className="p-4 font-mono font-bold text-xs text-purple-600 bg-purple-50/30">#ORD-2026-902</td>
								<td className="p-4 font-semibold text-slate-800">Apex Logistics Inc</td>
								<td className="p-4 font-medium">150 x Monitors</td>
								<td className="p-4 font-bold text-slate-900">₹18,00,000</td>
								<td className="p-4">
									<span className="stage-pill px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 animate-pulse">
										Inventory Allocated
									</span>
								</td>
								<td className="p-4">
									<button 
										onClick={() => alert("Processing Purchase Order for #ORD-2026-902...")}
										className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:text-blue-700 transition-colors cursor-pointer"
									>
										Process PO
									</button>
								</td>
							</tr>
							<tr className="hover:bg-slate-50/50 transition-colors">
								<td className="p-4 font-mono font-bold text-xs text-purple-600 bg-purple-50/30">#ORD-2026-903</td>
								<td className="p-4 font-semibold text-slate-800">Global Traders Ltd</td>
								<td className="p-4 font-medium">50 x Servers</td>
								<td className="p-4 font-bold text-slate-900">₹75,00,000</td>
								<td className="p-4">
									<span className="stage-pill px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
										Delivered
									</span>
								</td>
								<td className="p-4">
									<button 
										onClick={() => alert("Viewing delivery receipt for #ORD-2026-903...")}
										className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:text-slate-700 transition-colors cursor-pointer"
									>
										View Proof
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default O2D;
