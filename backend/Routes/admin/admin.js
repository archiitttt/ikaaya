const router = require('express').Router();
const {isAuth, isAdmin} = require('../../Middlewares/authMiddleware');
const adminProductRoutes = require('./productRoute');
const adminOrderRoutes = require('./orderRoute');

router.use(isAuth);
router.use(isAdmin);
router.use('/products', adminProductRoutes);
router.use('/orders', adminOrderRoutes);

module.exports = router;