import Joi from 'joi'

const create = Joi.object({
    pharmacistLicense: Joi.string(),
    pharmacistQualification: Joi.string(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    phone_number: Joi.string().required(),
    motto: Joi.string(),
    license_number: Joi.string().required(),
    address: Joi.string(),
    location: Joi.object().keys({
        type: Joi.string(),
        coordinates: Joi.string()
    }),
    email: Joi.string().required(),
    description: Joi.string(),
})

export default {create}