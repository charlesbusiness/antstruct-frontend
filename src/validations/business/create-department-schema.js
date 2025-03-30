import Joi from "joi-browser";

export const CreateDepartmentSchema = {
    department_name: Joi.string().min(2).required().label('Department Name'),
    department_detail: Joi.string().min(2).allow('').label('Department Deatails'),
}