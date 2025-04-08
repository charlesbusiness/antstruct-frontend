import Joi from "joi";

export const VerifyAcccountSchema = Joi.object({

    code: Joi.string().min(6).required().label("OTP")
})