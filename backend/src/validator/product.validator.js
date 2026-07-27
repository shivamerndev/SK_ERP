import joi from "joi";

function productValidator(productData) {
    const schema = joi.object({
        name: joi.string().required().trim().messages({
            'string.empty': 'Product name is required',
        }),
        pieces: joi.number().integer().min(0).default(0),
        category: joi.string().trim().default("payal"),
        image: joi.string().uri().allow("").default("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60"),
        weight: joi.array().items(joi.number().min(0)).required().messages({
            'array.base': 'Weight must be a list of numbers',
            'any.required': 'Weight is required',
        }),
        panniDetail: joi.number().min(0).default(0),
        tunch: joi.number().min(0).required().messages({
            'any.required': 'Tunch is required',
        }),
        lab: joi.number().min(0).required().messages({
            'any.required': 'Lab is required',
        }),
    });

    return schema.validate(productData);
}

export default productValidator;
