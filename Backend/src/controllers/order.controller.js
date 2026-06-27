const orderModel = require("../models/order.model");
const pool = require("../db/db.js");


const createOrderController = async (req, res) => {
  try {
    const {
      user_id,
      partner_id,
      category_id,
      address,
      price,
      platform_fee,
      items,
      service_date,
      service_slot,
      arrival_pref,
      arrival_note,
      customer_name
    } = req.body;

    if (!user_id || !address) {
      return res.status(400).json({
        success: false,
        message: "user_id and address are required",
      });
    }

    const sanitizedUserId = user_id === 'AMEC01' ? 1 : user_id;

    if (customer_name) {
      try {
        await pool.query("UPDATE users SET name = $1 WHERE id = $2", [customer_name, sanitizedUserId]);
      } catch (err) {
        console.error("[Backend] Failed to update customer name:", err.message);
      }
    }

    const order = await orderModel.createOrder(
      sanitizedUserId,
      partner_id,
      category_id,
      address,
      price,
      platform_fee,
      items || [],
      service_date,
      service_slot,
      arrival_pref,
      arrival_note
    );

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.getOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderController = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: "id and status are required" });
    }
    const order = await orderModel.updateOrder(id, status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSyncDetailsController = async (req, res) => {
  try {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({ success: false, message: "key is required" });
    }
    const data = await orderModel.getSyncDetails(key);
    if (!data) {
      return res.status(404).json({ success: false, message: "No records found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadPdfController = async (req, res) => {
  try {
    const { pdfBase64, filename } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({ success: false, message: "pdfBase64 is required" });
    }

    // Ensure database table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quotation_pdfs (
        ref VARCHAR(255) PRIMARY KEY,
        pdf_base64 TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Extract reference key from filename: Dhoond_Quotation_PQP-20260518-133.pdf -> PQP-20260518-133
    const refMatch = filename.match(/Dhoond_Quotation_(.*?)\.pdf/);
    const ref = refMatch ? refMatch[1] : `Q-${Date.now()}`;

    // Save/upsert the PDF in the database
    await pool.query(`
      INSERT INTO quotation_pdfs (ref, pdf_base64)
      VALUES ($1, $2)
      ON CONFLICT (ref) DO UPDATE SET pdf_base64 = $2
    `, [ref, pdfBase64]);

    const downloadUrl = `https://dhoond-backend-684217984422.us-central1.run.app/api/V1/orders/download-pdf/${ref}`;
    
    res.status(200).json({ success: true, downloadUrl });
  } catch (error) {
    console.error('Server-side upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const downloadPdfController = async (req, res) => {
  try {
    const { ref } = req.params;
    
    // Ensure database table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quotation_pdfs (
        ref VARCHAR(255) PRIMARY KEY,
        pdf_base64 TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await pool.query('SELECT pdf_base64 FROM quotation_pdfs WHERE ref = $1', [ref]);
    if (result.rows.length === 0) {
      return res.status(404).send('Quotation PDF not found');
    }

    const pdfBase64 = result.rows[0].pdf_base64;
    
    // Strip base64 metadata prefix if present generically
    const base64Data = pdfBase64.replace(/^data:.*?;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Quotation_${ref}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createOrderController,
  getOrdersController,
  updateOrderController,
  getSyncDetailsController,
  uploadPdfController,
  downloadPdfController,
};