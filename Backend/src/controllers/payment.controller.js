const paymentModel = require("../models/payment.model");
const razorpay = require("../utils/razorpay");

const createRazorpayOrderController = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in Rupees
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order_id: order.id });
  } catch (error) {
    console.error("[Razorpay Order Error]", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPaymentController = async (req, res) => {
  try {
    const {
      order_id,
      amount,
      payment_method,
      payment_status,
      transaction_id,
    } = req.body;

    if (!amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "amount and payment_method are required",
      });
    }

    const payment = await paymentModel.createPayment(
      order_id,
      amount,
      payment_method,
      payment_status || "pending",
      transaction_id
    );

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "transaction_id already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentsController = async (req, res) => {
  try {
    const payments = await paymentModel.getPayments();

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentController,
  getPaymentsController,
  createRazorpayOrderController
};