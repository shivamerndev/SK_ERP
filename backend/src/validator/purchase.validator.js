import joi from "joi";

function purchaseValidator(purchaseData) {
  const itemSchema = joi.object({
    sku: joi.string().required().messages({
      'string.empty': 'SKU is required'
    }),
    productName: joi.string().required().messages({
      'string.empty': 'Product name is required'
    }),
    quantity: joi.number().min(0).default(0),
    weight: joi.number().min(0).default(0),
    less: joi.number().min(0).default(0),
    netWeight: joi.number().min(0).default(0),
    tunch: joi.string().allow("").default(""),
    effectivePurity: joi.number().min(0).default(0),
    labRate: joi.number().min(0).default(0),
    labRateType: joi.string().valid("PER_GRAM", "PER_KG", "FLAT").default("PER_GRAM"),
    amount: joi.number().min(0).default(0),
    fine: joi.number().min(0).default(0)
  });

  const jamaSchema = joi.object({
    description: joi.string().allow("").default(""),
    weight: joi.number().min(0).default(0),
    less: joi.number().min(0).default(0),
    netWeight: joi.number().min(0).default(0),
    tunch: joi.number().min(0).default(0),
    fine: joi.number().min(0).default(0)
  });

  const cashSchema = joi.object({
    type: joi.string().valid("CASH", "BANK_TRANSFER", "UPI").default("CASH"),
    description: joi.string().allow("").default(""),
    amount: joi.number().min(0).default(0)
  });

  const schema = joi.object({
    supplierName: joi.string().required().trim().messages({
      'string.empty': 'Supplier name is required'
    }),
    date: joi.string().required().messages({
      'string.empty': 'Bill date is required'
    }),
    time: joi.string().allow("").default(""),
    silverRate: joi.number().required().messages({
      'any.required': 'Silver rate is required'
    }),
    oldBalanceFine: joi.number().default(0),
    oldBalanceAmount: joi.number().default(0),
    items: joi.array().items(itemSchema).min(1).required().messages({
      'array.min': 'Purchase bill must have at least 1 item'
    }),
    jamaDetails: joi.array().items(jamaSchema).default([]),
    cashJamaList: joi.array().items(cashSchema).default([]),
    totals: joi.object({
      weight: joi.number().default(0),
      less: joi.number().default(0),
      netWt: joi.number().default(0),
      amount: joi.number().default(0),
      fine: joi.number().default(0)
    }).default({
      weight: 0,
      less: 0,
      netWt: 0,
      amount: 0,
      fine: 0
    }),
    netCashPayable: joi.number().default(0),
    cost: joi.number().required().messages({
      'any.required': 'Total cost is required'
    }),
    paymentMethod: joi.string().default("Cash"),
    finalOutstanding: joi.object({
      amount: joi.number().default(0),
      fine: joi.number().default(0)
    }).default({
      amount: 0,
      fine: 0
    })
  });

  return schema.validate(purchaseData);
}

export default purchaseValidator;
