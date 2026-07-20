require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const acImageUpdates = [
  { title: 'AC Inspection (Visit)', img: '/services/ac_inspection.webp' },
  { title: 'Normal AC Service + Cleaning', img: '/services/ac_repair.webp' },
  { title: 'AC Service (Jet + Water)', img: '/services/ac_tachnician_jet_water.webp' },
  { title: 'AC Service (Jet + Foam)', img: '/services/ac_tachnician_foam_jet_water.webp' },
  { title: 'AC Gas Top-up', img: '/services/ac_gas_top_up.webp' },
  { title: 'AC Gas Refill', img: '/services/ac_gas_repair.webp' },
  { title: 'Split AC Installation', img: '/services/ac_installation_uninstallation.webp' },
  { title: 'Window AC Installation', img: '/services/ac_nstall_uninstall_window_.webp' },
  { title: 'Split AC Uninstallation', img: '/services/ac_uninstallation_split.webp' },
  { title: 'Window AC Uninstallation', img: '/services/ac_uninstallation_window_.webp' },
  { title: 'AC Re-installation', img: '/services/ac_reinstallation.webp' },
  { title: 'AC Outdoor Unit Re-Installation', img: '/services/ac_nstall_uninstall_outdoor_.webp' },
];

async function updateExactACImages() {
  try {
    for (const u of acImageUpdates) {
      await pool.query(
        'UPDATE services SET image = $1 WHERE title = $2 AND category = $3',
        [u.img, u.title, 'technician']
      );
      console.log(`Updated exact image for: ${u.title}`);
    }
    console.log('All AC images updated with exact SKU matches!');
  } catch (err) {
    console.error('Error updating images:', err);
  } finally {
    await pool.end();
  }
}

updateExactACImages();
