const Joi = require('joi');
const {ExpressError} = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');

const signupValidation = (req, res, next) =>{
    const schema = Joi.object({
        name : Joi.string().min(1).max(100).required(),
        phone : Joi.string().min(10).required(),
        email : Joi.string().email().required(),
        password : Joi.string().min(6).required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        throw new ExpressError(error, StatusCodes.BAD_REQUEST);
    }

    next();
}

const loginValidation = (req, res, next) =>{
    const schema = Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().min(6).required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        throw new ExpressError(error, StatusCodes.BAD_REQUEST);
    }

    next();
}

module.exports = {signupValidation, loginValidation}; 