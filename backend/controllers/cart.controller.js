const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

//Return all carts
exports.getAll = (req, res) => {
  Cart.find()
    .then((carts) => {
      return res.status(200).json({ message: carts });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

// Get user cart
exports.getCart = (req, res) => {
  const { user } = req;
  Cart.findOne({ user: user })
    .populate({
      path: "products.product",
      model: "Product",
      select: "name price imageUrl stock",
    })
    .then((cart) => {
      if (!cart) return res.status(404).json({ error: "No cart found" });
      return res.status(200).json({ message: cart });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Add product to cart
exports.addProduct = (req, res) => {
  const { product, quantity } = req.body;
  const { user } = req;
  if (!product) return res.status(400).json({ error: "Please provide required fields" });
  if (quantity <= 0) return res.status(400).json({ error: "Invalid quantity" });
  //Check for valid products
  Product.findById(product)
    .then((productData) => {
      if (!productData) return res.status(400).json({ error: "Invalid product" });
      if (productData.stock === 0) return res.status(400).json({ error: "Out of stock product" });
      //Find if cart exists
      Cart.findOne({ user: user }).then((cart) => {
        if (!cart) {
          // Create new cart with the product
          const cartInfo = new Cart({
            products: { product: product, quantity },
            user,
          });
          cartInfo
            .save()
            .then((data) => {
              if (!data) return res.status(400).json({ error: "Something went wrong!" });
              return res.status(200).json({ message: `Added ${productData.name} to cart!` });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Server error ${err}` });
            });
        } else {
          // Update cart with the product
          const productIndex = cart.products.findIndex((prod) => prod.product == product);
          if (productIndex >= 0) {
            // Increment quantity if product already exists
            cart.products[productIndex].quantity += 1;
          } else {
            // Add new product
            cart.products.push({ product: product, quantity: quantity });
          }

          // Save the updated cart
          cart
            .save()
            .then((data) => {
              if (!data) return res.status(400).json({ error: "Something went wrong!" });
              return res.status(200).json({ message: `Added ${productData.name} to cart!` });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Server error ${err}` });
            });
        }
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};

//Update product quantity in cart
exports.updateQuantity = (req, res) => {
  const { quantity } = req.body;
  const { product } = req.params;
  const { user } = req;
  if (!product) return res.status(400).json({ error: "Please provide required fields" });
  if (quantity <= 0) return res.status(400).json({ error: "Invalid quantity" });
  //Check for valid products
  Product.findById(product)
    .then((data) => {
      if (!data) return res.status(400).json({ error: "Invalid product" });
      if (data.stock === 0 || data.stock < quantity) return res.status(400).json({ error: "Not enough stock!" });

      Cart.findOne({ user: user }).then((cart) => {
        if (!cart) return res.status(400).json({ error: "Invalid cart" });
        const productIndex = cart.products.findIndex((prod) => prod.product == product);
        if (productIndex < 0) return res.status(400).json({ error: "Invalid product" });

        cart.products[productIndex].quantity = quantity;
        cart
          .save()
          .then((data) => {
            if (!data) return res.status(400).json({ error: "Something went wrong!" });
            return res.status(200).json({ message: `Quantity updated!` });
          })
          .catch((err) => {
            return res.status(500).json({ error: `Server error ${err}` });
          });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};

//Remove product from cart
exports.removeProduct = (req, res) => {
  const { product } = req.params;
  const { user } = req;
  if (!product) return res.status(400).json({ error: "Please provide required fields" });

  //Check for product in cart
  Cart.findOne({ user: user }).then((cart) => {
    if (!cart) return res.status(400).json({ error: "Invalid cart" });
    const productIndex = cart.products.findIndex((prod) => prod.product == product);
    if (productIndex < 0) return res.status(400).json({ error: "Invalid product" });

    cart.products.splice(productIndex, 1);

    cart
      .save()
      .then((data) => {
        if (!data) return res.status(400).json({ error: "Something went wrong!" });
        return res.status(200).json({ message: `Product Removed!` });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server error ${err}` });
      });
  });
};

// Remove cart
exports.clearCart = (req, res) => {
  const { user } = req;
  Cart.findOneAndDelete({ user: user })
    .then((cart) => {
      if (!cart) return res.status(400).json({ error: "Invalid cart" });
      return res.status(200).json({ message: `Cart cleared!` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};
