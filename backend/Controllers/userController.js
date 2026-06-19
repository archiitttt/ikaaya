const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const User = require('../Models/userModel');

module.exports.getUserInfo = async (req, res)=>{
    const userID = req.user.id;

    const data = await User.findById(userID);

    if(!data){
        throw new ExpressError('User not found!', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        success : true,
        message : 'User data fetched successfully',
        data : data
    })
};