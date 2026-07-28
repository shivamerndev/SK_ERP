import React, { useState, useEffect, useRef } from "react";
import { User, Search, Phone, MapPin, Calendar, Clock } from "lucide-react";
import useBilling from "../useBilling";

const InvoiceInfoForm = () => {
  const {
    topHeader,
    setTopHeader,
    billTitle,
    setBillTitle,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    setSelectedCustomerId,
    billNo,
    setBillNo,
    date,
    setDate,
    time,
    setTime,
    filteredCustomers,
    handleSelectCustomer
  } = useBilling();

  const [custSearchFocused, setCustSearchFocused] = useState(false);
  const custDropdownRef = useRef(null);

  // Click outside listener for customer autocompletion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (custDropdownRef.current && !custDropdownRef.current.contains(e.target)) {
        setCustSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-3">
        <User className="w-5 h-5" />
        <h3 className="font-bold text-slate-800">Invoice Information</h3>
      </div>

      {/* Estimate Templates Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Top Banner Hindi Text</label>
          <input
            type="text"
            name="topHeader"
            value={topHeader}
            onChange={(e) => setTopHeader(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Invoice Document Title</label>
          <input
            type="text"
            name="billTitle"
            value={billTitle}
            onChange={(e) => setBillTitle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
          />
        </div>
      </div>

      {/* Main Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Autocomplete Input */}
        <div className="relative" ref={custDropdownRef}>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Customer Name *</label>
          <div className="relative">
            <input
              type="text"
              name="customerName"
              placeholder="Search / Add Customer"
              value={customerName}
              onFocus={() => setCustSearchFocused(true)}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setSelectedCustomerId(""); // clear ID if user typed fresh
              }}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>

          {custSearchFocused && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-56 overflow-y-auto z-40 animate-fade-in">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <button
                    key={c._id || c.id}
                    type="button"
                    onClick={() => {
                      handleSelectCustomer(c);
                      setCustSearchFocused(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 flex justify-between items-center transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{c.name || c.fullName}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{c.phone || "No phone"}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Saved</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500 text-sm text-center">
                  No matching customer. Will save as guest/new contact.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Phone & Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
          <div className="relative">
            <input
              type="text"
              name="customerPhone"
              placeholder="e.g. 91995 XXXXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
            />
            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Address / Region</label>
          <div className="relative">
            <input
              type="text"
              name="customerAddress"
              placeholder="e.g. Jamui"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Bill details */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Bill Number</label>
          <input
            type="text"
            name="billNo"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-bold font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Date</label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
            />
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Time</label>
          <div className="relative">
            <input
              type="text"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
            />
            <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfoForm;
