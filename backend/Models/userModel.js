const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    orders : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order'
      }
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);