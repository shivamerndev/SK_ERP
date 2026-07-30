import Billing from "../models/billing.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

const getKpiMetrics = async (range) => {
  let start = new Date();
  let end = new Date();
  let isPreset = false;

  const now = new Date();

  if (range && range.includes(" - ")) {
    try {
      const parts = range.split(" - ");
      start = new Date(parts[0]);
      end = new Date(parts[1]);
    } catch (e) {
      console.error("Error parsing custom range:", e);
      isPreset = true;
    }
  } else {
    isPreset = true;
  }

  if (isPreset) {
    const rangeLower = (range || "").toLowerCase();
    if (rangeLower.includes("last 30 days")) {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = now;
    } else if (rangeLower.includes("this quarter")) {
      const currentMonth = now.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      start = new Date(now.getFullYear(), quarterStartMonth, 1);
      end = now;
    } else if (rangeLower.includes("year to date")) {
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
    } else {
      // default fallback: try to parse range as a single month or default to last 30 days
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = now;
    }
  }

  // Set start of day and end of day
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const durationMs = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - durationMs);
  const prevEnd = new Date(start.getTime() - 1);

  // Fetch all bills in both periods
  const currentBills = await Billing.find({
    createdAt: { $gte: start, $lte: end }
  }).lean();

  const prevBills = await Billing.find({
    createdAt: { $gte: prevStart, $lte: prevEnd }
  }).lean();

  // Find latest silver rate in DB to use as fallback for rates of 0
  const lastBillWithRate = await Billing.findOne({ silverRate: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .lean();
  const latestSilverRate = lastBillWithRate ? lastBillWithRate.silverRate : 223600;

  // Revenue calculation helper
  const calculateRevenueForBills = (bills) => {
    return bills.reduce((acc, bill) => {
      const revenue = (bill.totals?.amount || 0);
      return acc + revenue;
    }, 0);
  };

  const currentRevenue = calculateRevenueForBills(currentBills);
  const prevRevenue = calculateRevenueForBills(prevBills);

  const currentOrders = currentBills.length;
  const prevOrders = prevBills.length;

  const currentCustomers = await Customer.countDocuments({
    createdAt: { $lte: end }
  });
  const prevCustomers = await Customer.countDocuments({
    createdAt: { $lte: start }
  });

  const currentPending = currentBills.filter(
    (b) => (b.finalBaki?.amount || 0) > 0 || (b.finalBaki?.fine || 0) > 0
  ).length;
  const prevPending = prevBills.filter(
    (b) => (b.finalBaki?.amount || 0) > 0 || (b.finalBaki?.fine || 0) > 0
  ).length;

  // Percentage growth helper
  const getPercentageString = (curr, prev) => {
    if (prev === 0) return curr > 0 ? "+100%" : "+0%";
    const diff = curr - prev;
    const percent = Math.round((diff / prev) * 100);
    return (percent >= 0 ? "+" : "") + percent + "%";
  };

  // Sparkline data generation (8 data points)
  const generateSparkline = (bills, getValForBill) => {
    const stepMs = durationMs / 8;
    const sparkline = [];

    for (let i = 0; i < 8; i++) {
      const bStart = start.getTime() + i * stepMs;
      const bEnd = start.getTime() + (i + 1) * stepMs;
      const bucketBills = bills.filter((b) => {
        const time = new Date(b.createdAt).getTime();
        return time >= bStart && time < bEnd;
      });

      const value = bucketBills.reduce((acc, b) => acc + getValForBill(b), 0);
      sparkline.push(value);
    }
    return sparkline;
  };

  // Revenue sparkline
  const revenueSparkline = generateSparkline(currentBills, (b) => {
    return (b.totals?.amount || 0);
  });

  // Orders sparkline
  const ordersSparkline = generateSparkline(currentBills, () => 1);

  // Customers sparkline
  const customerSparkline = [];
  const stepMs = durationMs / 8;
  for (let i = 0; i < 8; i++) {
    const bStart = new Date(start.getTime() + i * stepMs);
    const bEnd = new Date(start.getTime() + (i + 1) * stepMs);
    const count = await Customer.countDocuments({
      createdAt: { $gte: bStart, $lt: bEnd }
    });
    customerSparkline.push(count);
  }

  // Pending Invoices sparkline
  const pendingSparkline = generateSparkline(currentBills, (b) => {
    return ((b.finalBaki?.amount || 0) > 0 || (b.finalBaki?.fine || 0) > 0) ? 1 : 0;
  });

  return {
    revenue: {
      value: Math.round(currentRevenue),
      percentage: getPercentageString(currentRevenue, prevRevenue),
      subtext: "vs prev period",
      isPositive: currentRevenue >= prevRevenue,
      sparkline: revenueSparkline
    },
    orders: {
      value: currentOrders,
      percentage: getPercentageString(currentOrders, prevOrders),
      subtext: "vs prev period",
      isPositive: currentOrders >= prevOrders,
      sparkline: ordersSparkline
    },
    customers: {
      value: currentCustomers,
      percentage: getPercentageString(currentCustomers, prevCustomers),
      subtext: "vs prev period",
      isPositive: currentCustomers >= prevCustomers,
      sparkline: customerSparkline
    },
    pendingInvoices: {
      value: currentPending,
      percentage: getPercentageString(currentPending, prevPending),
      subtext: "vs prev period",
      isPositive: currentPending <= prevPending,
      sparkline: pendingSparkline
    }
  };
};

const getLowerGridMetrics = async (range) => {
  let start = new Date();
  let end = new Date();
  let isPreset = false;

  const now = new Date();

  if (range && range.includes(" - ")) {
    try {
      const parts = range.split(" - ");
      start = new Date(parts[0]);
      end = new Date(parts[1]);
    } catch (e) {
      console.error("Error parsing custom range:", e);
      isPreset = true;
    }
  } else {
    isPreset = true;
  }

  if (isPreset) {
    const rangeLower = (range || "").toLowerCase();
    if (rangeLower.includes("last 30 days")) {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = now;
    } else if (rangeLower.includes("this quarter")) {
      const currentMonth = now.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      start = new Date(now.getFullYear(), quarterStartMonth, 1);
      end = now;
    } else if (rangeLower.includes("year to date")) {
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
    } else {
      // default fallback: last 30 days
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = now;
    }
  }

  // Set start of day and end of day
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // 1. Inventory Summary (STOCKS_LIMIT = 10)
  const totalItems = await Product.countDocuments({});
  const inStock = await Product.countDocuments({ pieces: { $gt: 10 } });
  const lowStock = await Product.countDocuments({ pieces: { $gt: 0, $lte: 10 } });
  const outOfStock = await Product.countDocuments({ pieces: { $lte: 0 } });

  const inStockPercent = totalItems > 0 ? Number(((inStock / totalItems) * 100).toFixed(1)) : 0;
  const lowStockPercent = totalItems > 0 ? Number(((lowStock / totalItems) * 100).toFixed(1)) : 0;
  const outOfStockPercent = totalItems > 0 ? Number(((outOfStock / totalItems) * 100).toFixed(1)) : 0;

  // 2. Top Performed Product aggregation from Billing
  const topProductsRaw = await Billing.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end }
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.item",
        salesCount: { $sum: 1 },
        totalRevenue: { $sum: "$items.amount" }
      }
    },
    { $sort: { salesCount: -1 } },
    { $limit: 4 }
  ]);

  let topProducts = [];
  if (topProductsRaw.length > 0) {
    const maxSales = topProductsRaw[0].salesCount || 1;
    const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
    topProducts = topProductsRaw.map((p, idx) => ({
      name: p._id,
      progress: Math.round((p.salesCount / maxSales) * 100),
      color: colors[idx % colors.length]
    }));
  } else {
    // Fallback: Top products in inventory by stock pieces
    const topStockProducts = await Product.find({})
      .sort({ pieces: -1 })
      .limit(4)
      .lean();
    if (topStockProducts.length > 0) {
      const maxPieces = topStockProducts[0].pieces || 1;
      const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
      topProducts = topStockProducts.map((p, idx) => ({
        name: p.name,
        progress: Math.round((p.pieces / maxPieces) * 100),
        color: colors[idx % colors.length]
      }));
    }
  }

  return {
    inventorySummary: {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      inStockPercent,
      lowStockPercent,
      outOfStockPercent
    },
    topPerformedProducts: topProducts
  };
};

export default {
  getKpiMetrics,
  getLowerGridMetrics
};
