import Joi from "joi";

export const EmployeeDepartmentManager = Joi.object({
    employee: Joi.number().integer().positive().min(1).required().label("Employee ID"),
    department_id: Joi.array().items(Joi.number().integer().positive()).min(1).required().label("Departments"),
})