const Joi = require('joi');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');

const adminOrderUpdateValidation = (req, res, next) => {
    const schema = Joi.object({
        orderStatus: Joi.string()
            .valid('cancelled', 'packed', 'shipped', 'delivered'),

        paymentStatus: Joi.string()
            .valid('paid', 'failed'),
    })
    .or('orderStatus', 'paymentStatus');

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        throw new ExpressError(
            error.details.map(d => d.message).join(', '),
            StatusCodes.BAD_REQUEST
        );
    }

    next();
};

module.exports = { adminOrderUpdateValidation };
