const User = require('../Models/userModel');
const { wrapAsync } = require('../Utils/wrapAsync');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = wrapAsync(async (req, res)=>{
    const {name, phone, email, password} = req.body;
    
    const existingUser = await User.findOne({$or: [{ email }, { phone }]});

    if (existingUser) {
    if (existingUser.email === email) {
        throw new ExpressError(
        'User with this email already exists. Please Login',
        StatusCodes.CONFLICT
        );
    }
    if (existingUser.phone === phone) {
        throw new ExpressError(
        'User with this phone number already exists. Please Login',
        StatusCodes.CONFLICT
        );
    }
    }

    const newUser = new User({name, phone, email, password});
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(StatusCodes.CREATED).json({
        message : "User registered successfully",
        success : true,
    })
    
});

module.exports.login = wrapAsync(async (req, res)=>{

    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user){
        throw new ExpressError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
    }

    const validPass = await bcrypt.compare(password, user.password);

    if(!validPass){
        throw new ExpressError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
    }

    const token = jwt.sign(
        {id : user._id, role : user.role},
        process.env.JWT_SECRET,
        {expiresIn : '1d'}
    );

    res.cookie('token', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        maxAge : 24 * 60 * 60 * 1000
    })

    res.status(StatusCodes.OK).json({
        message : "Logged in successfully",
        success : true,
    })

});

module.exports.logout = (req, res)=>{

    const token = req.cookies?.token;

    if (!token) {
        return res.status(200).json({
            message: 'Already logged out',
            success: true
        });
    }

    res.clearCookie('token', {
        httpOnly : true,
        secure : true,
        sameSite : "none"
    })

    res.status(StatusCodes.OK).json({
        message : 'Logged out successfully',
        success : true
    })
}