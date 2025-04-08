import Joi from "joi";

export const CreateRoleSchema = Joi.object(
    {
        name: Joi.string().min(2).required().label('Role Name')
    }
)