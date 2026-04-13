const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all services
app.get('/api/services', (req, res) => {
  const { category, search } = req.query;
  
  let query = 'SELECT * FROM services WHERE 1=1';
  let params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'An internal error occurred.' });
    }
    res.json(rows);
  });
});

// Get a single service by ID
app.get('/api/services/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM services WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'An internal error occurred.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(row);
  });
});

// Create a booking (Checkout)
app.post('/api/bookings', (req, res) => {
  const { customerName, phone, address, items } = req.body;
  
  if (!items || !items.length || !customerName || !phone || !address) {
    return res.status(400).json({ error: 'Missing required booking details' });
  }

  // Security: Calculate totalAmount on server instead of trusting client
  // First, get all service IDs from the request
  const serviceIds = items.map(item => item.id);
  const placeholders = serviceIds.map(() => '?').join(',');

  db.all(`SELECT id, discountPrice FROM services WHERE id IN (${placeholders})`, serviceIds, (err, services) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'An internal error occurred.' });
    }

    let serverCalculatedTotal = 0;
    const priceMap = {};
    services.forEach(s => { priceMap[s.id] = s.discountPrice; });

    items.forEach(item => {
      const price = priceMap[item.id] || 0;
      serverCalculatedTotal += price * item.quantity;
    });

    db.run(`INSERT INTO bookings (customerName, phone, address, totalAmount) VALUES (?, ?, ?, ?)`, 
      [customerName, phone, address, serverCalculatedTotal], 
      function(err) {
        if (err) {
          console.error('Database Error:', err);
          return res.status(500).json({ error: 'Failed to process booking.' });
        }
        
        const bookingId = this.lastID;
        const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Insert all cart items for this booking
        const stmt = db.prepare(`INSERT INTO booking_items (bookingId, serviceId, quantity, price) VALUES (?, ?, ?, ?)`);
        items.forEach(item => {
          const price = priceMap[item.id] || 0;
          stmt.run([bookingId, item.id, item.quantity, price]);
        });
        stmt.finalize();

        res.status(201).json({
          message: 'Booking successful',
          bookingId: `BK-${bookingId.toString().padStart(4, '0')}`,
          startOtp: startOtp,
          estimatedArrival: '15 Minutes'
        });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
