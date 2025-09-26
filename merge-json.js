import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const atrangiiFile = path.join(__dirname, 'src/assets/Atrangii-Scrapped.json');
const mooviFile = path.join(__dirname, 'src/assets/Moovi-Scrapped.json');
const shemarooFile = path.join(__dirname, 'src/assets/Shemaroo-scrapped.json');
const scrapedDataFile = path.join(__dirname, 'src/assets/scraped-data.json');

try {
  console.log('Reading JSON files...');
  
  // Read all JSON files
  const atrangiiData = JSON.parse(fs.readFileSync(atrangiiFile, 'utf8'));
  const mooviData = JSON.parse(fs.readFileSync(mooviFile, 'utf8'));
  const shemarooData = JSON.parse(fs.readFileSync(shemarooFile, 'utf8'));
  const existingData = JSON.parse(fs.readFileSync(scrapedDataFile, 'utf8'));
  
  console.log(`Atrangii data: ${atrangiiData.length} items`);
  console.log(`Moovi data: ${mooviData.length} items`);
  console.log(`Shemaroo data: ${shemarooData.length} items`);
  console.log(`Existing scraped data: ${existingData.length} items`);
  
  // Check if Atrangii data is already in existing data
  const hasAtrangiiData = existingData.some(item => item.advertiserName === "Atrangii");
  console.log(`Has Atrangii data already: ${hasAtrangiiData}`);
  
  // Merge all data
  const mergedData = [
    ...existingData,
    ...atrangiiData,
    ...mooviData,
    ...shemarooData
  ];
  
  console.log(`Total merged data: ${mergedData.length} items`);
  
  // Write merged data back to scraped-data.json
  fs.writeFileSync(scrapedDataFile, JSON.stringify(mergedData, null, 2));
  
  console.log('✅ Successfully merged all JSON files into scraped-data.json');
  console.log(`Final count: ${mergedData.length} total ad records`);
  
} catch (error) {
  console.error('❌ Error merging JSON files:', error.message);
  process.exit(1);
}
