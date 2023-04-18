import Joi from 'joi'
import Pharmacy from './interfaces/pharmacy.interface'

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
        coordinates: Joi.array().items(Joi.number())
    }),
    email: Joi.string().required(),
    description: Joi.string(),
})

const update = Joi.object({
    pharmacistLicense: Joi.string(),
    pharmacistQualification: Joi.string(),
    name: Joi.string(),
    type: Joi.string(),
    phone_number: Joi.string(),
    motto: Joi.string(),
    license_number: Joi.string(),
    address: Joi.string(),
    location: Joi.object().keys({
        type: Joi.string(),
        coordinates: Joi.array().items(Joi.number())
    }),
    email: Joi.string(),
    description: Joi.string(),
})

export default {create, update}