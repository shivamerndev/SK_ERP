import joi from "joi";

function billingValidator(billingData) {
  const itemSchema = joi.object({
    item: joi.string().required().trim(),
    weight: joi.string().allow("").default(""),
    panniDetail: joi.string().allow("").default(""),
    less: joi.string().allow("").default(""),
    netWt: joi.number().default(0),
    tunch: joi.string().allow("").default(""),
    lab: joi.string().allow("").default(""),
    amount: joi.number().default(0),
    fine: joi.number().default(0)
  });

  const schema = joi.object({
    billNo: joi.string().allow(""),
    customerName: joi.string().required().trim(),
    customerPhone: joi.string().allow("").trim().default(""),
    customerAddress: joi.string().allow("").trim().default(""),
    customerId: joi.number().allow(null, "").empty(""),
    date: joi.string().required(),
    time: joi.string().required(),
    topHeader: joi.string().allow("").default("|| SHREE GANESHAYAA NAMAH ||"),
    title: joi.string().allow("").default("ROUGH ESTIMATE"),
    items: joi.array().items(itemSchema).required(),
    totals: joi.object({
      weight: joi.number().default(0),
      less: joi.number().default(0),
      netWt: joi.number().default(0),
      amount: joi.number().default(0),
      fine: joi.number().default(0)
    }).default(),
    lastBalance: joi.object({
      amount: joi.number().default(0),
      fine: joi.number().default(0)
    }).default(),
    jamaDetail: joi.object({
      details: joi.string().allow("").default(""),
      weight: joi.number().default(0),
      netWt: joi.number().default(0),
      tunch: joi.string().allow("").default(""),
      fine: joi.number().default(0),
      amount: joi.number().default(0)
    }).default(),
    finalBaki: joi.object({
      amount: joi.number().default(0),
      fine: joi.number().default(0)
    }).default(),
    postedToUdhaar: joi.boolean().default(false)
  });

  return schema.validate(billingData);
}

export default billingValidator;
