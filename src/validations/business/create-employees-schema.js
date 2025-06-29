import Joi from 'joi';

export const CreateEmployeeSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
    phone: Joi.string().required().min(6).label('Phone Number'),
    address: Joi.string().min(15).required().label('Employee Address'),
    firstname: Joi.string().min(2).required().label('First Name'),
    lastname: Joi.string().min(2).required().label('Last Name'),
    department_id: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'Department must be a valid number.',
            'number.integer': 'Department must be an integer.',
            'any.required': 'Department is required.',
            'any.empty': 'Department is required.',
        })
        .label('Department'),

    role_id: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'Role must be a valid number.',
            'number.integer': 'Role must be an integer.',
            'any.required': 'Role is required.',
            'any.empty': 'Role is required.',
        })
        .label('Role'),
    dob: Joi.date()
        .required()
        .less(new Date(new Date().setFullYear(new Date().getFullYear() - 15)))
        .messages({
            'date.less': 'Date of Birth must be at least 15 years ago.',
            'any.required': 'Date of Birth is required.',
            'date.base': 'Date of Birth must be a valid date.',
        })
        .label('Date of Birth'),
    gender: Joi.string().allow('').label('Gender'),
});
