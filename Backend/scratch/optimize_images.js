const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '../..');

const imagesToOptimize = [
  { relPath: 'frontend/public/icons/playstore.png', targetWidth: 360, targetHeight: 120, isSquare: false, format: 'png' },
  { relPath: 'frontend/public/images/cart nav.webp', targetWidth: 360, isSquare: false, format: 'webp' },
  { relPath: 'frontend/src/assets/Kuruba Hemanth Kishore.webp', targetWidth: 80, targetHeight: 80, isSquare: true, format: 'webp' },
  { relPath: 'frontend/src/assets/rahul_avatar.webp', targetWidth: 80, targetHeight: 80, isSquare: true, format: 'webp' },
  { relPath: 'frontend/src/assets/sunita_avatar.webp', targetWidth: 80, targetHeight: 80, isSquare: true, format: 'webp' },
  { relPath: 'frontend/public/images/hero_tech.webp', targetWidth: 600, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/logo.webp', targetWidth: 260, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/services/ac_gas_top_up.webp', targetWidth: 520, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/services/geyser.webp', targetWidth: 520, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/services/electrician_ceiling_fan_install.webp', targetWidth: 520, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/interior.webp', targetWidth: 520, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/images/vila.webp', targetWidth: 520, isSquare: false, format: 'webp' },
  { relPath: 'frontend/public/space.webp', targetWidth: 520, isSquare: false, format: 'webp' },
  { relPath: 'frontend/src/assets/Hero images/ac_hero.webp', targetWidth: 613, isSquare: false, format: 'webp' },
  { relPath: 'frontend/src/assets/Hero images/drill_hero.webp', targetWidth: 613, isSquare: false, format: 'webp' },
  { relPath: 'frontend/src/assets/Hero images/painter_hero.webp', targetWidth: 613, isSquare: false, format: 'webp' },
  { relPath: 'frontend/src/assets/Hero images/plumber_hero.webp', targetWidth: 613, isSquare: false, format: 'webp' }
];

async function optimizeImage(task) {
  const fullPath = path.join(rootDir, task.relPath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return;
  }
  
  console.log(`Processing: ${task.relPath}...`);
  try {
    const originalSize = fs.statSync(fullPath).size;
    
    // Read the file into a Node.js Buffer
    const inputBuffer = fs.readFileSync(fullPath);
    
    // Instantiate sharp with the buffer rather than the path string
    const instance = sharp(inputBuffer);
    const metadata = await instance.metadata();
    
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    
    // If the image is already smaller than or equal to target, skip or just re-compress
    if (originalWidth <= task.targetWidth && !task.isSquare) {
      console.log(`  Skipping resize for ${task.relPath} (current width ${originalWidth} <= target ${task.targetWidth})`);
      return;
    }
    
    let pipeline = instance;
    if (task.isSquare && task.targetHeight) {
      pipeline = pipeline.resize(task.targetWidth, task.targetHeight, { fit: 'cover' });
    } else if (task.targetHeight) {
      pipeline = pipeline.resize(task.targetWidth, task.targetHeight);
    } else {
      pipeline = pipeline.resize(task.targetWidth);
    }
    
    if (task.format === 'png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    } else {
      pipeline = pipeline.webp({ quality: 75 });
    }
    
    const outputBuffer = await pipeline.toBuffer();
    fs.writeFileSync(fullPath, outputBuffer);
    
    const newSize = fs.statSync(fullPath).size;
    console.log(`  Done: ${originalWidth}x${originalHeight} -> ${task.targetWidth}x${task.isSquare ? task.targetHeight : Math.round(originalHeight * (task.targetWidth / originalWidth))}. Size: ${Math.round(originalSize / 1024)} KB -> ${Math.round(newSize / 1024)} KB`);
  } catch (err) {
    console.error(`  Error processing ${task.relPath}:`, err.message);
  }
}

async function main() {
  console.log("Starting image optimization process with Sharp Buffer...");
  for (const task of imagesToOptimize) {
    await optimizeImage(task);
  }
  console.log("All images processed successfully!");
}

main();
