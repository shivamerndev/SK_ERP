import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import expenseValidator from "../validator/expense.validator.js";
import expenseService from "../services/expense.service.js";
import { AppError } from "../utils/error.utils.js";

const createExpense = asyncHandler(async (req, res) => {
  const { error, value } = expenseValidator(req.body);
  if (error) throw new AppError(400, error.details[0].message, error);

  const response = await expenseService.createExpense(value);
  return res.success(201, "Expense Recorded Successfully 😊", response);
});

const getAllExpenses = asyncHandler(async (req, res) => {
  const response = await expenseService.getAllExpenses();
  return res.success(200, "Expenses Fetched Successfully", response);
});

const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await expenseService.getExpenseById(id);
  return res.success(200, "Expense Fetched Successfully", response);
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = expenseValidator(req.body);
  if (error) throw new AppError(400, error.details[0].message, error);

  const response = await expenseService.updateExpense(id, value);
  return res.success(200, "Expense Updated Successfully 😊", response);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await expenseService.deleteExpense(id);
  return res.success(200, "Expense Deleted Successfully", response);
});

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
