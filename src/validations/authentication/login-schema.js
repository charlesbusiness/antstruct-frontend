import  Joi  from "joi";

export const LoginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    password: Joi.string().min(6).required().label("Password")
})