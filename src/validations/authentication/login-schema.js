import  Joi  from "joi-browser";

export const LoginSchema = {
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    password: Joi.string().min(6).required().label("Password")
};