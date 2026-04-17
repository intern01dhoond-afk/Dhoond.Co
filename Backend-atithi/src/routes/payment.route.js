const express = require("express");
const router = express.Router();

const {
  createPaymentController,
  getPaymentsController,
  createRazorpayOrderController
} = require("../controllers/payment.controller");

router.post("/create", createPaymentController);
router.post("/razorpay-order", createRazorpayOrderController);
router.get("/all", getPaymentsController);

module.exports = router;