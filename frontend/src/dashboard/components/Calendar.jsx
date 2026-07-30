import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  Clock, 
  AlertCircle,
  X
} from "lucide-react";

// Shaadi Muhurat Auspicious Dates for 2026 & 2027
const SHAADI_MUHURATS = {
  // 2026
  "2026-01-16": "Auspicious Wedding Muhurat",
  "2026-01-17": "Auspicious Wedding Muhurat",
  "2026-01-18": "Auspicious Wedding Muhurat",
  "2026-01-20": "Auspicious Wedding Muhurat",
  "2026-01-21": "Auspicious Wedding Muhurat",
  "2026-01-23": "Auspicious Wedding Muhurat",
  "2026-01-24": "Auspicious Wedding Muhurat",
  "2026-01-25": "Auspicious Wedding Muhurat",
  "2026-01-26": "Auspicious Wedding Muhurat",
  "2026-02-01": "Auspicious Wedding Muhurat",
  "2026-02-02": "Auspicious Wedding Muhurat",
  "2026-02-06": "Auspicious Wedding Muhurat",
  "2026-02-07": "Auspicious Wedding Muhurat",
  "2026-02-11": "Auspicious Wedding Muhurat",
  "2026-02-12": "Auspicious Wedding Muhurat",
  "2026-02-13": "Auspicious Wedding Muhurat",
  "2026-02-15": "Auspicious Wedding Muhurat",
  "2026-02-16": "Auspicious Wedding Muhurat",
  "2026-02-21": "Auspicious Wedding Muhurat",
  "2026-02-22": "Auspicious Wedding Muhurat",
  "2026-02-23": "Auspicious Wedding Muhurat",
  "2026-02-27": "Auspicious Wedding Muhurat",
  "2026-03-01": "Auspicious Wedding Muhurat",
  "2026-03-02": "Auspicious Wedding Muhurat",
  "2026-03-06": "Auspicious Wedding Muhurat",
  "2026-03-07": "Auspicious Wedding Muhurat",
  "2026-03-08": "Auspicious Wedding Muhurat",
  "2026-03-13": "Auspicious Wedding Muhurat",
  "2026-04-18": "Auspicious Wedding Muhurat",
  "2026-04-19": "Auspicious Wedding Muhurat",
  "2026-04-20": "Auspicious Wedding Muhurat",
  "2026-04-21": "Auspicious Wedding Muhurat",
  "2026-04-22": "Auspicious Wedding Muhurat",
  "2026-04-24": "Auspicious Wedding Muhurat",
  "2026-04-25": "Auspicious Wedding Muhurat",
  "2026-04-29": "Auspicious Wedding Muhurat",
  "2026-04-30": "Auspicious Wedding Muhurat",
  "2026-05-01": "Auspicious Wedding Muhurat",
  "2026-05-03": "Auspicious Wedding Muhurat",
  "2026-05-05": "Auspicious Wedding Muhurat",
  "2026-05-08": "Auspicious Wedding Muhurat",
  "2026-05-09": "Auspicious Wedding Muhurat",
  "2026-05-10": "Auspicious Wedding Muhurat",
  "2026-05-11": "Auspicious Wedding Muhurat",
  "2026-05-13": "Auspicious Wedding Muhurat",
  "2026-05-14": "Auspicious Wedding Muhurat",
  "2026-05-15": "Auspicious Wedding Muhurat",
  "2026-05-23": "Auspicious Wedding Muhurat",
  "2026-05-24": "Auspicious Wedding Muhurat",
  "2026-05-25": "Auspicious Wedding Muhurat",
  "2026-05-26": "Auspicious Wedding Muhurat",
  "2026-05-27": "Auspicious Wedding Muhurat",
  "2026-05-28": "Auspicious Wedding Muhurat",
  "2026-06-02": "Auspicious Wedding Muhurat",
  "2026-06-03": "Auspicious Wedding Muhurat",
  "2026-06-04": "Auspicious Wedding Muhurat",
  "2026-06-07": "Auspicious Wedding Muhurat",
  "2026-06-08": "Auspicious Wedding Muhurat",
  "2026-06-12": "Auspicious Wedding Muhurat",
  "2026-06-14": "Auspicious Wedding Muhurat",
  "2026-06-18": "Auspicious Wedding Muhurat",
  "2026-06-21": "Auspicious Wedding Muhurat",
  "2026-06-22": "Auspicious Wedding Muhurat",
  "2026-06-23": "Auspicious Wedding Muhurat",
  "2026-06-24": "Auspicious Wedding Muhurat",
  "2026-06-26": "Auspicious Wedding Muhurat",
  "2026-06-27": "Auspicious Wedding Muhurat",
  "2026-07-02": "Auspicious Wedding Muhurat",
  "2026-07-03": "Auspicious Wedding Muhurat",
  "2026-07-05": "Auspicious Wedding Muhurat",
  "2026-07-06": "Auspicious Wedding Muhurat",
  "2026-07-07": "Auspicious Wedding Muhurat",
  "2026-07-10": "Auspicious Wedding Muhurat",
  "2026-07-11": "Auspicious Wedding Muhurat",
  "2026-11-16": "Auspicious Wedding Muhurat",
  "2026-11-17": "Auspicious Wedding Muhurat",
  "2026-11-22": "Auspicious Wedding Muhurat",
  "2026-11-23": "Auspicious Wedding Muhurat",
  "2026-11-24": "Auspicious Wedding Muhurat",
  "2026-11-25": "Auspicious Wedding Muhurat",
  "2026-11-26": "Auspicious Wedding Muhurat",
  "2026-11-27": "Auspicious Wedding Muhurat",
  "2026-11-28": "Auspicious Wedding Muhurat",
  "2026-11-29": "Auspicious Wedding Muhurat",
  "2026-11-30": "Auspicious Wedding Muhurat",
  "2026-12-04": "Auspicious Wedding Muhurat",
  "2026-12-05": "Auspicious Wedding Muhurat",
  "2026-12-06": "Auspicious Wedding Muhurat",
  "2026-12-07": "Auspicious Wedding Muhurat",
  "2026-12-11": "Auspicious Wedding Muhurat",
  "2026-12-13": "Auspicious Wedding Muhurat",
  "2026-12-14": "Auspicious Wedding Muhurat",
  "2026-12-18": "Auspicious Wedding Muhurat",
  "2026-12-19": "Auspicious Wedding Muhurat",
  "2026-12-20": "Auspicious Wedding Muhurat",
  "2026-12-24": "Auspicious Wedding Muhurat",
  "2026-12-25": "Auspicious Wedding Muhurat",

  // 2027
  "2027-01-15": "Auspicious Wedding Muhurat",
  "2027-01-16": "Auspicious Wedding Muhurat",
  "2027-01-17": "Auspicious Wedding Muhurat",
  "2027-01-18": "Auspicious Wedding Muhurat",
  "2027-01-21": "Auspicious Wedding Muhurat",
  "2027-01-22": "Auspicious Wedding Muhurat",
  "2027-01-23": "Auspicious Wedding Muhurat",
  "2027-01-24": "Auspicious Wedding Muhurat",
  "2027-01-27": "Auspicious Wedding Muhurat",
  "2027-02-03": "Auspicious Wedding Muhurat",
  "2027-02-04": "Auspicious Wedding Muhurat",
  "2027-02-05": "Auspicious Wedding Muhurat",
  "2027-02-10": "Auspicious Wedding Muhurat",
  "2027-02-11": "Auspicious Wedding Muhurat",
  "2027-02-12": "Auspicious Wedding Muhurat",
  "2027-02-13": "Auspicious Wedding Muhurat",
  "2027-02-14": "Auspicious Wedding Muhurat",
  "2027-02-15": "Auspicious Wedding Muhurat",
  "2027-02-19": "Auspicious Wedding Muhurat",
  "2027-02-20": "Auspicious Wedding Muhurat",
  "2027-02-21": "Auspicious Wedding Muhurat",
  "2027-03-01": "Auspicious Wedding Muhurat",
  "2027-03-02": "Auspicious Wedding Muhurat",
  "2027-03-03": "Auspicious Wedding Muhurat",
  "2027-03-06": "Auspicious Wedding Muhurat",
  "2027-03-07": "Auspicious Wedding Muhurat",
  "2027-03-08": "Auspicious Wedding Muhurat",
  "2027-03-12": "Auspicious Wedding Muhurat",
  "2027-04-18": "Auspicious Wedding Muhurat",
  "2027-04-21": "Auspicious Wedding Muhurat",
  "2027-04-22": "Auspicious Wedding Muhurat",
  "2027-04-23": "Auspicious Wedding Muhurat",
  "2027-04-25": "Auspicious Wedding Muhurat",
  "2027-04-26": "Auspicious Wedding Muhurat",
  "2027-04-28": "Auspicious Wedding Muhurat",
  "2027-04-29": "Auspicious Wedding Muhurat",
  "2027-04-30": "Auspicious Wedding Muhurat",
  "2027-05-02": "Auspicious Wedding Muhurat",
  "2027-05-04": "Auspicious Wedding Muhurat",
  "2027-05-05": "Auspicious Wedding Muhurat",
  "2027-05-06": "Auspicious Wedding Muhurat",
  "2027-05-07": "Auspicious Wedding Muhurat",
  "2027-05-08": "Auspicious Wedding Muhurat",
  "2027-05-09": "Auspicious Wedding Muhurat",
  "2027-05-12": "Auspicious Wedding Muhurat",
  "2027-05-13": "Auspicious Wedding Muhurat",
  "2027-05-14": "Auspicious Wedding Muhurat",
  "2027-05-20": "Auspicious Wedding Muhurat",
  "2027-05-21": "Auspicious Wedding Muhurat",
  "2027-05-22": "Auspicious Wedding Muhurat",
  "2027-05-25": "Auspicious Wedding Muhurat",
  "2027-05-26": "Auspicious Wedding Muhurat",
  "2027-05-27": "Auspicious Wedding Muhurat",
  "2027-06-01": "Auspicious Wedding Muhurat",
  "2027-06-02": "Auspicious Wedding Muhurat",
  "2027-06-03": "Auspicious Wedding Muhurat",
  "2027-06-06": "Auspicious Wedding Muhurat",
  "2027-06-07": "Auspicious Wedding Muhurat",
  "2027-06-11": "Auspicious Wedding Muhurat",
  "2027-06-13": "Auspicious Wedding Muhurat",
  "2027-06-17": "Auspicious Wedding Muhurat",
  "2027-06-20": "Auspicious Wedding Muhurat",
  "2027-06-21": "Auspicious Wedding Muhurat",
  "2027-06-22": "Auspicious Wedding Muhurat",
  "2027-06-23": "Auspicious Wedding Muhurat",
  "2027-06-25": "Auspicious Wedding Muhurat",
  "2027-06-26": "Auspicious Wedding Muhurat",
  "2027-07-01": "Auspicious Wedding Muhurat",
  "2027-07-02": "Auspicious Wedding Muhurat",
  "2027-07-03": "Auspicious Wedding Muhurat",
  "2027-07-06": "Auspicious Wedding Muhurat",
  "2027-07-07": "Auspicious Wedding Muhurat",
  "2027-07-09": "Auspicious Wedding Muhurat",
  "2027-07-10": "Auspicious Wedding Muhurat",
  "2027-11-18": "Auspicious Wedding Muhurat",
  "2027-11-19": "Auspicious Wedding Muhurat",
  "2027-11-20": "Auspicious Wedding Muhurat",
  "2027-11-21": "Auspicious Wedding Muhurat",
  "2027-11-22": "Auspicious Wedding Muhurat",
  "2027-11-23": "Auspicious Wedding Muhurat",
  "2027-11-24": "Auspicious Wedding Muhurat",
  "2027-11-25": "Auspicious Wedding Muhurat",
  "2027-11-28": "Auspicious Wedding Muhurat",
  "2027-11-29": "Auspicious Wedding Muhurat",
  "2027-11-30": "Auspicious Wedding Muhurat",
  "2027-12-01": "Auspicious Wedding Muhurat",
  "2027-12-03": "Auspicious Wedding Muhurat",
  "2027-12-04": "Auspicious Wedding Muhurat",
  "2027-12-05": "Auspicious Wedding Muhurat",
  "2027-12-09": "Auspicious Wedding Muhurat",
  "2027-12-10": "Auspicious Wedding Muhurat",
  "2027-12-11": "Auspicious Wedding Muhurat",
  "2027-12-12": "Auspicious Wedding Muhurat",
  "2027-12-16": "Auspicious Wedding Muhurat",
  "2027-12-17": "Auspicious Wedding Muhurat",
  "2027-12-18": "Auspicious Wedding Muhurat",
  "2027-12-21": "Auspicious Wedding Muhurat",
  "2027-12-22": "Auspicious Wedding Muhurat"
};

// Major Hindu Festivals with their Gold/Business implications
const HINDU_FESTIVALS = {
  // 2026
  "2026-02-15": { name: "Maha Shivratri", type: "festival", desc: "Auspicious festival of Lord Shiva. Traditional day for gifting and gold ornaments." },
  "2026-03-03": { name: "Holi", type: "festival", desc: "Festival of Colors. Marks the beginning of Spring sales." },
  "2026-03-19": { name: "Gudi Padwa / Ugadi", type: "gold_peak", desc: "Deccan New Year. Highly auspicious for purchasing gold & jewelry! Expected heavy showroom footfall." },
  "2026-03-27": { name: "Rama Navami", type: "festival", desc: "Celebration of Lord Rama's birth. Auspicious day for booking jewelry designs." },
  "2026-04-19": { name: "Akshaya Tritiya", type: "gold_peak", desc: "One of the most auspicious days in the year for buying gold. High volume retail sales expected!" },
  "2026-08-28": { name: "Raksha Bandhan", type: "festival", desc: "Festival of sibling bonds. Very high demand for silver chains, bracelets, and lightweight gift items." },
  "2026-09-04": { name: "Janmashtami", type: "festival", desc: "Lord Krishna's birth anniversary. Festive shopping peak." },
  "2026-09-14": { name: "Ganesh Chaturthi", type: "festival", desc: "Lord Ganesha's homecoming. Extremely auspicious for new jewelry orders." },
  "2026-10-20": { name: "Dussehra / Vijayadashami", type: "gold_peak", desc: "Celebration of victory. Highly auspicious for gold purchases and starting wedding contracts." },
  "2026-10-28": { name: "Karwa Chauth", type: "festival", desc: "Married women buy new ornaments. High demand for Mangalsutras, gold rings, and bangles." },
  "2026-11-06": { name: "Dhanteras", type: "gold_peak", desc: "Year's absolute peak gold buying day! Maximum volume of bullion, coins, and bridal bookings." },
  "2026-11-08": { name: "Diwali", type: "gold_peak", desc: "Festival of Lights. Massive peak for gift jewelry, coins, and luxury bridal jewelry purchases." },
  "2026-11-10": { name: "Bhai Dooj", type: "festival", desc: "Sisters and brothers gift ornaments. Lightweight jewelry items in high demand." },

  // 2027
  "2027-03-06": { name: "Maha Shivratri", type: "festival", desc: "Lord Shiva festival. Auspicious gifting period." },
  "2027-03-22": { name: "Holi", type: "festival", desc: "Festival of Colors." },
  "2027-04-07": { name: "Gudi Padwa / Ugadi", type: "gold_peak", desc: "New Year. Highly auspicious for gold purchase." },
  "2027-04-15": { name: "Rama Navami", type: "festival", desc: "Auspicious day for ornaments booking." },
  "2027-05-09": { name: "Akshaya Tritiya", type: "gold_peak", desc: "Peak Gold Buying Day. Prepare heavy bridal stock!" },
  "2027-08-17": { name: "Raksha Bandhan", type: "festival", desc: "High demand for silver gifts and bands." },
  "2027-08-25": { name: "Janmashtami", type: "festival", desc: "Lord Krishna's birth celebration." },
  "2027-09-04": { name: "Ganesh Chaturthi", type: "festival", desc: "Ganesha festival. Very auspicious for custom orders." },
  "2027-10-09": { name: "Dussehra", type: "gold_peak", desc: "Auspicious day for purchasing gold and starting contracts." },
  "2027-10-18": { name: "Karwa Chauth", type: "festival", desc: "High sales of bridal items and rings." },
  "2027-10-27": { name: "Dhanteras", type: "gold_peak", desc: "Year's biggest sales event! Keep showroom stocked with gold coins." },
  "2027-10-29": { name: "Diwali", type: "gold_peak", desc: "Festival of Lights. Peak retail and gifting period." },
  "2027-10-31": { name: "Bhai Dooj", type: "festival", desc: "Gifting and lightweight jewelry sales." }
};

// Initialized preloaded events for realistic business visualization
const PRELOADED_EVENTS = {
  "2026-07-11": [{ id: "p1", type: "general", text: "Wedding season review & vendor payments audit" }],
  "2026-07-15": [{ id: "p2", type: "restock", text: "Restock basic 22K chains and daily wear rings" }],
  "2026-07-22": [{ id: "p3", type: "staff", text: "Staff briefing on custom order delivery deadlines" }],
  "2026-11-16": [{ id: "p4", type: "delivery", text: "Deliver Heavy Gold Bridal Choker (Verma family, 85 grams)" }],
  "2026-11-23": [{ id: "p5", type: "restock", text: "Procure Kundan & Polki sets from Rajasthan karigars" }],
  "2026-12-05": [{ id: "p6", type: "delivery", text: "Deliver Antique Temple Gold Set (Sharma Wedding, 120 grams)" }],
  "2026-12-14": [{ id: "p7", type: "restock", text: "Bulk raw gold sourcing trip - Mumbai Zaveri Bazar" }]
};

const Calendar = () => {
  // Calendar Navigation States (Defaults to current app state - July 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 6 = July (0-indexed)
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-30"); // Defaults to today
  
  // Custom Events State (Loads from localStorage or fallback to preloaded)
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("shop_calendar_events");
    return saved ? JSON.parse(saved) : PRELOADED_EVENTS;
  });

  // Checklist Preparedness State (for Peak Months)
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("shop_calendar_checklist");
    return saved ? JSON.parse(saved) : {};
  });

  // Interactive Form States
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventType, setEventType] = useState("delivery");
  const [activeTab, setActiveTab] = useState("events"); // 'events' or 'prep'

  // Persist events to localStorage
  useEffect(() => {
    localStorage.setItem("shop_calendar_events", JSON.stringify(events));
  }, [events]);

  // Persist checklists to localStorage
  useEffect(() => {
    localStorage.setItem("shop_calendar_checklist", JSON.stringify(checklist));
  }, [checklist]);

  // Generate Year Array (2025 to 2027)
  const years = [2025, 2026, 2027];
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Check if active month is a peak wedding / festival month in India
  // Nov, Dec, Jan, Feb, May, June are typical wedding season peaks.
  // Also any month containing Akshaya Tritiya (April/May) or Diwali (Oct/Nov).
  const isPeakMonth = [0, 1, 4, 5, 10, 11].includes(currentMonth);

  // Month date computations
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => Math.max(2025, prev - 1));
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => Math.min(2027, prev + 1));
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Build grid days
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  // Pad dates
  const calendarCells = [];
  
  // Previous month padding cells
  for (let i = startDay - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({ day: dayNum, dateStr, isCurrentMonth: false, year: prevYear, month: prevMonthIndex });
  }

  // Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ day: i, dateStr, isCurrentMonth: true, year: currentYear, month: currentMonth });
  }

  // Next month padding cells
  const totalCellsNeeded = Math.ceil(calendarCells.length / 7) * 7;
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  let nextDayCounter = 1;
  while (calendarCells.length < totalCellsNeeded) {
    const dateStr = `${nextYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(nextDayCounter).padStart(2, '0')}`;
    calendarCells.push({ 
      day: nextDayCounter, 
      dateStr, 
      isCurrentMonth: false, 
      year: nextYear, 
      month: nextMonthIndex 
    });
    nextDayCounter++;
  }

  // Calculate count of Muhurats and festivals in current month
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const totalMuhuratsInMonth = Object.keys(SHAADI_MUHURATS).filter(d => d.startsWith(currentMonthPrefix)).length;
  const totalFestivalsInMonth = Object.keys(HINDU_FESTIVALS).filter(d => d.startsWith(currentMonthPrefix)).length;

  // Add Custom Event
  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!eventText.trim()) return;

    const newEvent = {
      id: Date.now().toString(),
      type: eventType,
      text: eventText.trim()
    };

    setEvents(prev => ({
      ...prev,
      [selectedDateStr]: [...(prev[selectedDateStr] || []), newEvent]
    }));

    setEventText("");
    setShowAddEvent(false);
  };

  // Delete Custom Event
  const handleDeleteEvent = (id) => {
    setEvents(prev => {
      const dayEvents = prev[selectedDateStr] || [];
      const updated = dayEvents.filter(ev => ev.id !== id);
      const copy = { ...prev };
      if (updated.length === 0) {
        delete copy[selectedDateStr];
      } else {
        copy[selectedDateStr] = updated;
      }
      return copy;
    });
  };

  // Standard Wedding Season Prep Tasks
  const prepTasks = [
    { key: "stock", label: "Verify heavy bridal necklaces, bangles & sets inventory levels" },
    { key: "staff", label: "Schedule extra showroom helpers & sales executives for peak hours" },
    { key: "hedging", label: "Verify gold/silver advance order price locks to mitigate rate volatility" },
    { key: "karigar", label: "Cross-check custom handmade ornaments delivery deadlines with craftsmen (karigars)" },
    { key: "promo", label: "Activate wedding season promotional displays, offers, and gift boxes" }
  ];

  // Month-specific checklist key
  const monthlyChecklistKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthChecklistState = checklist[monthlyChecklistKey] || { stock: false, staff: false, hedging: false, karigar: false, promo: false };

  const handleToggleChecklist = (taskKey) => {
    setChecklist(prev => ({
      ...prev,
      [monthlyChecklistKey]: {
        ...monthChecklistState,
        [taskKey]: !monthChecklistState[taskKey]
      }
    }));
  };

  const completedPrepCount = Object.values(monthChecklistState).filter(Boolean).length;
  const prepProgressPercent = Math.round((completedPrepCount / prepTasks.length) * 100);

  // Selected date information
  const selectedDateObj = new Date(selectedDateStr);
  const selectedDayLabel = selectedDateObj.toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const selectedDayMuhurat = SHAADI_MUHURATS[selectedDateStr];
  const selectedDayFestival = HINDU_FESTIVALS[selectedDateStr];
  const selectedDayEvents = events[selectedDateStr] || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-5 flex flex-col justify-between shadow-sm min-h-[500px]">
      
      {/* Calendar Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200">
              <CalendarIcon className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                Muhurat & Shop Calendar
              </h2>
              <p className="text-[10px] font-semibold text-slate-400">Track auspicious buying peaks</p>
            </div>
          </div>

          {/* Month / Year Selectors */}
          <div className="flex items-center gap-1.5">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-amber-500"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-amber-500"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            
            {/* Nav Arrows */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden ml-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
                title="Prev Month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1 bg-white border-l border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Peak Season / Festival Month Alert Banner */}
        {isPeakMonth && (
          <div className="mb-3.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="leading-tight">
              <span className="text-[11px] font-extrabold text-amber-800">
                Peak Wedding Season Month ({months[currentMonth]})!
              </span>
              <p className="text-[9px] font-semibold text-slate-600 mt-0.5">
                {totalMuhuratsInMonth} Muhurat wedding dates & {totalFestivalsInMonth} Hindu festivals expected. Maintain bridal sets stock and gold coins inventory!
              </p>
            </div>
          </div>
        )}

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1.5 pb-1 border-b border-slate-100">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarCells.map((cell, idx) => {
            const { day, dateStr, isCurrentMonth, year, month } = cell;
            const hasMuhurat = SHAADI_MUHURATS[dateStr];
            const festival = HINDU_FESTIVALS[dateStr];
            const isSelected = selectedDateStr === dateStr;
            const dayEvents = events[dateStr] || [];
            
            // Check if today (Jul 30, 2026)
            const isToday = dateStr === "2026-07-30";

            let cellClass = "relative flex flex-col items-center justify-between rounded-xl h-11 py-1.5 cursor-pointer transition-all border text-xs ";
            
            if (isSelected) {
              cellClass += "bg-slate-900 border-slate-900 text-white shadow font-bold";
            } else if (hasMuhurat && isCurrentMonth) {
              // Wedding Gold Theme
              cellClass += "bg-gradient-to-br from-amber-50 to-orange-100/60 border-amber-300 text-amber-900 font-extrabold hover:from-amber-100 hover:to-orange-200/80";
            } else if (festival && isCurrentMonth) {
              // Festive Red Theme
              cellClass += "bg-red-50/60 border-red-200 text-red-800 font-extrabold hover:bg-red-100/70";
            } else if (isCurrentMonth) {
              cellClass += "bg-white border-transparent hover:bg-slate-100/80 text-slate-700 font-semibold";
            } else {
              cellClass += "bg-slate-50/30 border-transparent text-slate-300 pointer-events-none";
            }

            if (isToday && !isSelected) {
              cellClass += " ring-2 ring-blue-500 ring-offset-1";
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDateStr(dateStr);
                  // Auto-switch to next month/prev month if clicked padding day
                  if (year !== currentYear || month !== currentMonth) {
                    setCurrentYear(year);
                    setCurrentMonth(month);
                  }
                }}
                className={cellClass}
              >
                {/* Day Number */}
                <span className="text-[10px]">{day}</span>

                {/* Icons & Badges */}
                <div className="flex gap-0.5 justify-center items-center h-2">
                  {hasMuhurat && !isSelected && (
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" title="Shaadi Muhurat" />
                  )}
                  {festival && !isSelected && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" title={festival.name} />
                  )}
                  {/* Event Dots */}
                  {dayEvents.slice(0, 3).map((ev, eIdx) => {
                    let dotColor = "bg-slate-400";
                    if (ev.type === "delivery") dotColor = "bg-blue-500";
                    if (ev.type === "restock") dotColor = "bg-emerald-500";
                    if (ev.type === "staff") dotColor = "bg-purple-500";
                    return (
                      <span 
                        key={eIdx} 
                        className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : dotColor}`} 
                      />
                    );
                  })}
                </div>

                {/* Festival Small Indicator */}
                {festival && isCurrentMonth && !isSelected && (
                  <span className="absolute -top-1 -right-0.5 text-[7px] leading-none" title={festival.name}>🪔</span>
                )}
                {/* Muhurat Small Indicator */}
                {hasMuhurat && isCurrentMonth && !isSelected && (
                  <span className="absolute -top-1 -right-0.5 text-[7px] leading-none" title="Wedding Day">💍</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs / Bottom Info Section */}
      <div className="mt-4 border-t border-slate-100 pt-3.5 flex-1 flex flex-col justify-between">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 pb-2 mb-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab("events"); setShowAddEvent(false); }}
            className={`flex-1 pb-1.5 text-center cursor-pointer transition-colors border-b-2 ${
              activeTab === "events" 
                ? "border-amber-500 text-amber-600" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Day Schedule & Events ({selectedDayEvents.length + (selectedDayMuhurat ? 1 : 0) + (selectedDayFestival ? 1 : 0)})
          </button>
          <button
            onClick={() => { setActiveTab("prep"); setShowAddEvent(false); }}
            className={`flex-1 pb-1.5 text-center cursor-pointer transition-colors border-b-2 flex items-center justify-center gap-1 ${
              activeTab === "prep" 
                ? "border-amber-500 text-amber-600" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Wedding Prep checklist
            {isPeakMonth && <span className="px-1.5 py-0.5 text-[8px] bg-amber-500 text-white rounded-full leading-none">Peak</span>}
          </button>
        </div>

        {/* Tab content: Day Details & Events */}
        {activeTab === "events" && (
          <div className="flex-1 flex flex-col justify-between min-h-[160px]">
            
            {/* Event List */}
            <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1">
              <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">
                {selectedDayLabel}
              </span>

              {/* pre-filled/special markers */}
              {selectedDayMuhurat && (
                <div className="flex items-center gap-2 p-2 bg-amber-50/70 border border-amber-200 rounded-xl leading-tight">
                  <span className="text-xs leading-none">💍</span>
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold text-amber-800">Wedding Season Peak Day</span>
                    <p className="text-[9px] font-semibold text-slate-600">{selectedDayMuhurat}</p>
                  </div>
                </div>
              )}

              {selectedDayFestival && (
                <div className="flex items-center gap-2 p-2 bg-red-50/70 border border-red-200 rounded-xl leading-tight">
                  <span className="text-xs leading-none">🪔</span>
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold text-red-800">Hindu Festival: {selectedDayFestival.name}</span>
                    <p className="text-[9px] font-semibold text-slate-600">{selectedDayFestival.desc}</p>
                  </div>
                </div>
              )}

              {/* Custom events */}
              {selectedDayEvents.map((ev) => {
                let badgeStyle = "bg-slate-50 border-slate-200 text-slate-700";
                let emoji = "📝";
                if (ev.type === "delivery") {
                  badgeStyle = "bg-blue-50/70 border-blue-100 text-blue-700";
                  emoji = "👰";
                } else if (ev.type === "restock") {
                  badgeStyle = "bg-emerald-50/70 border-emerald-100 text-emerald-700";
                  emoji = "🪙";
                } else if (ev.type === "staff") {
                  badgeStyle = "bg-purple-50/70 border-purple-100 text-purple-700";
                  emoji = "👥";
                }

                return (
                  <div 
                    key={ev.id} 
                    className={`flex items-center justify-between p-2 border rounded-xl text-[10px] font-semibold leading-tight ${badgeStyle}`}
                  >
                    <div className="flex items-center gap-1.5 flex-1 pr-2">
                      <span className="text-xs">{emoji}</span>
                      <span className="break-all">{ev.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1 hover:bg-black/5 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {!selectedDayMuhurat && !selectedDayFestival && selectedDayEvents.length === 0 && (
                <div className="text-[10px] text-slate-400 font-semibold italic text-center py-6">
                  No shop schedules or auspicious events on this day.
                </div>
              )}
            </div>

            {/* Event Form Slider */}
            {showAddEvent ? (
              <form onSubmit={handleAddEventSubmit} className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 animate-fade-in">
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200/60">
                  <span className="text-[10px] font-extrabold text-slate-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Event
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddEvent(false)} 
                    className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                      Event Type
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { type: "delivery", label: "Delivery", bg: "peer-checked:bg-blue-500 peer-checked:text-white" },
                        { type: "restock", label: "Restock", bg: "peer-checked:bg-emerald-500 peer-checked:text-white" },
                        { type: "staff", label: "Staff", bg: "peer-checked:bg-purple-500 peer-checked:text-white" },
                        { type: "general", label: "Note", bg: "peer-checked:bg-slate-500 peer-checked:text-white" }
                      ].map((item) => (
                        <label key={item.type} className="cursor-pointer text-center">
                          <input 
                            type="radio" 
                            name="evType" 
                            checked={eventType === item.type}
                            onChange={() => setEventType(item.type)}
                            className="sr-only peer" 
                          />
                          <div className={`py-1 border border-slate-200 bg-white rounded-lg text-[9px] font-bold text-slate-500 transition-all ${item.bg}`}>
                            {item.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={eventText}
                      onChange={(e) => setEventText(e.target.value)}
                      placeholder="e.g. Deliver gold necklace to Verma Family"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                      maxLength={100}
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEvent(false)}
                      className="flex-1 py-1.5 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      Save Event
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddEvent(true)}
                className="mt-3 w-full py-2 bg-slate-50 hover:bg-slate-100/80 text-slate-600 hover:text-slate-800 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                Add Schedule / Custom Shop Event
              </button>
            )}

          </div>
        )}

        {/* Tab content: Wedding Prep checklist */}
        {activeTab === "prep" && (
          <div className="flex-1 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                <span>Showroom Readiness Score</span>
                <span className="text-amber-600 font-extrabold">{prepProgressPercent}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${prepProgressPercent}%` }}
                />
              </div>

              {/* Checklist items */}
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                {prepTasks.map((task) => {
                  const isChecked = monthChecklistState[task.key];
                  return (
                    <label 
                      key={task.key}
                      className="flex items-start gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors"
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleChecklist(task.key)}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-100 mt-0.5"
                      />
                      <span className={`text-[9px] font-semibold leading-tight ${isChecked ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {task.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 p-2 bg-amber-50/50 border border-amber-200/50 rounded-xl flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[8px] font-medium text-amber-800 leading-tight">
                <strong>Owner's Tip:</strong> Standardize these checks 30 days before Dhanteras and Akshaya Tritiya to secure craftsman capacity and raw gold hedges at bulk rates.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Calendar;