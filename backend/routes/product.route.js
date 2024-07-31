const express = require("express");
const router = express.Router();
const product = require("../controllers/product.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const { verifyAdmin } = require("../middlewares/verifyAdmin");
const upload = require("../middlewares/uploadFile");

// Normal Routes
router.get("/", product.getAll);
router.get("/featured", product.getFeatured);
router.get("/count", product.getCount);
router.get("/:id", product.getOne);
router.get("/:id/reviews", product.getProductReviews);

// Protected Routes
router.use(verifyToken);
router.post("/:id/reviews", product.addReview);

// Authorized Routes
router.use(verifyAdmin);

router.post("/", product.addOne);
router.post("/upload", upload.single("image"), product.uploadImage);
router.put("/:id", product.updateOne);
router.delete("/:id", product.deleteOne);

module.exports = router;
