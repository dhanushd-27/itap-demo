# Fields Used in the Frontend

## Overview
This document lists all the fields that are actually being used in the frontend React application.

## Backend API Fields
The backend provides the following API endpoints, which use various fields:

### Scraping Job Fields (from models.py)
- `job_id`: Unique identifier for each scraping job
- `page_ids`: List of page IDs to scrape
- `country`: Target country for scraping (default: "IN")
- `ad_category`: Category of ads to scrape (default: "ALL")
- `max_pages`: Maximum number of pages to scrape (default: 80)
- `include_page_name`: Whether to include page name in filename
- `scheduled_time`: When the job is scheduled to run
- `next_run`: When the job is next scheduled to run
- `interval_days`: Interval in days for recurring jobs (default: 2)
- `status`: Current status (pending, running, completed, failed)
- `created_at`: When the job was created
- `last_run`: When the job was last executed
- `results`: Results from the scraping job
- `requests_per_minute`: Rate limiting for scraping (default: 20)

### Ad Data Fields (from models.py)
- `ad_id`: Unique identifier for the ad
- `page_id`: ID of the page the ad belongs to
- `page_name`: Name of the page the ad belongs to
- `ad_content`: Content of the ad
- `scraped_at`: When the ad was scraped
- `scraped_platform`: Platform where the ad was scraped from (default: "Meta Ad Library")
- `first_seen_date`: When the ad was first seen
- `last_seen_date`: When the ad was last seen
- `ad_format`: Format of the ad (e.g. Image, Video)
- `region`: Region where the ad is shown (default: "Unknown")
- `metadata`: Additional metadata about the ad

## Frontend React App Fields
The frontend React app uses the following fields from the scraped data JSON:

### Ad Record Fields (from types/scraped-data.ts)
- `advertiserName`: Name of the advertiser
- `adCreative.text`: Text content of the ad creative
- `adCreative.hasIframe`: Whether the ad creative has an iframe
- `adCreative.imageUrl`: URL of the image for image creatives
- `adCreative.videoUrl`: URL of the video for video creatives (null for images)
- `format`: Format of the ad ("Image" or "Video")
- `region`: Region code (e.g. "in")
- `searchRegion`: Full region name (e.g. "India")
- `firstSeenDate`: Date when the ad was first seen (e.g. "4/10/2025")
- `lastSeenDate`: Date when the ad was last seen (e.g. "9/22/2025")
- `gatcLink`: Link to the Google Ads Transparency Center
- `formatCode`: Numeric code for the format (2 for image, 3 for video)
- `adType`: Duplicate of format field
- `hasInteractiveContent`: Whether the ad has interactive content
- `campaignDuration`: Duration of the ad campaign (e.g. "6 months")
- `creativeDimensions`: Dimensions of the creative (often "Unknown")
- `apiData.advertiserId`: Advertiser ID from the API
- `apiData.creativeId`: Creative ID from the API
- `apiData.formatCode`: Format code from the API
- `publisher_platform`: Platforms where the ad is published (e.g. ["FACEBOOK", "INSTAGRAM"])
- `scraped_from`: Source of the scraped data (legacy field)
- `scraped_platform`: Source of the scraped data (preferred field)

### Image Ad Record Additional Fields
- `imageUrl`: Top-level image URL for image ads
- `videoThumbnailUrl`: Video thumbnail URL, mirrors imageUrl for image ads
- `youtubeVideoId`: Not present for image ads

### Video Ad Record Additional Fields
- `imageUrl`: Always null for video ads
- `videoThumbnailUrl`: Video thumbnail URL (often null)
- `youtubeVideoId`: YouTube video ID for video ads (e.g. "video_09369345")

## Dashboard Filter Fields (used by frontend)
- `lastActiveFilter`: Filter for ads active in a specific time range (today, week, month, quarter)
- `runningSinceFilter`: Sort order for campaign duration (asc, desc)
- `companyFilter`: Filter by specific company or advertiser
- `formatFilter`: Filter by ad format (Image, Video)
- `platformFilter`: Filter by platform where ads were scraped

## Summary
The frontend application primarily consumes and displays ad data from the scraped-data.json file, with fields related to advertiser information, ad content, timing (when the ad was first/last seen), and metadata about where and how the ad was scraped. The UI allows users to filter and sort this data based on various criteria including recency, company, format, and platform.