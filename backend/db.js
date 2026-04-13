const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'dhoond.db');
const db = new sqlite3.Database(dbPath);

// Initialize DB schema
db.serialize(() => {
  // Services Table
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    originalPrice REAL,
    discountPrice REAL,
    discountTag TEXT,
    description TEXT,
    image TEXT
  )`);

  // Bookings Table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT,
    phone TEXT,
    address TEXT,
    totalAmount REAL,
    status TEXT DEFAULT 'Pending',
    paymentStatus TEXT DEFAULT 'Unpaid',
    paymentId TEXT,
    startOtp TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Booking Items Table
  db.run(`CREATE TABLE IF NOT EXISTS booking_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookingId INTEGER,
    serviceId INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(bookingId) REFERENCES bookings(id),
    FOREIGN KEY(serviceId) REFERENCES services(id)
  )`);

  // Seed data if empty
  db.get('SELECT COUNT(*) as count FROM services', (err, row) => {
    if (row && row.count === 0) {
      console.log('Seeding initial services...');
      const stmt = db.prepare(`INSERT INTO services (title, category, originalPrice, discountPrice, discountTag, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)`);
      
      const seedData = [
        // ── Electrician ───────────────────────────────────────────────
        ['Ceiling Fan Installation', 'electrician', 399, 299, '25% OFF', 'Professional installation of ceiling fan.', '/ac_tech.png'],
        ['Switch / Socket Replacement', 'electrician', 299, 199, '33% OFF', 'Safe replacement of switches or plug sockets.', '/ac_tech.png'],
        ['Submeter Installation', 'electrician', 599, 449, '25% OFF', 'Electric sub-meter installation.', '/ac_tech.png'],
        ['Inverter Repair & Diagnostics', 'electrician', 499, 399, '20% OFF', 'Diagnostics and repair for home and office power inverters.', '/ac_tech.png'],
        ['MCB Box Installation/Repair', 'electrician', 899, 699, '22% OFF', 'Safe installation or troubleshooting of Main Circuit Breaker boxes.', '/ac_tech.png'],
        ['House Wiring Checkup', 'electrician', 499, 299, '40% OFF', 'Complete diagnostic check of home electrical wiring to prevent short circuits.', '/ac_tech.png'],
        ['Decorative Light Installation', 'electrician', 499, 349, '30% OFF', 'Fixing and wiring chandeliers, wall brackets, or profile lights.', '/ac_tech.png'],

        // ── Technician ────────────────────────────────────────────────
        ['AC Cleaning Service (Jet+Water)', 'technician', 699, 499, '29% OFF', 'High-pressure jet and water cleaning for AC indoor unit, filters, and coils.', '/ac_installation.jpg'],
        ['AC Installation (Split)', 'technician', 1499, 999, '33% OFF', 'Professional installation of split AC indoor and outdoor units.', '/ac_installation.jpg'],
        ['AC Uninstallation (Split)', 'technician', 799, 499, '37% OFF', 'Safe removal and disconnection of split AC units.', '/ac_installation.jpg'],
        ['Geyser Repair & Installation', 'technician', 799, 599, '25% OFF', 'Expert installation or thermostat repair of water heater geysers.', '/ac_tech.png'],
        ['RO Servicing & Filter Change', 'technician', 599, 449, '25% OFF', 'Servicing and filter replacement for RO water purifiers.', '/ac_tech.png'],
        ['Washing Machine Repair', 'technician', 899, 699, '22% OFF', 'Fixing drum, motor, or drainage issues in washing machines.', '/ac_tech.png'],
        ['Refrigerator Gas Refill', 'technician', 1599, 1299, '18% OFF', 'Gas refilling and cooling check for single and double door refrigerators.', '/ac_tech.png'],
        ['TV Wall Mounting', 'technician', 499, 349, '30% OFF', 'Secure wall mounting setup for LED/LCD TVs up to 65 inch.', '/ac_tech.png'],
        ['Microwave Oven Repair', 'technician', 599, 399, '33% OFF', 'Magnetron replacement and keypad fixes for all microwave brands.', '/ac_tech.png'],

        // ── Plumber ───────────────────────────────────────────────────
        ['Bathroom Drain Unclogging', 'plumber', 399, 249, '37% OFF', 'Clearing severe clogs and blockages in bathroom drains and pipes.', '/ac_tech.png'],
        ['Sink Faucet Replacement', 'plumber', 299, 199, '33% OFF', 'Replacement and sealing of kitchen or basin faucets.', '/ac_tech.png'],
        ['Water Tank Deep Cleaning', 'plumber', 1199, 899, '25% OFF', 'Deep mechanical and chemical cleaning of overhead water tanks.', '/ac_tech.png'],
        ['Toilet Seat Repair/Replacement', 'plumber', 799, 599, '25% OFF', 'Changing western toilet seats, flush tanks, or fixing leakages.', '/ac_tech.png'],
        ['Concealed Pipeline Leak Fix', 'plumber', 1499, 1199, '20% OFF', 'Detecting and fixing water leaks inside walls without damaging tiles if possible.', '/ac_tech.png'],
        ['Shower & Mixer Installation', 'plumber', 499, 349, '30% OFF', 'Installing bathroom diverters, shower heads, or hot/cold mixers.', '/ac_tech.png'],

        // ── Painter ───────────────────────────────────────────────────
        ['1 BHK Full Painting (Interior)', 'painter', 8999, 6999, '22% OFF', 'Complete interior wall and ceiling painting for 1 BHK homes.', '/ac_tech.png'],
        ['2 BHK Full Painting (Interior)', 'painter', 14999, 11999, '20% OFF', 'Premium tractor or royale emulsion painting for a 2 BHK setup.', '/ac_tech.png'],
        ['Touch up Painting (Spot Fix)', 'painter', 2499, 1899, '24% OFF', 'Patching up peeling walls, damp spots, or small damage areas.', '/ac_tech.png'],
        ['Exterior Wall Painting (Single)', 'painter', 5999, 4499, '25% OFF', 'Weather-proof exterior painting for a single outer wall/balcony.', '/ac_tech.png'],
        ['Wood Polishing & Varnish', 'painter', 3499, 2699, '23% OFF', 'Sanding and polishing for doors, windows, or wooden furniture.', '/ac_tech.png'],

        // ── Pest Control ──────────────────────────────────────────────
        ['Cockroach Pest Control', 'pest-control', 1299, 999, '23% OFF', 'Intensive spray and gel pest control specifically targeting cockroaches.', '/ac_tech.png'],
        ['Termite Treatment', 'pest-control', 3499, 2899, '17% OFF', 'Professional drill-and-inject termite extermination for furniture and walls.', '/ac_tech.png'],
        ['Bed Bug Extermination', 'pest-control', 1899, 1499, '21% OFF', 'Dual-spray treatment to completely remove bedbugs from mattresses and frames.', '/ac_tech.png']
      ];

      seedData.forEach(data => stmt.run(data));
      stmt.finalize();
    }
  });
});

module.exports = db;
