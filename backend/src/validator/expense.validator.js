import joi from "joi";

function expenseValidator(expenseData) {
  const schema = joi.object({
    date: joi.string().required().messages({
      'string.empty': 'Date is required'
    }),
    category: joi.string().required().trim().messages({
      'string.empty': 'Category is required'
    }),
    amount: joi.number().min(0).required().messages({
      'any.required': 'Amount is required'
    }),
    paymentMethod: joi.string().valid("UPI", "Cash", "Card", "Bank Transfer").default("UPI"),
    description: joi.string().required().trim().messages({
      'string.empty': 'Description is required'
    })
  });

  return schema.validate(expenseData);
}

export default expenseValidator;
