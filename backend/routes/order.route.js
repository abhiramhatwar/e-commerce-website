const express = require("express");
const router = express.Router();
const order = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

//Protected routes
router.use(verifyToken);
router.get("/count", verifyAdmin, order.getCount); //Authorized Route

router.get("/user", order.getAll);
router.get("/user/count", order.getCount);
router.put("/user/:id", order.updateOne);
router.post("/", order.addOne);
router.get("/:id", order.getOne);

// Authorized Routes
router.use(verifyAdmin);

router.get("/", order.getAll);
router.put("/:id", order.updateOne);

module.exports = router;
