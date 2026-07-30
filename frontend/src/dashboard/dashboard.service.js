import { api } from "../utils/axios.utils";

export const getDashboardKpis = (range) => api.get(`/dashboard/kpis?range=${encodeURIComponent(range)}`);

export const getMetalRates = () => api.get("/dashboard/metal-rates");

export const getLowerGridData = (range) => api.get(`/dashboard/lower-grid-data?range=${encodeURIComponent(range)}`);
