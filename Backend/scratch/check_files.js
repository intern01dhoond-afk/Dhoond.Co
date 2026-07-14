const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');

const imagesToCheck = [
  'frontend/public/icons/playstore.png',
  'frontend/public/images/cart nav.webp',
  'frontend/src/assets/Kuruba Hemanth Kishore.webp',
  'frontend/src/assets/rahul_avatar.webp',
  'frontend/src/assets/sunita_avatar.webp',
  'frontend/public/images/hero_tech.webp',
  'frontend/public/logo.webp',
  'frontend/public/services/ac_gas_top_up.webp',
  'frontend/public/services/geyser.webp',
  'frontend/public/services/electrician_ceiling_fan_install.webp',
  'frontend/public/interior.webp',
  'frontend/public/images/vila.webp',
  'frontend/public/space.webp',
  'frontend/src/assets/Hero images/ac_hero.webp',
  'frontend/src/assets/Hero images/drill_hero.webp',
  'frontend/src/assets/Hero images/painter_hero.webp',
  'frontend/src/assets/Hero images/plumber_hero.webp'
];

console.log("Checking file existence and sizes...");
for (const relPath of imagesToCheck) {
  const fullPath = path.join(rootDir, relPath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    const stats = fs.statSync(fullPath);
    console.log(`[EXISTS] ${relPath} - Size: ${Math.round(stats.size / 1024)} KB`);
  } else {
    console.log(`[MISSING] ${relPath}`);
  }
}
