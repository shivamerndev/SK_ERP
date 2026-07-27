import { api } from "../utils/axios.utils";

export const getDashboardKpis = (range) => api.get(`/dashboard/kpis?range=${encodeURIComponent(range)}`);
