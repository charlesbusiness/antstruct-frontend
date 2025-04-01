import Joi from "joi-browser";

export const CreateEmployeeSchema = {
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    phone: Joi.string().required().min(6).label('Phone Number'),
    address: Joi.string().min(15).required().label('Employee Address'),
    firstname: Joi.string().min(2).required().label('First Name'),
    lastname: Joi.string().min(2).required().label('Last Name'),
    department_id: Joi.number()
        .integer()
        .required()
        .label("Department")
        .options({
            language: {
                number: {
                    base: "Department must be a valid number.",
                    integer: "Department must be an integer.",
                },
                any: {
                    required: "Department is required.",
                    empty: "Department is required.",
                },
            },
        }),
    dob: Joi.required().label('Date of Birth Size'),
    gender: Joi.string().allow('').label('Gender'),
}
