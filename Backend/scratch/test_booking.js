const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const { createOrder, getOrders } = require('../src/models/order.model.js');
const { getAllBookings } = require('../src/models/admin.model.js');
const pool = require('../src/db/db.js');

async function main() {
  try {
    console.log("Creating a test user if not exists or using user ID 1...");
    // Let's check if user with ID 1 exists or create a temporary one
    let userId = 1;
    const userCheck = await pool.query("SELECT id FROM users LIMIT 1");
    if (userCheck.rows.length > 0) {
      userId = userCheck.rows[0].id;
    } else {
      const newUser = await pool.query(
        "INSERT INTO users (name, phone, role) VALUES ($1, $2, $3) RETURNING id",
        ["Test User", "9999999999", "customer"]
      );
      userId = newUser.rows[0].id;
      console.log("Created temporary user with ID:", userId);
    }

    console.log("Inserting a test order using createOrder...");
    const order = await createOrder(
      userId,
      null, // partner_id
      null, // category_id
      "123 Test Street, Nagpur", // address
      299, // price
      0, // platform_fee
      [{ id: 999, title: "Deep Cleaning Test Service", quantity: 1, price: 299 }], // items
      "Sunday, 28 June", // service_date
      "10:00 AM - 12:00 PM", // service_slot
      "call", // arrival_pref
      "9876543210" // arrival_note
    );

    console.log("Order created successfully:", order);

    console.log("Retrieving all bookings using getAllBookings...");
    const bookings = await getAllBookings();
    const createdBooking = bookings.find(b => b.id === order.id);

    if (createdBooking) {
      console.log("Booking found in admin reports!");
      console.log("Service Date:", createdBooking.service_date);
      console.log("Service Slot:", createdBooking.service_slot);
      console.log("Arrival Preference:", createdBooking.arrival_pref);
      console.log("Arrival Note:", createdBooking.arrival_note);

      if (
        createdBooking.service_date === "Sunday, 28 June" &&
        createdBooking.service_slot === "10:00 AM - 12:00 PM" &&
        createdBooking.arrival_pref === "call" &&
        createdBooking.arrival_note === "9876543210"
      ) {
        console.log("SUCCESS: All fields are correctly stored and retrieved!");
      } else {
        console.error("FAIL: Fields do not match!");
      }
    } else {
      console.error("FAIL: Booking not found in admin bookings query!");
    }

    // Clean up test order
    console.log("Cleaning up test order...");
    await pool.query("DELETE FROM orders WHERE id = $1", [order.id]);
    console.log("Cleanup done.");

  } catch (err) {
    console.error("Error during verification:", err);
  } finally {
    await pool.end();
  }
}

main();
