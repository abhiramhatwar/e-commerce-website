const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

// Total orders
exports.getCount = (req, res) => {
  const route = req.route.path;
  const { user } = req;

  if (route === "/count") {
    Order.countDocuments()
      .then((data) => {
        return res.status(200).json({ message: data });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  } else {
    Order.countDocuments({ user: user })
      .then((data) => {
        return res.status(200).json({ message: data });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  }
};

//Get all orders
exports.getAll = (req, res) => {
  //For pagination and sorting
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const sort = parseInt(req.query.sort) || 1;
  const route = req.route.path;
  const { user } = req;

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (route === "/") {
    //Sorting by date and populating the user and products fields
    Order.find()
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "firstname lastname email")
      .populate({
        path: "products._id",
        model: "Product",
        select: "name",
      })
      .then((data) => {
        return res.status(200).json({ message: data });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  } else {
    Order.find({ user: user })
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "firstname lastname email")
      .populate({
        path: "products._id",
        model: "Product",
        select: "name",
      })
      .then((data) => {
        return res.status(200).json({ message: data });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  }
};

//Get One order
exports.getOne = (req, res) => {
  const { user } = req;
  const { id } = req.params;

  Order.findById(id)
    .populate("user", "firstname lastname email")
    .populate({
      path: "products._id",
      model: "Product",
      select: "name price description imageUrl averageRating",
    })
    .then((data) => {
      if (!data) return res.status(404).json({ message: "Order Not found" });

      if (!(data.user._id.equals(user._id) || user.isAdmin)) return res.status(401).json({ error: "Unauthorized!" });
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Add new order
exports.addOne = (req, res) => {
  const { shipping, payment, paymentID, products } = req.body;
  const { user } = req;

  //Base shipping cost
  shipping.cost = 100;

  // Validations for empty fields
  if (
    products.length === 0 ||
    !payment ||
    !shipping ||
    !shipping.address.city ||
    !shipping.address.pincode ||
    !shipping.address.state ||
    !shipping.address.street
  )
    return res.status(400).json({ error: "Please provide required fields" });

  const totalCost = 0;

  const productIds = products.map((product) => product.product._id);
  const quantities = products.map((product) => product.quantity);

  //Check for valid products
  Product.find({ _id: { $in: productIds } })
    .then((data) => {
      if (data.length !== products.length) return res.status(400).json({ error: "Invalid products in order" });
      if (data.find((item) => item.stock === 0))
        return res.status(400).json({ error: "Out of stock products in order" });

      //Calculate total cost
      shipping.cost += quantities.reduce((sum, qty) => sum + qty, 0) * 20; // 20 per item shipping cost
      const totalCost = shipping.cost + data.reduce((sum, item, index) => sum + item.price * quantities[index], 0);

      //Place order
      const productsInfo = products.map((product) => {
        return {
          _id: product.product._id,
          quantity: product.quantity,
        };
      });
      const newOrder = new Order({
        shipping,
        payment,
        paymentID,
        totalCost,
        products: productsInfo,
        user,
      });

      newOrder
        .save()
        .then((data) => {
          if (!data) return res.status(400).json({ error: "Something went wrong!" });

          // Reduce product stock
          const updateStock = products.map((product) => {
            return Product.findByIdAndUpdate(
              product.product._id,
              { $inc: { stock: -product.quantity } },
              { new: true }
            ).exec();
          });

          Promise.all(updateStock)
            .then(() => {
              return res.status(200).json({ message: data._id });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Server error ${err}` });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};

//Update Order
exports.updateOne = (req, res) => {
  const { status, deliveryDate } = req.body;
  const { id } = req.params;
  const route = req.route.path;
  const { user } = req;

  if (route.includes === "/user") {
    const updatedInfo = {
      status,
    };
    Order.findByIdAndUpdate(id, updatedInfo, { new: true, runValidators: true })
      .then((data) => {
        if (!data) return res.status(400).json({ error: "Something went wrong!" });
        if (!(data.user._id.equals(user._id) || user.isAdmin)) return res.status(401).json({ error: "Unauthorized!" });
        return res.status(200).json({ message: `Updated product successfuly! (${data._id})` });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server error ${err}` });
      });
  } else {
    const updatedInfo = {
      status,
      deliveryDate,
    };
    Order.findByIdAndUpdate(id, updatedInfo, { new: true, runValidators: true })
      .then((data) => {
        if (!data) return res.status(400).json({ error: "Something went wrong!" });
        return res.status(200).json({ message: `Updated product successfuly! (${data._id})` });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server error ${err}` });
      });
  }
};
