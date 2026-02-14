const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min : 1,
      trim: true,
      unique : true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category : {
        type : String,
        enum : ["bracelet", "necklace", "keycharm", "ring", "earring"],
        required : true
    },
    image: {
      url : {
        type: String,
        required : true
      },
      public_id : {
        type: String,
        required : true
      }
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
