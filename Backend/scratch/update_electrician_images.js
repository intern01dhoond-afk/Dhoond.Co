require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const updates = [
  { title: 'Ceiling Fan Installation', img: '/services/electrician_ceiling_fan_install.webp' },
  { title: 'Ceiling Fan Only Uninstallation', img: '/services/electrician_ceiling_fan_only_uninstall.webp' },
  { title: 'Ceiling Fan Reinstallation', img: '/services/electrician_ceiling_fan_reinstall.webp' },
  { title: 'Ceiling Fan Replacement', img: '/services/electrician_ceiling_fan_replacement.webp' },
  { title: 'Wall Fan Installation', img: '/services/wall_fan_installation_man.webp' },
  { title: 'Wall Fan Unistallation', img: '/services/wall_fan_uninstallation_.webp' },
  { title: 'Exhaust Fan Installation', img: '/services/exhaust_fan_install_uninstall.webp' },
  { title: 'Exhaust Fan Uninstallation', img: '/services/exhaust_fan_uninstall.webp' },
  { title: 'Switch Replacement', img: '/services/ac_switchbox_installation.webp' }, // fallback
  { title: 'Socket Replacement', img: '/services/socket_repair.webp' },
  { title: 'Holder Replacement', img: '/services/holder_replacement.webp' },
  { title: 'Switchbox Installation (3 point)', img: '/services/ac_switchbox_installation.webp' },
  { title: 'AC Switchbox Installation', img: '/services/ac_switchbox_installation.webp' },
  { title: 'Switchboard Installation (6 points)', img: '/services/switchboard_installation_6_points_.webp' },
  { title: 'Switchboard Repair (Only Switchboard inspection)', img: '/services/switchboard_repair_only_switchboard_inspection_.webp' },
  { title: 'New external wiring with casing (upto 5m)', img: '/services/external_wiring.webp' },
  { title: 'Wiring without casing (upto 5m)', img: '/services/external_wiring.webp' },
  { title: 'New internal wiring (upto 5m)', img: '/services/internal_wiring.webp' },
  { title: 'Doorbell installation', img: '/services/doorbell.webp' },
  { title: 'Doorbell replacement', img: '/services/doorbell_replacement.webp' },
  { title: 'Submeter installation', img: '/services/submeter.webp' },
  { title: 'Geyser installation', img: '/services/geyser.webp' },
  { title: 'Electrician Visit', img: '/services/electrician_visit.webp' },
  { title: 'Free Consultation On Call', img: '/services/free_consultation.webp' },
];

async function updateImages() {
  try {
    for (const u of updates) {
      await pool.query(
        'UPDATE services SET image = $1 WHERE title = $2 AND category = $3',
        [u.img, u.title, 'electrician']
      );
      console.log(`Updated image for: ${u.title}`);
    }
    console.log('Images updated successfully!');
  } catch (err) {
    console.error('Error updating images:', err);
  } finally {
    await pool.end();
  }
}

updateImages();
