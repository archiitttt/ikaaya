const Order = require('../Models/orderModel');
const Product = require('../Models/productModel');
const User = require('../Models/userModel');
const Cart = require('../Models/cartModel');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { sendOrderEmail, sendCustomerConfirmationEmail } = require('../Utils/emailService');

const normalizeItems = (items) => {
    const map = new Map();

    for (const item of items) {
        const key = item.productId.toString();

        if (map.has(key)) {
            map.get(key).quantity += item.quantity;
        } else {
            map.set(key, {
                productId: item.productId,
                quantity: item.quantity
            });
        }
    }

    return Array.from(map.values());
};

module.exports.createOrder = async (req, res) => {
    const userID = req.user.id;
    const { items, address, paymentMethod } = req.body;

    const normalizedItems = normalizeItems(items);
    let session;

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        let totalAmount = 0;

        const productIds = normalizedItems.map(item => item.productId);

        const products = await Product.find({
            _id: { $in: productIds },
            isActive: true
        }).session(session);

        const productMap = new Map(
            products.map(p => [p._id.toString(), p])
        );

        for (const item of normalizedItems) {
            const product = productMap.get(item.productId.toString());

            if (!product) {
                throw new ExpressError(
                    'Product not found or inactive',
                    StatusCodes.BAD_REQUEST
                );
            }

            if (product.stock < item.quantity) {
                throw new ExpressError(
                    `Insufficient stock for ${product.name}`,
                    StatusCodes.BAD_REQUEST
                );
            }

            item.name = product.name;
            item.price = product.price;

            totalAmount += product.price * item.quantity;
        }

        const bulkOps = normalizedItems.map(item => ({
            updateOne: {
                filter: {
                    _id: item.productId,
                    stock: { $gte: item.quantity }
                },
                update: {
                    $inc: { stock: -item.quantity }
                }
            }
        }));
        const result = await Product.bulkWrite(bulkOps, { session });

        if (result.modifiedCount !== normalizedItems.length) {
            throw new ExpressError(
                'Stock changed, please retry order',
                StatusCodes.CONFLICT
            );
        }

        const order = new Order({
            userId: userID,
            items: normalizedItems,
            totalAmount,
            address,
            paymentMethod
        });

        const finalRes = await order.save({ session });
        await session.commitTransaction();
        await User.findByIdAndUpdate(userID, {$set : {orders : finalRes._id}})

        // Clear the user's cart after successful order
        await Cart.findOneAndUpdate({ userId: userID }, { items: [], totalPrice: 0 });

        res.status(StatusCodes.CREATED).json({
            message: 'Order created successfully',
            success: true,
            data: order
        });

        // Send emails asynchronously (don't await — don't block the response)
        const customer = await User.findById(userID);
        if (customer) {
          sendOrderEmail(order, customer);
          sendCustomerConfirmationEmail(order, customer);
        }
    } catch (err) {
        if (session) await session.abortTransaction();

        if (err instanceof ExpressError) throw err;

        throw new ExpressError(
            err.message || 'Order creation failed',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    } finally {
        if (session) session.endSession();
    }
};

module.exports.showUserOrders = async (req, res)=>{
    const userID = req.user.id;

    if(!mongoose.Types.ObjectId.isValid(userID)){
        throw new ExpressError('Invalid userID', StatusCodes.BAD_REQUEST);
    }

    const orders = await Order.find({ userId: userID }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
        message : 'Orders Fetched Successfully',
        success : true,
        data : orders
    })
};

module.exports.getOrderbyId = async (req, res)=>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ExpressError('Invalid Order ID', StatusCodes.BAD_REQUEST);
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ExpressError('Order not found', StatusCodes.NOT_FOUND);
    }

    if (req.user.role!=='admin' && order.userId.toString() !== req.user.id){
        throw new ExpressError('You are not authorized to view this order', StatusCodes.FORBIDDEN);
    }

    res.status(StatusCodes.OK).json({
        message : 'Order Fetched Successfully',
        success : true,
        data : order
    })
};

module.exports.updateOrderStatus = async (req, res)=>{
    const {id} = req.params;
    const {paymentStatus, orderStatus} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ExpressError('Invalid Order ID', StatusCodes.BAD_REQUEST);
    }

    const order = await Order.findByIdAndUpdate(
        id,
        { $set: {paymentStatus : paymentStatus, orderStatus: orderStatus } },
        { new: true, runValidators: true }
    );

    if (!order) {
        throw new ExpressError('Order not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        message : 'Order Status Updated Successfully',
        success : true,
        data : order
    })
};
