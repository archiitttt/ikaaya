const Joi = require('joi');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');

const objectId = Joi.string().hex().length(24);

const orderValidation = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.forbidden(),

        items: Joi.array()
            .items(
                Joi.object({
                    productId: objectId.required(),
                    quantity: Joi.number().min(1).required(),
                })
            )
            .min(1)
            .required(),

        address: Joi.object({
            fullName: Joi.string().trim().min(1).required(),
            phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
            house: Joi.string().trim().min(1).required(),
            city: Joi.string().trim().min(1).required(),
            state: Joi.string().trim().min(1).required(),
            pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
        }).required(),

        paymentMethod: Joi.string().valid('COD', 'UPI').required(),

        paymentStatus: Joi.forbidden(),
        orderStatus: Joi.forbidden(),
    });

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        throw new ExpressError(message, StatusCodes.BAD_REQUEST);
    }

    next();
};

module.exports = { orderValidation };
