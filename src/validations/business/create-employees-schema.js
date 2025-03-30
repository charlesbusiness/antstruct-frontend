import Joi from "joi-browser";

export const CreateEmployeeSchema = {
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    phone: Joi.string().required().min(6).label('Phone Number'),
    address: Joi.string().min(15).required().label('Business Address'),
    firstname: Joi.string().min(2).required().label('First Name'),
    lastname: Joi.string().min(2).required().label('Last Name'),
    department_id: Joi.required().label('Department'),
    dob: Joi.required().label('Date of Birth Size'),
    gender: Joi.string().allow('').label('Gender'),
}
