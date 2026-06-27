const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const pool = require('../src/db/db.js');

async function main() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
    console.log("Columns in 'orders':", res.rows);
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await pool.end();
  }
}

main();
