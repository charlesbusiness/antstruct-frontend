import Joi from "joi";
import { PasswordRegex, PasswordRegexMessage } from "../../utils/consts";

export const RegisterSchema =  Joi.object(
{
    email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
    password: Joi.string()
        .min(6)
        .regex(PasswordRegex)
        .required()
        .label("Password")
        .error(errors => {
            return errors.map(err => {
                console.log( err.type); // Debugging

                if (err.type == "string.pattern.base") {
                    err.message = "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
                } else if (err.type == "string.min") {
                    err.message = "Password must be at least 6 characters long.";
                }
                else if (err.type == "any.required" || err.type == "any.empty" ) {
                    err.message = "Password is required.";
                } else {
                    err.message = PasswordRegexMessage // Fallback message
                }
                return err;
            });
        }),
    phone: Joi.string().min(6).required().label('Phone Number'),
})