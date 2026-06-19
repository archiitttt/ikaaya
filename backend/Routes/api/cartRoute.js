const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require('../../Controllers/cartController');
const { isAuth } = require('../../Middlewares/authMiddleware');

const router = require('express').Router();

// All cart routes are protected with auth middleware
router.route('/')
  .get(isAuth, getCart)
  .delete(isAuth, clearCart);

router.route('/add')
  .post(isAuth, addToCart);

router.route('/update/:productId')
  .put(isAuth, updateQuantity);

router.route('/remove/:productId')
  .delete(isAuth, removeFromCart);

module.exports = router;
