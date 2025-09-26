import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scrapedDataPath = path.join(__dirname, 'src/assets/scraped-data.json');
const hungamaDataPath = path.join(__dirname, 'src/assets/Hungama.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function timestampToDateString(timestamp) {
  if (!timestamp) return 'Unknown';
  const d = new Date(timestamp * 1000);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function determineFormat(card) {
  return (card?.video_hd_url || card?.video_sd_url) ? 'Video' : 'Image';
}

function transformHungama(h) {
  const out = [];
  const ads = Array.isArray(h?.ads) ? h.ads : [];
  for (const adNode of ads) {
    const node = adNode?.node;
    const results = Array.isArray(node?.collated_results) ? node.collated_results : [];
    for (const res of results) {
      const cards = Array.isArray(res?.snapshot?.cards) ? res.snapshot.cards : [];
      const start = timestampToDateString(res?.start_date);
      const end = timestampToDateString(res?.end_date);
      for (const card of cards) {
        const format = determineFormat(card);
        const base = {
          advertiserName: res?.page_name || 'Hungama OTT',
          adCreative: {
            imageUrl: format === 'Image' ? (card?.original_image_url || card?.resized_image_url || null) : null,
            videoUrl: format === 'Video' ? (card?.video_hd_url || card?.video_sd_url || null) : null,
            text: card?.body || '',
            hasIframe: false,
          },
          format,
          region: 'in',
          searchRegion: 'India',
          firstSeenDate: start,
          lastSeenDate: end,
          gatcLink: `https://www.facebook.com/ads/library/?id=${res?.ad_archive_id ?? ''}`,
          formatCode: format === 'Image' ? 2 : 3,
          adType: format,
          hasInteractiveContent: false,
          campaignDuration: 'Unknown',
          creativeDimensions: 'Unknown',
          apiData: {
            advertiserId: res?.page_id || '',
            creativeId: res?.ad_archive_id || '',
            formatCode: format === 'Image' ? 2 : 3,
          },
        };
        if (format === 'Image') {
          out.push({
            ...base,
            imageUrl: base.adCreative.imageUrl,
            videoThumbnailUrl: base.adCreative.imageUrl,
          });
        } else {
          out.push({
            ...base,
            imageUrl: null,
            videoThumbnailUrl: card?.video_preview_image_url || null,
            youtubeVideoId: `video_${res?.ad_archive_id || ''}`,
          });
        }
      }
    }
  }
  return out;
}

const existing = readJson(scrapedDataPath);
const hungama = readJson(hungamaDataPath);

const transformed = transformHungama(hungama);
const existingIds = new Set(existing.map(a => a?.apiData?.creativeId).filter(Boolean));
const newAds = transformed.filter(a => a?.apiData?.creativeId && !existingIds.has(a.apiData.creativeId));

const merged = [...existing, ...newAds];

fs.writeFileSync(scrapedDataPath, JSON.stringify(merged, null, 2));

console.log(JSON.stringify({
  existingCount: existing.length,
  transformedCount: transformed.length,
  added: newAds.length,
  mergedCount: merged.length,
}, null, 2));
