const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

// Icon sizes to generate
const sizes = [
  { name: 'icon-72.png', size: 72 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

async function generateIcons() {
  console.log('Generating PNG icons from SVG...');
  
  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n✓ All icons generated successfully!');
}

generateIcons();
