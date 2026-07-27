import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import billingService from "../services/billing.service.js";
import { AppError } from "../utils/error.utils.js";


const getAllReports = asyncHandler(async (req, res) => {
    const response = await billingService.getAllBills();
    return res.success(200, "Reports Fetched Successfully", response);
});

export {
    getAllReports
}
