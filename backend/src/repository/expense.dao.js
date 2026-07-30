import Expense from "../models/expense.model.js";

const createExpense = async (expenseData) => {
  const expense = await Expense.create(expenseData);
  return expense;
};

const getAllExpenses = async () => {
  const expenses = await Expense.find().sort({ date: -1 }).lean();
  return expenses;
};

const getExpenseById = async (expenseId) => {
  const expense = await Expense.findById(expenseId).lean();
  return expense;
};

const updateExpense = async (expenseId, expenseData) => {
  const expense = await Expense.findByIdAndUpdate(
    expenseId,
    { $set: expenseData },
    { new: true }
  ).lean();
  return expense;
};

const deleteExpense = async (expenseId) => {
  const expense = await Expense.findByIdAndDelete(expenseId).lean();
  return expense;
};

export default {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
