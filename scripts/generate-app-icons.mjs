#!/usr/bin/env node
/**
 * Generate app icons for mobile app.
 * 
 * This script provides instructions and a simple way to generate icons using
 * the react-native CLI or manual tools.
 * 
 * Usage: pnpm generate-app-icons
 *        pnpm generate-app-icons [source-image]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const MOBILE_DIR = path.join(rootDir, 'apps/mobile');
const ANDROID_RES_DIR = path.join(MOBILE_DIR, 'android/app/src/main/res');

const ANDROID_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

function checkImageMagick() {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function generateWithSharp(sourcePath) {
  const sharp = await import('sharp');
  
  console.log('Generating Android icons...');
  for (const [dir, size] of Object.entries(ANDROID_SIZES)) {
    const fullDir = path.join(ANDROID_RES_DIR, dir);
    ensureDir(fullDir);

    await sharp.default(sourcePath)
      .resize(size, size, { fit: 'cover' })
      .toFile(path.join(fullDir, 'ic_launcher.png'));

    await sharp.default(sourcePath)
      .resize(size, size, { fit: 'cover' })
      .toFile(path.join(fullDir, 'ic_launcher_round.png'));

    console.log(`  Created ${dir} (${size}x${size})`);
  }

  console.log('\nDone! Android icons generated.');
  console.log(`  Location: ${ANDROID_RES_DIR}/mipmap-*/`);
}

function generateWithImageMagick(sourcePath) {
  console.log('Generating Android icons with ImageMagick...');
  
  for (const [dir, size] of Object.entries(ANDROID_SIZES)) {
    const fullDir = path.join(ANDROID_RES_DIR, dir);
    ensureDir(fullDir);

    execSync(`convert "${sourcePath}" -resize ${size}x${size} "${path.join(fullDir, 'ic_launcher.png')}"`);
    execSync(`convert "${sourcePath}" -resize ${size}x${size} "${path.join(fullDir, 'ic_launcher_round.png')}"`);

    console.log(`  Created ${dir} (${size}x${size})`);
  }

  console.log('\nDone! Android icons generated.');
}

function printInstructions() {
  console.log(`
App Icon Generation
===================

To generate app icons, you need a source image (at least 1024x1024 pixels).

Option 1: Using ImageMagick (recommended)
-----------------------------------------
1. Install ImageMagick: brew install imagemagick
2. Run: pnpm generate-app-icons path/to/icon.png

Option 2: Using sharp (Node.js)
-----------------------------------------
1. Install sharp: pnpm add -w sharp
2. Run: pnpm generate-app-icons path/to/icon.png

Option 3: Manual (React Native CLI)
-----------------------------------------
1. Install @react-native-community/cli: pnpm add -w @react-native-community/cli
2. Create a 1024x1024 icon and run:
   npx react-native set-icon --path path/to/icon.png

Option 4: Online Tools
-----------------------------------------
Use any online React Native icon generator:
- https://appicon.co/
- https://www.appiconmaker.co/
- https://buildphone.com/app-icon-generator

Download the generated mipmap-* folders and replace:
  apps/mobile/android/app/src/main/res/mipmap-*/

For iOS, replace the Contents.json in:
  apps/mobile/ios/__TEMPLATE_APP_NAME_SLUG__/Images.xcassets/AppIcon.appiconset/
`);
}

function main() {
  const sourceArg = process.argv[2];
  
  if (!sourceArg) {
    const assetsDir = path.join(rootDir, 'assets');
    const possibleFiles = ['app-icon.png', 'app-icon.jpg', 'logo.svg', 'icon.png'];
    
    for (const file of possibleFiles) {
      const filePath = path.join(assetsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Found source image: ${filePath}\n`);
        main2(filePath);
        return;
      }
    }
    
    printInstructions();
    return;
  }

  const sourcePath = path.isAbsolute(sourceArg) ? sourceArg : path.join(rootDir, sourceArg);
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source image not found: ${sourcePath}`);
    process.exit(1);
  }

  main2(sourcePath);
}

function main2(sourcePath) {
  if (checkImageMagick()) {
    generateWithImageMagick(sourcePath);
  } else {
    import('sharp').then(() => generateWithSharp(sourcePath)).catch(() => {
      console.log('ImageMagick not found, sharp not available.');
      console.log('');
      printInstructions();
    });
  }
}

main();
