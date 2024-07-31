const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


const addressSchema = mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const shippingSchema = mongoose.Schema({
  address: {
    type: addressSchema,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  _id: {
    type: ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const orderSchema = mongoose.Schema(
  {
    shipping: {
      type: shippingSchema,
      required: true,
    },
    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    },
    payment: {
      type: String,
      required: true,
    },
    paymentID: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
    },
    products: {
      type: [productSchema],
      ref: "Product",
      validate: {
        validator: (value) => {
          //Validation for empty array
          return Array.isArray(value) && value.length > 0;
        },
      },
      message: "No products specified!",
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
