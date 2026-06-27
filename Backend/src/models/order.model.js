const pool = require('../db/db.js'); 

const createOrder = async (user_id, partner_id, category_id, address, price, platform_fee, items = [], service_date = null, service_slot = null, arrival_pref = null, arrival_note = null) => {
  const insertRes = await pool.query(
    `INSERT INTO orders (user_id, partner_id, category_id, address, price, platform_fee, items, service_date, service_slot, arrival_pref, arrival_note)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [user_id, partner_id, category_id, address, price, platform_fee, JSON.stringify(items), service_date, service_slot, arrival_pref, arrival_note]
  );

  const orderId = insertRes.rows[0].id;

  // Fetch the order back with the daily_sequence calculated
  const result = await pool.query(
    `SELECT *, (
       SELECT COUNT(*) + 1 
       FROM orders 
       WHERE created_at::date = o.created_at::date 
       AND created_at < o.created_at
     ) as daily_sequence 
     FROM orders o 
     WHERE id = $1`,
    [orderId]
  );

  return result.rows[0];
};

const getOrders = async () => {
  const result = await pool.query(
    "SELECT *, ROW_NUMBER() OVER (PARTITION BY created_at::date ORDER BY created_at ASC) as daily_sequence FROM orders ORDER BY created_at DESC"
  );
  return result.rows;
};

const getOrdersByUserId = async (user_id) => {
  // If user_id is not a number (e.g. "AMEC01"), return empty list instead of crashing
  if (isNaN(Number(user_id))) {
    return [];
  }
  const result = await pool.query(
    "SELECT *, ROW_NUMBER() OVER (PARTITION BY created_at::date ORDER BY created_at ASC) as daily_sequence FROM orders WHERE user_id = $1::int ORDER BY created_at DESC",
    [user_id]
  );
  return result.rows;
};

const updateOrder = async (id, status) => {
  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2::int RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

const getSyncDetails = async (key) => {
  let result;

  // Case A: Formatted ID (e.g., DHD-25.04-0001)
  const parts = key.split('-');
  if (parts.length >= 3) {
    const dateStr = parts[1]; // "25.04"
    const seqStr = parts[2];  // "0001"
    const sequence = parseInt(seqStr);

    const [day, month] = dateStr.split('.').map(n => parseInt(n));
    if (!isNaN(day) && !isNaN(month) && !isNaN(sequence)) {
      // Find the n-th order of that specific day
      // We use the current year as the year is not in the short ID
      const year = new Date().getFullYear();
      const targetDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      result = await pool.query(
        `WITH daily_orders AS (
           SELECT o.address, u.name, u.phone,
                  ROW_NUMBER() OVER (ORDER BY o.created_at ASC) as seq
           FROM orders o
           JOIN users u ON u.id = o.user_id
           WHERE o.created_at::date = $1::date
         )
         SELECT name, address, phone FROM daily_orders WHERE seq = $2`,
        [targetDate, sequence]
      );

      if (result.rows.length > 0) return result.rows[0];
    }
  }

  // Case B: Simple numeric ID or fallback
  const idMatch = key.match(/\d+/);
  if (idMatch && !key.includes('-')) {
    const idToSearch = parseInt(idMatch[0]);
    result = await pool.query(
      `SELECT u.name, o.address, u.phone 
       FROM orders o 
       JOIN users u ON u.id = o.user_id 
       WHERE o.id = $1`,
      [idToSearch]
    );
    if (result.rows.length > 0) return result.rows[0];
  }

  // Case C: Search by Phone (numeric check)
  const cleanPhone = key.replace(/\D/g, '');
  if (cleanPhone.length >= 10) {
    result = await pool.query(
      `SELECT u.name, o.address, u.phone 
       FROM users u 
       LEFT JOIN orders o ON o.user_id = u.id 
       WHERE u.phone LIKE $1 
       ORDER BY o.created_at DESC LIMIT 1`,
      [`%${cleanPhone}`]
    );
    if (result.rows.length > 0) return result.rows[0];
  }

  return null;
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByUserId,
  updateOrder,
  getSyncDetails,
};