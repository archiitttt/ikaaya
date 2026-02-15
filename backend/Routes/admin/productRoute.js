const router = require('express').Router();
const upload = require('../../Config/multer');
const { createProduct, destroyProduct, updateProduct, getTotalProductsNumber } = require('../../Controllers/productController');
const { productValidation } = require('../../Validators/productValidator');

router.route('/')
.post(upload.single('image'), productValidation, createProduct)

router.route('/number')
.get(getTotalProductsNumber)

router.route('/:id')
.delete(destroyProduct)
.put(upload.single('image'), productValidation, updateProduct)

module.exports = router;