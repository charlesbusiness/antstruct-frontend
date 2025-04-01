import Joi from "joi-browser";

export const CreateRoleSchema = {
    name: Joi.string().min(2).required().label('Role Name')
}