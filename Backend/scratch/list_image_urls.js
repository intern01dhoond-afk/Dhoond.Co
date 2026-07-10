const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const pool = require("../src/db/db");

async function check() {
  try {
    const res = await pool.query("SELECT DISTINCT image FROM services");
    console.log("Distinct service image paths:");
    console.log(JSON.stringify(res.rows.map(r => r.image), null, 2));
    process.exit(0);
  } catch (err) {
    console.error("DB Query error:", err.message);
    process.exit(1);
  }
}

check();
