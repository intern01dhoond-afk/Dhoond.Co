const express = require("express");
const router = express.Router();

const {
  createOrderController,
  getOrdersController,
  updateOrderController,
  getSyncDetailsController,
  uploadPdfController,
  downloadPdfController,
} = require("../controllers/order.controller");

router.post("/create", createOrderController);
router.post("/update", updateOrderController);
router.get("/all", getOrdersController);
router.get("/sync/:key", getSyncDetailsController);
router.post("/upload-pdf", uploadPdfController);
router.get("/download-pdf/:ref", downloadPdfController);

module.exports = router;