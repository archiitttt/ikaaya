const Joi = require('joi');
const {ExpressError} = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');

const productValidation = (req, res, next)=>{
    const schema = Joi.object({
        _id: Joi.string().optional(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
        __v: Joi.number().optional(),
        name : Joi.string().min(1).required(),
        description : Joi.string().required(),
        price : Joi.number().min(0).required(),
        category : Joi.string().valid("bracelet", "necklace", "keycharm", "ring", "earring").required(),
        image: Joi.object({url: Joi.string().uri().optional(),public_id: Joi.string().optional()}).optional(),
        stock : Joi.number().min(0).required(),
        isActive : Joi.boolean().default(true)
    });

    const {error} = schema.validate(req.body);

    if(error){
        throw new ExpressError(error, StatusCodes.BAD_REQUEST);
    }

    next();
}

module.exports = {productValidation};