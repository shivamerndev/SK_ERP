import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import dashboardService from "../services/dashboard.service.js";

const getKpis = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const metrics = await dashboardService.getKpiMetrics(range);
  return res.success(200, "KPI Metrics Fetched Successfully", metrics);
});

export { getKpis };
