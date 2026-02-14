const router = require('express').Router();
const upload = require('../../Config/multer');
const { createProduct, destroyProduct, updateProduct } = require('../../Controllers/productController');
const { productValidation } = require('../../Validators/productValidator');

router.route('/')
.post(productValidation, createProduct)

router.route('/:id')
.delete(destroyProduct)
.put(productValidation, upload.single('image'), updateProduct)

module.exports = router;