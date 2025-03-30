import  Joi from "joi-browser";

export const validate = (data, schema) => {
    const result = Joi.validate(data, schema, { abortEarly: false });
    if (!result.error) return null;

    const newErrors = {};
    result.error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
    });

    return newErrors;
};