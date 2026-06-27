const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const pool = require('../src/db/db.js');

async function main() {
  try {
    console.log("Altering 'orders' table to add arrival_pref and arrival_note...");
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS arrival_pref VARCHAR(50),
      ADD COLUMN IF NOT EXISTS arrival_note TEXT;
    `);
    console.log("Database altered successfully.");
    
    // Verify columns
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
    console.log("Updated columns in 'orders':", res.rows);
  } catch (err) {
    console.error("Error altering database:", err);
  } finally {
    await pool.end();
  }
}

main();
