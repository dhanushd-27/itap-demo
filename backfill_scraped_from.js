import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const scrapedDataPath = path.join(__dirname, 'src/assets/scraped-data.json');
  if (!fs.existsSync(scrapedDataPath)) {
    throw new Error(`Missing file: ${scrapedDataPath}`);
  }

  const content = fs.readFileSync(scrapedDataPath, 'utf8');
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error('Expected scraped-data.json to be an array');
  }

  let updated = 0;
  const result = data.map((item) => {
    const advertiser = (item?.advertiserName || '').toLowerCase();
    const isHungama = advertiser.includes('hungama');
    const desiredPlatform = isHungama ? 'Meta Ad Library' : 'Google Ad Transparency';

    const needsScrapedFrom = item && item.scraped_from == null;
    const needsPlatform = item && item.scraped_platform == null;

    if (needsScrapedFrom || needsPlatform) {
      updated += 1;
      return { ...item, scraped_from: desiredPlatform, scraped_platform: desiredPlatform };
    }
    return item;
  });

  if (updated > 0) {
    fs.writeFileSync(scrapedDataPath, JSON.stringify(result, null, 2));
  }

  const total = result.length;
  const withField = result.filter((x) => x && (x.scraped_from != null || x.scraped_platform != null)).length;
  console.log('✅ Backfill completed.');
  console.log(`Updated records: ${updated}`);
  console.log(`Total records: ${total}`);
  console.log(`With scraped_from: ${withField}`);
  console.log(`Output written to: ${scrapedDataPath}`);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}


