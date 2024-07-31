const Product = require("../models/product.model");
const Review = require("../models/review.model");
//For handling file upload
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Total items
exports.getCount = (req, res) => {
  // Check the filtered products
  let filter = req.query.filter;
  let search = req.query.search;
  const regex = new RegExp(search, "i");

  let query = {};
  query.name = { $regex: regex };
  if (filter && filter != "null" && filter != undefined) {
    filter = filter.split(" ");
    query.tags = { $in: filter };
  }

  Product.countDocuments(query)
    .then((data) => {
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Get products in pages
exports.getAll = (req, res) => {
  //For pagination and sorting
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const sort = parseInt(req.query.sort) || 1;

  // Check the filtered products
  let filter = req.query.filter;
  let search = req.query.search;
  const regex = new RegExp(search, "i");

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  let query = {};
  query.name = { $regex: regex };
  if (filter && filter != "null" && filter != undefined) {
    filter = filter.split(" ");
    query.tags = { $in: filter };
  }

  //Sorting and filtering
  Product.find(query)
    .sort({ createdAt: sort })
    .skip((page - 1) * limit)
    .limit(limit)
    .then((data) => {
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Get featured products
exports.getFeatured = (req, res) => {
  Product.find({ isFeatured: true })
    .then((data) => {
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Get one product with ID
exports.getOne = (req, res) => {
  const { id } = req.params;

  Product.findById({ _id: id })
    .then((data) => {
      if (!data) return res.status(400).json({ error: "Something went wrong!" });
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Add new product
exports.addOne = (req, res) => {
  const { name, price, description, imageUrl, stock, tags, isFeatured } = req.body;
  if (!name || !price || !description) return res.status(400).json({ error: "Please provide required fields" });

  const newProduct = new Product({
    name,
    price,
    description,
    imageUrl,
    stock,
    tags,
    isFeatured,
  });

  newProduct
    .save()
    .then((data) => {
      if (!data) return res.status(400).json({ error: "Something went wrong!" });
      return res.status(200).json({ message: `Added product successfuly! (${data._id})` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};

//Update one product with ID
exports.updateOne = (req, res) => {
  const { name, price, description, imageUrl, stock, tags, isFeatured } = req.body;
  const { id } = req.params;

  const updatedInfo = {
    name,
    price,
    description,
    imageUrl,
    stock,
    tags,
    isFeatured,
  };

  Product.findByIdAndUpdate(id, updatedInfo, { new: true, runValidators: true })
    .then((data) => {
      if (!data) return res.status(400).json({ error: "Something went wrong!" });
      return res.status(200).json({ message: `Updated product successfuly! (${data._id})` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};

//Delete one product with ID
exports.deleteOne = (req, res) => {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then((data) => {
      if (!data) return res.status(400).json({ error: "Something went wrong!" });
      return res.status(200).json({ message: `Deleted product successfuly! (${data._id})` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    });
};

exports.uploadImage = (req, res) => {
  const image = req.file;
  if (!image) return res.status(400).json({ error: "Please provide required fields" });

  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  //Upload to cloudinary and send the url back
  cloudinary.uploader
    .upload(image.path, options)
    .then((data) => {
      return res.status(200).json({ message: `File uploaded successfully`, url: data.secure_url });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    })
    .finally(() => {
      //Delete the locally stored file
      fs.unlink(image.path, (err) => {
        if (err) console.error(`Error deleting local file ${err}`);
      });
    });
};

// Add review for product
exports.addReview = (req, res) => {
  const { rating, comment } = req.body;
  const { user } = req;
  const { id } = req.params;

  if (!rating || !comment) return res.status(400).json({ error: "Please provide required fields" });

  const newReview = new Review({
    product: id,
    user,
    rating,
    comment,
  });

  Product.findById({ _id: id })
    .then((product) => {
      if (!product) {
        return res.status(400).json({ error: "Invalid product" });
      }

      newReview
        .save()
        .then(() => {
          // Calculate new rating for product
          const totalRating = product.averageRating * product.numberOfReviews + rating;
          const newNumberOfReviews = product.numberOfReviews + 1;

          product.averageRating = totalRating / newNumberOfReviews;
          product.numberOfReviews = newNumberOfReviews;

          product
            .save()
            .then(() => {
              res.status(200).json({ message: "Review added!" });
            })
            .catch((err) => {
              res.status(500).json({ error: `Server error ${err}` });
            });
        })
        .catch((err) => {
          res.status(500).json({ error: `Server error ${err}` });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: `Server error ${err}` });
    });
};

// Get all product reviews
exports.getProductReviews = async (req, res) => {
  const { id } = req.params;

  Review.find({ product: id })
    .populate("user", "firstname lastname")
    .then((reviews) => {
      return res.status(200).json({ message: reviews });
    })
    .catch((err) => {
      res.status(500).json({ error: `Server error ${err}` });
    });
};
