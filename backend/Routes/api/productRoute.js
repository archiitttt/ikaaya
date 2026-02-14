const { showAllProducts, showProductbyId, updateProduct, showProductsByCategory } = require('../../Controllers/productController');
const {isAuth, isAdmin} = require('../../Middlewares/authMiddleware');

const router = require('express').Router();

router.route('/')
.get(showAllProducts);

router.route('/category/:category')
.get(showProductsByCategory)

router.route('/:id')
.get(showProductbyId)
.patch(isAuth, isAdmin, updateProduct)


module.exports = router;