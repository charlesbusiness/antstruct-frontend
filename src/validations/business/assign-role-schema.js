import Joi from "joi-browser";

export const AssignRoleSchema = {
    business_role_id: Joi.array().items(Joi.number().integer().positive()).min(1).required().label("Role Ids"),
    employee: Joi.number().integer().required().label("Employee")
}