import Joi from "joi";

export const CreateDepartmentSchema = Joi.object( {
    department_name: Joi.string().min(2).required().label('Department Name'),
    department_detail: Joi.string().min(2).allow('').label('Department Deatails'),
})