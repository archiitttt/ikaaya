const { StatusCodes } = require('http-status-codes');
const { signup, login, logout } = require('../../Controllers/authController');
const { isAuth } = require('../../Middlewares/authMiddleware');
const { signupValidation, loginValidation } = require('../../Validators/authValidator');

const router = require('express').Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', isAuth, (req, res)=>{
    res.status(StatusCodes.OK).json({
        user : req.user
    })
})

module.exports = router;