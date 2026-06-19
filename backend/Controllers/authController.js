const User = require('../Models/userModel');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendOTPEmail } = require('../Utils/emailService');

module.exports.signup = async (req, res)=>{
    const {name, phone, email, password} = req.body;
    
    let existingUser = await User.findOne({$or: [{ email }, { phone }]});

    if (existingUser) {
        if (existingUser.isVerified) {
            if (existingUser.email === email) {
                throw new ExpressError('User with this email already exists. Please Login', StatusCodes.CONFLICT);
            }
            if (existingUser.phone === phone) {
                throw new ExpressError('User with this phone number already exists. Please Login', StatusCodes.CONFLICT);
            }
        } else {
            // Delete unverified user to allow them to try again
            await User.findByIdAndDelete(existingUser._id);
        }
    }

    const newUser = new User({name, phone, email, password});
    newUser.password = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000;

    await newUser.save();
    await sendOTPEmail(email, otp);

    res.status(StatusCodes.CREATED).json({
        message : "OTP sent to your email",
        success : true,
        email: email
    });
};

module.exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) throw new ExpressError('User not found', StatusCodes.NOT_FOUND);
    
    if (user.isVerified) throw new ExpressError('User already verified. Please login.', StatusCodes.BAD_REQUEST);
    
    if (user.otp !== otp) throw new ExpressError('Invalid OTP', StatusCodes.BAD_REQUEST);
    
    if (user.otpExpires < Date.now()) throw new ExpressError('OTP expired. Please sign up again.', StatusCodes.BAD_REQUEST);
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(StatusCodes.OK).json({
        message : "Email verified successfully",
        success : true,
    });
};

module.exports.login = async (req, res)=>{

    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user){
        throw new ExpressError('Invalid Credentials', StatusCodes.UNAUTHORIZED);
    }
    
    if (!user.isVerified) {
        throw new ExpressError('Email not verified. Please sign up again to receive a new OTP.', StatusCodes.UNAUTHORIZED);
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

};

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