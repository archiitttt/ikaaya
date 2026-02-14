const { getUserInfo } = require('../../Controllers/userController');
const { isAuth } = require('../../Middlewares/authMiddleware');

const router = require('express').Router();

router.route('/me')
.get(isAuth, getUserInfo);

module.exports = router;