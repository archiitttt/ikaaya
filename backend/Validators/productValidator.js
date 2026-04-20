const Joi = require('joi');
const {ExpressError} = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');
const Category = require('../Models/categoryModel');

// Helper function to get allowed categories from database
const getAllowedCategories = async () => {
    try {
        const categories = await Category.find({});
        return categories.map(cat => cat.name);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

const productValidation = async (req, res, next) => {
    try {
        const allowedCategories = await getAllowedCategories();

        const schema = Joi.object({
            _id: Joi.string().optional(),
            createdAt: Joi.date().optional(),
            updatedAt: Joi.date().optional(),
            __v: Joi.number().optional(),
            name : Joi.string().min(1).required(),
            description : Joi.string().required(),
            price : Joi.number().min(0).required(),
            category : Joi.string().valid(...allowedCategories).required(),
            image: Joi.object({url: Joi.string().uri().optional(),public_id: Joi.string().optional()}).optional(),
            stock : Joi.number().min(0).required(),
            isActive : Joi.boolean().default(true)
        });

        const {error} = schema.validate(req.body);

        if(error){
            throw new ExpressError(error, StatusCodes.BAD_REQUEST);
        }

        next();
    } catch (error) {
        if (error instanceof ExpressError) {
            throw error;
        }
        throw new ExpressError('Validation error', StatusCodes.BAD_REQUEST);
    }
};

module.exports = {productValidation};