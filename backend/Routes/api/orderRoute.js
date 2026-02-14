const router = require('express').Router();
const { createOrder, showUserOrders, getOrderbyId } = require('../../Controllers/orderController');
const {isAuth} = require('../../Middlewares/authMiddleware');
const { orderValidation } = require('../../Validators/orderValidator');

router.route('/')
.post(isAuth, orderValidation, createOrder)
.get(isAuth, (req,res)=>{
    res.send('this is the orders page');
})

router.route('/my')
.get(isAuth, showUserOrders);

router.route('/:id')
.get(isAuth, getOrderbyId);

module.exports = router;