const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dhoond.db');
const db = new sqlite3.Database(dbPath);

console.log('Clearing services table...');
db.serialize(() => {
  db.run('DELETE FROM services', (err) => {
    if (err) {
      console.error('Error clearing services:', err);
    } else {
      console.log('Services cleared.');
      // Re-seed logic directly here
      console.log('Seeding new services...');
      const stmt = db.prepare(`INSERT INTO services (title, category, originalPrice, discountPrice, discountTag, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)`);
      
      const seedData = [
        // ── Electrician ───────────────────────────────────────────────
        ['Ceiling Fan Installation', 'electrician', 249, 149, '40% OFF', 'Professional secure installation of ceiling fan.', '/services/Electrician Ceiling Fan Install.png'],
        ['Ceiling Fan Uninstallation', 'electrician', 149, 99, '33% OFF', 'Safe removal and unmounting of ceiling fan.', '/services/Electrician Ceiling Fan Uninstall.png'],
        ['Ceiling Fan Reinstallation', 'electrician', 349, 249, '28% OFF', 'Uninstallation and safe reinstallation of a ceiling fan.', '/services/Electrician Ceiling Fan Reinstall.png'],
        ['Ceiling Fan Replacement', 'electrician', 349, 249, '28% OFF', 'Remove old ceiling fan and install a new unit.', '/services/Electrician Ceiling Fan Replacement.png'],
        ['Wall Fan Installation', 'electrician', 199, 129, '35% OFF', 'Secure mounting and wiring of wall fans.', '/services/Wall Fan Installation man.png'],
        ['Wall Fan Uninstallation', 'electrician', 129, 89, '31% OFF', 'Safe unmounting and removal of wall fans.', '/services/Wall Fan Uninstallation .png'],
        ['Exhaust Fan Installation', 'electrician', 199, 149, '25% OFF', 'Fitting and wiring exhaust fans in kitchens or bathrooms.', '/services/Exhaust Fan Install-Uninstall.png'],
        ['Exhaust Fan Uninstallation', 'electrician', 149, 99, '33% OFF', 'Removing old or faulty exhaust fans safely.', '/services/Exhaust Fan Uninstall.png'],
        ['Switch / Socket Replacement', 'electrician', 299, 199, '33% OFF', 'Safe replacement of switches or plug sockets.', '/services/socket repair.png'],
        ['Submeter Installation', 'electrician', 599, 449, '25% OFF', 'Electric sub-meter installation.', '/services/Submeter.png'],
        ['Inverter Repair & Diagnostics', 'electrician', 499, 399, '20% OFF', 'Diagnostics and repair for home and office power inverters.', '/services/Electrical Repair Technician.png'],
        ['MCB Box Installation/Repair', 'electrician', 899, 699, '22% OFF', 'Safe installation or troubleshooting of Main Circuit Breaker boxes.', '/services/switch board repair.png'],
        ['House Wiring Checkup', 'electrician', 499, 299, '40% OFF', 'Complete diagnostic check of home electrical wiring to prevent short circuits.', '/services/internal wiring.png'],
        ['Full Room Wiring Replacement', 'electrician', 3999, 2499, '37% OFF', 'Complete rewiring for a single room using premium cables.', '/services/External Wiring.png'],
        ['Decorative Light Installation', 'electrician', 499, 349, '30% OFF', 'Fixing and wiring chandeliers, wall brackets, or profile lights.', '/services/Electrical lighting Technician.png'],
        ['Door Bell Installation', 'electrician', 249, 149, '40% OFF', 'Wiring and mounting of wired or wireless doorbells.', '/services/doorbell.png'],
        ['Geyser Repair & Installation', 'electrician', 799, 599, '25% OFF', 'Expert installation or thermostat repair of water heater geysers.', '/services/Geyser.png'],

        // ── Technician ────────────────────────────────────────────────
        ['AC Cleaning Service (Jet+Water)', 'technician', 699, 499, '29% OFF', 'High-pressure jet and water cleaning for AC indoor unit, filters, and coils.', '/services/Ac tachnician jet water.png'],
        ['AC Cleaning Service (Jet+Foam)', 'technician', 899, 649, '28% OFF', 'Premium foam-based deep cleaning with jet spray for thorough AC maintenance.', '/services/Ac tachnician foam  jet water.png'],
        ['AC Installation (Split)', 'technician', 1499, 999, '33% OFF', 'Professional installation of split AC indoor and outdoor units with copper piping.', '/services/AC Installation Uninstallation.png'],
        ['AC Uninstallation (Split)', 'technician', 799, 499, '37% OFF', 'Safe removal and disconnection of split AC units.', '/services/AC Uninstallation split.png'],
        ['AC Reinstallation', 'technician', 1799, 1299, '28% OFF', 'Complete uninstallation and reinstallation of AC at a new location.', '/services/AC ReInstallation.png'],
        ['AC Inspection (Visit)', 'technician', 299, 149, '50% OFF', 'On-site AC checkup and diagnostic visit by certified technician.', '/services/AC Inspection.png'],
        ['AC Gas Top Up', 'technician', 1499, 999, '33% OFF', 'Refrigerant gas top-up to restore optimal cooling performance.', '/services/AC Gas top up.png'],
        ['AC No Cooling/Gas Issues', 'technician', 999, 699, '30% OFF', 'Diagnosis and repair of cooling failure, gas leak, or compressor issues.', '/services/AC Gas repair.png'],
        ['AC Installation (Window)', 'technician', 999, 699, '30% OFF', 'Secure installation of window AC units with proper sealing and drainage.', '/services/AC nstall Uninstall (Window).png'],
        ['AC Uninstallation (Window)', 'technician', 599, 399, '33% OFF', 'Safe removal of window AC units without wall damage.', '/services/AC Uninstallation (Window).png'],
        ['AC Outdoor Unit Re-Installation', 'technician', 1299, 899, '31% OFF', 'Repositioning and reinstalling the outdoor condenser unit.', '/services/AC nstall Uninstall (outdoor).png'],
        ['Normal AC Service + Cleaning', 'technician', 499, 349, '30% OFF', 'Basic AC servicing with filter cleaning and performance check.', '/services/AC Repair.png'],
        ['RO Servicing & Filter Change', 'technician', 599, 449, '25% OFF', 'Servicing and filter replacement for RO water purifiers.', '/services/water purifier.png'],
        ['Washing Machine Repair', 'technician', 899, 699, '22% OFF', 'Fixing drum, motor, or drainage issues in washing machines.', '/services/washing machine.png'],
        ['Refrigerator Gas Refill', 'technician', 1599, 1299, '18% OFF', 'Gas refilling and cooling check for single and double door refrigerators.', '/services/Refrigarator.png'],
        ['TV Wall Mounting', 'technician', 499, 349, '30% OFF', 'Secure wall mounting setup for LED/LCD TVs up to 65 inch.', '/services/TV Technician.png'],
        ['Microwave Oven Repair', 'technician', 599, 399, '33% OFF', 'Magnetron replacement and keypad fixes for all microwave brands.', '/services/Microwave Oven.png'],

        // ── Plumber ───────────────────────────────────────────────────
        ['Bathroom Drain Unclogging', 'plumber', 399, 249, '37% OFF', 'Clearing severe clogs and blockages in bathroom drains and pipes.', '/services/plumber.png'],
        ['Sink Faucet Replacement', 'plumber', 299, 199, '33% OFF', 'Replacement and sealing of kitchen or basin faucets.', '/services/plumber.png'],
        ['Water Tank Deep Cleaning', 'plumber', 1199, 899, '25% OFF', 'Deep mechanical and chemical cleaning of overhead water tanks.', '/services/plumber.png'],
        ['Toilet Seat Repair/Replacement', 'plumber', 799, 599, '25% OFF', 'Changing western toilet seats, flush tanks, or fixing leakages.', '/services/plumber.png'],
        ['Concealed Pipeline Leak Fix', 'plumber', 1499, 1199, '20% OFF', 'Detecting and fixing water leaks inside walls without damaging tiles if possible.', '/services/plumber.png'],
        ['Shower & Mixer Installation', 'plumber', 499, 349, '30% OFF', 'Installing bathroom diverters, shower heads, or hot/cold mixers.', '/services/plumber.png'],

        // ── Painter ───────────────────────────────────────────────────
        ['1 BHK Full Painting (Interior)', 'painter', 8999, 6999, '22% OFF', 'Complete interior wall and ceiling painting for 1 BHK homes.', '/services/Interior painter.png'],
        ['2 BHK Full Painting (Interior)', 'painter', 14999, 11999, '20% OFF', 'Premium tractor or royale emulsion painting for a 2 BHK setup.', '/services/House Painter.png'],
        ['Touch up Painting (Spot Fix)', 'painter', 2499, 1899, '24% OFF', 'Patching up peeling walls, damp spots, or small damage areas.', '/services/Touch-Up Painter.png'],
        ['Exterior Wall Painting (Single)', 'painter', 5999, 4499, '25% OFF', 'Weather-proof exterior painting for a single outer wall/balcony.', '/services/Exterior Painter.png'],
        ['Wood Polishing & Varnish', 'painter', 3499, 2699, '23% OFF', 'Sanding and polishing for doors, windows, or wooden furniture.', '/services/Wood Polisher.png'],

        // ── Pest Control ──────────────────────────────────────────────
        ['Cockroach Pest Control', 'pest-control', 1299, 999, '23% OFF', 'Intensive spray and gel pest control specifically targeting cockroaches.', '/services/Cleaners (Industrial-Commercial).png'],
        ['Termite Treatment', 'pest-control', 3499, 2899, '17% OFF', 'Professional drill-and-inject termite extermination for furniture and walls.', '/services/Cleaners (Industrial-Commercial).png'],
        ['Bed Bug Extermination', 'pest-control', 1899, 1499, '21% OFF', 'Dual-spray treatment to completely remove bedbugs from mattresses and frames.', '/services/Cleaners (Industrial-Commercial).png']
      ];

      seedData.forEach(data => stmt.run(data));
      stmt.finalize((err) => {
        if (!err) console.log('Successfully reseeded DB with updated services!');
        db.close();
      });
    }
  });
});
