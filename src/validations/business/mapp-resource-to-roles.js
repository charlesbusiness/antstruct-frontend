import Joi from "joi";

export const MapRoleAndResourceSchema = Joi.object({
    business_role_id: Joi.number().integer().positive().min(1).required().label("Role Ids"),
    moduleName: Joi.string().label("Module Name"),
    api_resource: Joi.array().items(Joi.number().integer().positive()).min(1).required().label("Api Resources"),
})