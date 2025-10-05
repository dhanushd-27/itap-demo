// Types describing the structure of entries in src/assets/scraped-data.json

export type AdFormat = 'Image' | 'Video';

export interface ApiData {
  advertiserId: string;
  creativeId: string;
  formatCode: number;
}

export interface AdCreativeBase {
  text: string;
  hasIframe: boolean;
}

export interface ImageAdCreative extends AdCreativeBase {
  imageUrl: string; // image creatives have an imageUrl
  videoUrl: null;   // videoUrl is null for image creatives
}

export interface VideoAdCreative extends AdCreativeBase {
  imageUrl: null;          // imageUrl is null for video creatives
  videoUrl: string | null; // URL of the actual video
}

export type AdCreative = ImageAdCreative | VideoAdCreative;

export interface BaseAdRecord {
  advertiserName: string;
  adCreative: AdCreative;
  format: AdFormat;
  region: string;        // e.g. "in"
  searchRegion: string;  // e.g. "India"
  firstSeenDate: string; // e.g. "4/10/2025"
  lastSeenDate: string;  // e.g. "9/22/2025"
  gatcLink: string;      // URL to GATC
  formatCode: number;    // e.g. 2 for image, 3 for video
  adType: AdFormat;      // duplicates format
  hasInteractiveContent: boolean;
  campaignDuration: string;     // e.g. "6 months", "26 days", "1 years"
  creativeDimensions: string;   // often "Unknown"
  apiData: ApiData;
  // Present only for Facebook Ad Library-derived records
  publisher_platform?: string[]; // e.g. ["FACEBOOK", "INSTAGRAM"]
  // Source tagging added by backfill/import scripts
  scraped_from?: string;          // legacy name
  scraped_platform?: string;      // preferred name: "Meta Ad Library" | "Google Ad Transparency"
}

export interface ImageAdRecord extends BaseAdRecord {
  format: 'Image';
  adType: 'Image';
  imageUrl: string;            // top-level image URL is present for image
  videoThumbnailUrl: string;   // mirrors imageUrl in sample
  youtubeVideoId?: undefined;  // absent for image
}

export interface VideoAdRecord extends BaseAdRecord {
  format: 'Video';
  adType: 'Video';
  imageUrl: null;             // top-level null for video
  videoThumbnailUrl: string | null; // often null
  youtubeVideoId: string;     // e.g. "video_09369345"
}

export type AdRecord = ImageAdRecord | VideoAdRecord;

export type ScrapedData = AdRecord[];


