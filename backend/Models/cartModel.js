const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        }
      }
    ],
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Pre-save middleware to validate items array
cartSchema.pre('save', function () {
  // Allow empty cart on save (for clearing cart operation)
});

module.exports = mongoose.model('Cart', cartSchema);