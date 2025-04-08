import Joi from "joi";

export const CreateBusinessSchema = Joi.object( {
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    phone: Joi.string().required().min(6).label('Phone Number'),
    address: Joi.string().min(15).required().label('Business Address'),
    business_name: Joi.string().min(2).required().label('Business Name'),
    business_category_id: Joi.required().label('Business Category'),
    business_size_id: Joi.required().label('Business Size'),
    details: Joi.string().allow('').label('Business Description'),
    business_number: Joi.string().allow('').label('Business Registration Number'),
})