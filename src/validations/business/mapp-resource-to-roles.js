import Joi from "joi-browser";

export const MapRoleAndResourceSchema = {
    business_role_id: Joi.number().integer().positive().min(1).required().label("Role Ids"),
    api_resource: Joi.array().items(Joi.number().integer().positive()).min(1).required().label("Api Resources"),
}