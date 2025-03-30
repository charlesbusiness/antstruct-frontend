import  Joi  from "joi-browser";

export const VerifyAcccountSchema = {

    code: Joi.string().min(6).required().label("OTP")
};