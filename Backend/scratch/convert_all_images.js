const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const ROOT_DIR = path.join(__dirname, '../..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');

// 1. Copy small icons from assets/icons to public/icons to overwrite huge files
function copyIcons() {
  console.log('--- Copying Small Icons ---');
  const srcIconsDir = path.join(FRONTEND_DIR, 'src/assets/icons');
  const destIconsDir = path.join(FRONTEND_DIR, 'public/icons');

  if (!fs.existsSync(srcIconsDir)) {
    console.log('Source icons directory not found:', srcIconsDir);
    return;
  }
  if (!fs.existsSync(destIconsDir)) {
    fs.mkdirSync(destIconsDir, { recursive: true });
  }

  const icons = fs.readdirSync(srcIconsDir);
  for (const icon of icons) {
    if (icon.endsWith('.webp')) {
      const srcPath = path.join(srcIconsDir, icon);
      const destPath = path.join(destIconsDir, icon);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${icon} to public/icons`);
    }
  }
}

// Helper to recursively find files in a directory
function getFilesRecursively(dir, filterRegex) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(getFilesRecursively(filePath, filterRegex));
      }
    } else if (filterRegex.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

// 2. Convert PNG, JPG, JPEG to WebP
async function convertImages() {
  console.log('--- Converting Images to WebP ---');
  const searchDirs = [
    path.join(FRONTEND_DIR, 'src/assets'),
    path.join(FRONTEND_DIR, 'public')
  ];

  const imageRegex = /\.(png|jpg|jpeg)$/i;
  let convertedCount = 0;

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = getFilesRecursively(dir, imageRegex);
    console.log(`Found ${files.length} images in ${dir}`);

    for (const file of files) {
      const ext = path.extname(file);
      const outputPath = file.substring(0, file.length - ext.length) + '.webp';

      try {
        console.log(`Converting: ${path.relative(ROOT_DIR, file)} -> WebP`);
        await sharp(file)
          .webp({ quality: 80 })
          .toFile(outputPath);

        // Delete the original file
        fs.unlinkSync(file);
        convertedCount++;
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
      }
    }
  }
  console.log(`Successfully converted ${convertedCount} images to WebP.`);
}

// 3. Update Code References from .webp/.webp/.webp to .webp
function updateCodeReferences() {
  console.log('--- Updating Code References ---');
  const searchDirs = [
    path.join(FRONTEND_DIR, 'src'),
    path.join(ROOT_DIR, 'Backend') // Update backend files like seed_services.js too
  ];
  
  const codeFilesRegex = /\.(jsx|js|html|css|json)$/i;
  let updatedFilesCount = 0;

  // Include root HTML files as well
  let files = [
    path.join(ROOT_DIR, 'index.html'),
    path.join(ROOT_DIR, 'dhoond-painting.html'),
    path.join(ROOT_DIR, 'home_services_landing_page.html'),
    path.join(FRONTEND_DIR, 'index.html')
  ].filter(f => fs.existsSync(f));

  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      files = files.concat(getFilesRecursively(dir, codeFilesRegex));
    }
  }

  console.log(`Found ${files.length} code/markup files to inspect`);

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace extension references in strings/paths
    // We target: .webp, .webp, .webp case-insensitively, keeping correct WebP lowercase
    const newContent = content
      .replace(/\.webp\b/gi, '.webp')
      .replace(/\.webp\b/gi, '.webp')
      .replace(/\.webp\b/gi, '.webp');

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Updated references in: ${path.relative(ROOT_DIR, file)}`);
      updatedFilesCount++;
    }
  }
  console.log(`Updated ${updatedFilesCount} files.`);
}

// 4. Update Database references
async function updateDatabaseReferences() {
  console.log('--- Updating Database References ---');
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not defined in .env - skipping DB update.');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const resPng = await pool.query(
      "UPDATE services SET image = REPLACE(image, '.webp', '.webp') WHERE image LIKE '%.webp'"
    );
    const resJpg = await pool.query(
      "UPDATE services SET image = REPLACE(image, '.webp', '.webp') WHERE image LIKE '%.webp'"
    );
    const resJpeg = await pool.query(
      "UPDATE services SET image = REPLACE(image, '.webp', '.webp') WHERE image LIKE '%.webp'"
    );
    
    console.log(`DB Update completed:`);
    console.log(`  Updated ${resPng.rowCount} PNG rows`);
    console.log(`  Updated ${resJpg.rowCount} JPG rows`);
    console.log(`  Updated ${resJpeg.rowCount} JPEG rows`);
  } catch (err) {
    console.error('Error updating DB references:', err.message);
  } finally {
    await pool.end();
  }
}

async function run() {
  try {
    copyIcons();
    await convertImages();
    updateCodeReferences();
    await updateDatabaseReferences();
    console.log('\n🎉 Optimization complete!');
  } catch (err) {
    console.error('Migration script failed:', err);
  }
}

run();
