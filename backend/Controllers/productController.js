const Product = require('../Models/productModel');
const { ExpressError } = require('../Utils/expressError');
const { wrapAsync } = require('../Utils/wrapAsync');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { deleteFromCloudinary } = require('../Utils/cloudinaryDelete');

module.exports.createProduct = wrapAsync(async (req, res)=>{
    const {name, description, price, category, stock} = req.body;

    const existingProduct = await Product.findOne({name});
    if(existingProduct){
        throw new ExpressError('A product with this name already exists', StatusCodes.CONFLICT);
    }

    const product = new Product({name, description, price,
        category : category.toLowerCase(),
        image : {
            url: req.file.url,
            public_id: req.file.public_id
        },
        stock});
    const savedProduct = await product.save();

    res.status(StatusCodes.CREATED).json({
        message : 'Product created successfully',
        success : true,
        data : savedProduct
    })
});

module.exports.showAllProducts = wrapAsync(async (req, res)=>{
    const products = await Product.find({});

    if(!products){
        throw new ExpressError('No products to display', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({
        message : 'Products Fetched',
        success : true,
        data : products
    })
});

module.exports.showProductbyId = wrapAsync(async (req, res)=>{
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(
            'Invalid product ID',
            StatusCodes.BAD_REQUEST
        );
    }

    const product = await Product.findOne({_id : id});

    if(!product){
        throw new ExpressError('This product either no longer exists or has been removed', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        message : 'Product fetched successfully',
        success : true,
        data : product
    })
});

module.exports.showProductsByCategory = wrapAsync(async (req, res)=>{
    const {category} = req.params;

    const allowedCategories = Product.schema.path("category").enumValues;

    if(!allowedCategories.includes(category)){
        throw new ExpressError('This category does not exist!', StatusCodes.BAD_REQUEST);
    }

    const products = await Product.find({category : category});

    if(!products){
        throw new ExpressError('Could not fetch products under this category!', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        success : true,
        message : 'Products fetched successfully!',
        data : products
    })
})

module.exports.destroyProduct = wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(
            'Invalid product ID',
            StatusCodes.BAD_REQUEST
        );
    }

    const product = await Product.findById(id);

    if(!product){
        throw new ExpressError('Product not found!', StatusCodes.NOT_FOUND);
    }

    if(product.image?.public_id){
        deleteFromCloudinary(product.image.public_id);
    }

    await product.deleteOne();

    res.status(StatusCodes.OK).json({
        message: 'Product deleted successfully',
        success: true
    });
});

module.exports.updateProduct = wrapAsync(async (req, res) => {

  const { id } = req.params;
  const { name, description, price, category, stock, isActive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError("Invalid product ID", StatusCodes.BAD_REQUEST);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ExpressError("Product not found", StatusCodes.NOT_FOUND);
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category.toLowerCase();
  product.stock = stock;
  product.isActive = isActive;

  
  if (req.file) {

    if(product.image && product.image.public_id){
        await deleteFromCloudinary(product.image.public_id);
    }

    product.image = {
        url : req.file.url,
        public_id : req.file.public_id
    }
  }

  await product.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Updated Successfully",
    data: product
  });

});

module.exports.getTotalProductsNumber = wrapAsync(async (req, res)=>{
  const totalProducts = await Product.estimatedDocumentCount();
  res.status(StatusCodes.OK).json({
    success : true,
    message : "Total Products fetched",
    data : totalProducts
  })  
})
