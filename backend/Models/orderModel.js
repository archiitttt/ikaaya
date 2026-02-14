const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
        },
        items : {
            type : [
                {
                    productId : {
                        type : mongoose.Schema.Types.ObjectId,
                        ref : 'Product',
                        required : true
                    },
                    name : {
                        type : String,
                        required : true,
                        trim : true
                    },
                    price : {
                        type : Number,
                        min : 0,
                        required : true
                    },
                    quantity : {
                        type : Number,
                        min : 1,
                        required : true
                    }
                }
            ],
            validate: {
                validator: arr => arr.length > 0,
                message: 'Order must contain at least one item'
            }
        },
        totalAmount : {
            type : Number,
            required : true
        },
        address : {
            fullName : {
                type : String,
                required : true,
                trim : true
            },
            phone : {
                type : String,
                required : true,
            },
            house : {
                type : String,
                required : true,
                trim : true
            },
            city : {
                type : String,
                required : true,
                trim : true
            },
            state : {
                type : String,
                required : true,
                trim : true
            },
            pincode : {
                type : String,
                required : true,
                trim : true
            }
        },
        paymentMethod : {
            type : String,
            enum : ['COD', 'UPI'],
            required : true,
        },
        paymentStatus : {
            type : String,
            enum : ['pending', 'paid', 'failed'],
            required : true,
            default: 'pending'
        },
        orderStatus : {
            type : String,
            enum : ['cancelled', 'placed', 'packed', 'shipped', 'delivered'],
            required : true,
            default: 'placed'
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Order', orderSchema);