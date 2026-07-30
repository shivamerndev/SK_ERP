import expenseRepo from "../repository/expense.dao.js";
import { AppError } from "../utils/error.utils.js";

const createExpense = async (expenseData) => {
  const expense = await expenseRepo.createExpense(expenseData);
  return expense;
};

const getAllExpenses = async () => {
  const expenses = await expenseRepo.getAllExpenses();
  return expenses;
};

const getExpenseById = async (expenseId) => {
  const expense = await expenseRepo.getExpenseById(expenseId);
  if (!expense) throw new AppError(404, "Expense not found");
  return expense;
};

const updateExpense = async (expenseId, expenseData) => {
  const expense = await expenseRepo.updateExpense(expenseId, expenseData);
  if (!expense) throw new AppError(404, "Expense not found");
  return expense;
};

const deleteExpense = async (expenseId) => {
  const expense = await expenseRepo.deleteExpense(expenseId);
  if (!expense) throw new AppError(404, "Expense not found");
  return expense;
};

export default {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
