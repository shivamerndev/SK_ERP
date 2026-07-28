import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import dashboardService from "../services/dashboard.service.js";
import { METAL_RATE_API } from "../config/env.config.js";

// Cache object for metal rates
let ratesCache = {
  data: null,
  timestamp: 0
};

const getKpis = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const metrics = await dashboardService.getKpiMetrics(range);
  return res.success(200, "KPI Metrics Fetched Successfully", metrics);
});

const getMetalRates = asyncHandler(async (req, res) => {
  const now = Date.now();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // If cache is fresh, return it
  if (ratesCache.data && (now - ratesCache.timestamp) < CACHE_DURATION) {
    return res.success(200, "Metal Rates Fetched Successfully (Cached)", ratesCache.data);
  }

  try {
    const headers = {
      "x-access-token": METAL_RATE_API,
      "Content-Type": "application/json"
    };

    const [goldUsdRes, goldInrRes, silverInrRes] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/USD", { headers }),
      fetch("https://www.goldapi.io/api/XAU/INR", { headers }),
      fetch("https://www.goldapi.io/api/XAG/INR", { headers })
    ]);

    if (!goldUsdRes.ok || !goldInrRes.ok || !silverInrRes.ok) {
      throw new Error(`Failed to fetch from GoldAPI: Gold/USD status ${goldUsdRes.status}, Gold/INR status ${goldInrRes.status}, Silver/INR status ${silverInrRes.status}`);
    }

    const goldUsd = await goldUsdRes.json();
    const goldInr = await goldInrRes.json();
    const silverInr = await silverInrRes.json();

    const usd_to_inr = goldInr.price / goldUsd.price;
    const silver_gram_in_usd = silverInr.price_gram_24k / usd_to_inr;

    const parsedData = {
      ounce_price_usd: goldUsd.price,
      gmt_ounce_price_usd_updated: new Date(goldUsd.timestamp * 1000).toISOString(),
      ounce_price_ask: goldUsd.ask || goldUsd.price,
      ounce_price_bid: goldUsd.bid || goldUsd.price,
      ounce_price_usd_today_low: goldUsd.low_price,
      ounce_price_usd_today_high: goldUsd.high_price,
      usd_to_inr: usd_to_inr.toFixed(4),
      ounce_in_inr: goldInr.price,
      silver_ounce_in_inr: silverInr.price,
      gram_in_usd: goldUsd.price_gram_24k,
      gram_in_inr: goldInr.price_gram_24k,
      silver_gram_in_usd: silver_gram_in_usd,
      silver_gram_in_inr: silverInr.price_gram_24k,
      silver_ounce_price_ask_inr: silverInr.ask || silverInr.price,
      silver_ounce_price_bid_inr: silverInr.bid || silverInr.price,
      silver_ounce_price_inr_today_low: silverInr.low_price,
      silver_ounce_price_inr_today_high: silverInr.high_price,
      gmt_inr_updated: new Date(silverInr.timestamp * 1000).toISOString()
    };

    // Save in cache
    ratesCache.data = parsedData;
    ratesCache.timestamp = now;

    return res.success(200, "Metal Rates Fetched Successfully", parsedData);
  } catch (error) {
    console.error("Error fetching live metal rates from GoldAPI:", error);
    
    // If we have cached data, return it as a fallback
    if (ratesCache.data) {
      return res.success(200, "Metal Rates Fetched Successfully (Stale Fallback)", ratesCache.data);
    }

    // Otherwise, return a mock rate so the dashboard doesn't crash
    const fallbackData = {
      ounce_price_usd: "4039.305",
      gmt_ounce_price_usd_updated: new Date().toISOString(),
      ounce_price_ask: "4039.305",
      ounce_price_bid: "4039.305",
      ounce_price_usd_today_low: "4034.63",
      ounce_price_usd_today_high: "4082.35",
      usd_to_inr: "95.80",
      ounce_in_inr: 386965.48,
      silver_ounce_in_inr: 5512.22,
      gram_in_usd: 129.66,
      gram_in_inr: 12421.59,
      silver_gram_in_usd: 1.84,
      silver_gram_in_inr: 176.94,
      silver_ounce_price_ask_inr: 5512.22,
      silver_ounce_price_bid_inr: 5512.22,
      silver_ounce_price_inr_today_low: 5419.12,
      silver_ounce_price_inr_today_high: 5629.30
    };
    return res.success(200, "Metal Rates Fetched Successfully (Mock Fallback)", fallbackData);
  }
});

export { getKpis, getMetalRates };
