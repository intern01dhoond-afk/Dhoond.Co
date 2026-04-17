const pool = require("../db/db");

const upsertUser = async (phone, name) => {
  const result = await pool.query(
    `INSERT INTO users (phone, name) VALUES ($1, $2) ON CONFLICT (phone) DO UPDATE SET name = COALESCE(users.name, EXCLUDED.name) RETURNING *`,
    [phone, name || '']
  );
  return result.rows[0];
};

const storeOtp = async (phone, otp, expiryMinutes = 10) => {
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  await pool.query(
    `INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3)
     ON CONFLICT (phone) DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
    [phone, otp, expiresAt]
  );
};

const verifyAndDeleteOtp = async (phone, otp) => {
  // Check if OTP exists and is not expired
  const result = await pool.query(
    `SELECT * FROM otps WHERE phone = $1 AND otp = $2 AND expires_at > NOW()`,
    [phone, otp]
  );
  
  if (result.rows.length === 0) return false;
  
  // Clean up used OTP
  await pool.query(`DELETE FROM otps WHERE phone = $1`, [phone]);
  return true;
};

module.exports = { upsertUser, storeOtp, verifyAndDeleteOtp };
