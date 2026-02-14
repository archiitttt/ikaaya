const { StatusCodes } = require("http-status-codes");
const { ExpressError } = require("../Utils/expressError");
const jwt = require('jsonwebtoken');

module.exports.isAuth = (req, res, next)=>{
    const token = req.cookies.token;

    if(!token){
        throw new ExpressError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
}

module.exports.isAdmin = (req, res, next)=>{
    if(req.user.role !== 'admin'){
        throw new ExpressError('Admin access required', StatusCodes.FORBIDDEN);
    }

    next();
}