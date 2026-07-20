const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const pool = require("../src/db/db");

async function check() {
  try {
    const res = await pool.query("SELECT id, title, category, image FROM services WHERE image LIKE '%.webp' OR image LIKE '%.webp' OR image LIKE '%.webp'");
    console.log("Services with PNG/JPG/JPEG images:");
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("DB Query error:", err.message);
    process.exit(1);
  }
}

check();
