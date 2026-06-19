const Cart = require('../Models/cartModel');
const Product = require('../Models/productModel');
const User = require('../Models/userModel');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');



/**
 * Helper function to calculate total price
 */
const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => {
    if (item.productId && item.productId.price) {
      return total + (item.productId.price * item.quantity);
    }
    return total;
  }, 0);
};

/**
 * Get user's cart
 * GET /api/cart
 */
module.exports.getCart = async (req, res) => {
  const { id: userId } = req.user;

  const cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    model: 'Product'
  });

  if (!cart) {
    return res.status(StatusCodes.OK).json({
      message: 'Cart is empty',
      success: true,
      data: {
        userId,
        items: [],
        totalPrice: 0,
        totalItems: 0
      }
    });
  }

  // Calculate total price and item count
  const totalPrice = calculateTotalPrice(cart.items);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  res.status(StatusCodes.OK).json({
    message: 'Cart fetched successfully',
    success: true,
    data: {
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice,
      totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    }
  });
};

/**
 * Add item to cart
 * POST /api/cart/add
 * Body: { productId, quantity }
 */
module.exports.addToCart = async (req, res) => {
  const { id: userId } = req.user;
  const { productId, quantity = 1 } = req.body;

  // Validate productId
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ExpressError('Invalid product ID', StatusCodes.BAD_REQUEST);
  }

  // Validate quantity
  if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
    throw new ExpressError('Quantity must be a positive integer', StatusCodes.BAD_REQUEST);
  }

  // Check if product exists and has stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ExpressError('Product not found', StatusCodes.NOT_FOUND);
  }

  if (product.stock < quantity) {
    throw new ExpressError(
      `Insufficient stock. Available: ${product.stock}`,
      StatusCodes.BAD_REQUEST
    );
  }

  // Get or create cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
      totalPrice: 0
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update quantity if product exists
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    if (product.stock < newQuantity) {
      throw new ExpressError(
        `Insufficient stock. Available: ${product.stock}`,
        StatusCodes.BAD_REQUEST
      );
    }
    
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      productId,
      quantity
    });
  }

  // Save cart
  await cart.save();

  // Populate and recalculate totals
  await cart.populate({
    path: 'items.productId',
    model: 'Product'
  });

  const totalPrice = calculateTotalPrice(cart.items);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  res.status(StatusCodes.CREATED).json({
    message: 'Item added to cart successfully',
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      totalPrice,
      totalItems
    }
  });
};

/**
 * Update item quantity in cart
 * PUT /api/cart/update/:productId
 * Body: { quantity }
 */
module.exports.updateQuantity = async (req, res) => {
  const { id: userId } = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;

  // Validate inputs
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ExpressError('Invalid product ID', StatusCodes.BAD_REQUEST);
  }

  if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
    throw new ExpressError('Quantity must be a positive integer', StatusCodes.BAD_REQUEST);
  }

  // Check product exists and has stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ExpressError('Product not found', StatusCodes.NOT_FOUND);
  }

  if (product.stock < quantity) {
    throw new ExpressError(
      `Insufficient stock. Available: ${product.stock}`,
      StatusCodes.BAD_REQUEST
    );
  }

  // Find cart and update item
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ExpressError('Cart not found', StatusCodes.NOT_FOUND);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new ExpressError('Item not found in cart', StatusCodes.NOT_FOUND);
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // Populate and return
  await cart.populate({
    path: 'items.productId',
    model: 'Product'
  });

  const totalPrice = calculateTotalPrice(cart.items);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  res.status(StatusCodes.OK).json({
    message: 'Cart updated successfully',
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      totalPrice,
      totalItems
    }
  });
};

/**
 * Remove item from cart
 * DELETE /api/cart/remove/:productId
 */
module.exports.removeFromCart = async (req, res) => {
  const { id: userId } = req.user;
  const { productId } = req.params;

  // Validate productId
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ExpressError('Invalid product ID', StatusCodes.BAD_REQUEST);
  }

  // Find cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ExpressError('Cart not found', StatusCodes.NOT_FOUND);
  }

  // Remove item
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new ExpressError('Item not found in cart', StatusCodes.NOT_FOUND);
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  // Populate and return
  if (cart.items.length > 0) {
    await cart.populate({
      path: 'items.productId',
      model: 'Product'
    });
  }

  const totalPrice = calculateTotalPrice(cart.items);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  res.status(StatusCodes.OK).json({
    message: 'Item removed from cart successfully',
    success: true,
    data: {
      _id: cart._id,
      items: cart.items,
      totalPrice,
      totalItems
    }
  });
};

/**
 * Clear entire cart
 * DELETE /api/cart/clear
 */
module.exports.clearCart = async (req, res) => {
  const { id: userId } = req.user;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ExpressError('Cart not found', StatusCodes.NOT_FOUND);
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(StatusCodes.OK).json({
    message: 'Cart cleared successfully',
    success: true,
    data: {
      _id: cart._id,
      userId: cart.userId,
      items: [],
      totalPrice: 0,
      totalItems: 0
    }
  });
};
