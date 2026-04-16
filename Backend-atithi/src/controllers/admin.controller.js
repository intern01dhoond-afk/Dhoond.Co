const adminModel = require("../models/admin.model");

const getStatsController = async (req, res) => {
  try {
    const stats = await adminModel.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookingsController = async (req, res) => {
  try {
    const bookings = await adminModel.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBookingStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await adminModel.updateBookingStatus(req.params.id, status);
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assignPartnerController = async (req, res) => {
  try {
    const { partner_id } = req.body;
    if (!partner_id) return res.status(400).json({ error: 'partner_id is required' });
    const order = await adminModel.assignPartner(req.params.id, partner_id);
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStatsController, getBookingsController, updateBookingStatusController, assignPartnerController };
