const Joi = require('joi');
const {ExpressError} = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');

const productValidation = (req, res, next)=>{
    const schema = Joi.object({
        name : Joi.string().min(1).required(),
        description : Joi.string().required(),
        price : Joi.number().min(0).required(),
        category : Joi.string().valid("Bracelet", "Necklace", "Keycharm", "Ring", "Earring").required(),
        images : Joi.string().required(),
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