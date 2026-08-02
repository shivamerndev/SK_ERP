import joi from "joi"

function customerValidator(customerData) {

    const createSchema = joi.object({
        fullName: joi.string().min(3).required().trim().messages({
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 3 characters long'
        }),
        phone: joi.string().pattern(/^[0-9]{10}$/).required().messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must be exactly 10 digits'
        }),
        loyality: joi.string().valid("vip", "regular", "new").default("vip"),
        shopName: joi.string().allow("").trim(),
        address: joi.string().required().trim().messages({
            'string.empty': 'Address is required'
        }),
        email: joi.string().email().allow("").trim(),
        notes: joi.string().allow("").trim(),
        creditLimit: joi.number().min(0).empty('').default(0),
        joinedAt: joi.alternatives().try(
            joi.string().valid("older", "Older"),
            joi.date()
        ).default("older")
    })

    return createSchema.validate(customerData)
}

function updateCustomerValidator(customerData) {
    const updateSchema = joi.object({
        fullName: joi.string().min(3).trim().messages({
            'string.min': 'Full name must be at least 3 characters long'
        }),
        phone: joi.string().pattern(/^[0-9]{10}$/).messages({
            'string.pattern.base': 'Phone number must be exactly 10 digits'
        }),
        loyality: joi.string().valid("vip", "regular", "new"),
        shopName: joi.string().allow("").trim(),
        address: joi.string().trim(),
        email: joi.string().email().allow("").trim(),
        notes: joi.string().allow("").trim(),
        creditLimit: joi.number().min(0).empty(''),
        joinedAt: joi.alternatives().try(
            joi.string().valid("older", "Older"),
            joi.date()
        )
    })

    return updateSchema.validate(customerData)
}

export { updateCustomerValidator };
export default customerValidator;