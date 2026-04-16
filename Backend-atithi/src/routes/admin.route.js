const express = require("express");
const router  = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getStatsController,
  getBookingsController,
  updateBookingStatusController,
  assignPartnerController
} = require("../controllers/admin.controller");

// 🔒 All admin routes require verified admin role
router.use(adminAuth);

router.get("/stats",                      getStatsController);
router.get("/bookings",                   getBookingsController);
router.patch("/bookings/:id/status",      updateBookingStatusController);
router.put("/bookings/:id/partner",       assignPartnerController);

module.exports = router;
