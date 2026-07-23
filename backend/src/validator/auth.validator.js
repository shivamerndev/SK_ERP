import joi from "joi"

function authValidator(userData) {

    const registerSchema = joi.object({
        fullName: joi.string().min(3).required().trim(),
        email: joi.string().email().required().lowercase(),
        role: joi.string().required().valid("user", "admin").trim(),
        googleId: joi.string().required().trim()
    })

    const loginSchema = joi.object({
        email: joi.string().email().required().lowercase(),
        googleId: joi.string().required().trim(),
        role: joi.string().required().valid("user", "admin").trim()
    })

    return { register: registerSchema.validate(userData), login: loginSchema.validate(userData) }
}

export default authValidator;