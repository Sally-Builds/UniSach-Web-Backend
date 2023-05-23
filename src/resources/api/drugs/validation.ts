import Joi from 'joi'

const create = Joi.object({
    drugs: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required(),
        description: Joi.string(),
        category: Joi.string(),
        amount: Joi.number(),
        price: Joi.number().required(),
    })).required()
})

const update = Joi.object({ 
    drugs: Joi.array().items(Joi.object().keys(
        {
            id: Joi.string().required(),
            name: Joi.string(),
            type: Joi.string(),
            description: Joi.string(),
            category: Joi.string(),
            amount: Joi.number(),
            price: Joi.number(),
        }
    ))}
).required()

const del = Joi.object({
    drugs: Joi.array().items(Joi.string())
})

export default {create, update, del}