import type { AdRecord, ImageAdRecord, VideoAdRecord, VideoAdCreative } from '../types';
import type { AdCardProps } from '../types/components';
import { Card, CardMedia, CardBody, CardTitle, CardBadge } from './ui/Card';
import { formatDateDisplay, formatActiveDuration } from '../utils/dates';

function isImageAdRecord(ad: AdRecord): ad is ImageAdRecord {
  return ad.format === 'Image';
}

function isVideoAdRecord(ad: AdRecord): ad is VideoAdRecord {
  return ad.format === 'Video';
}

function resolveMedia(ad: AdRecord): { type: 'image' | 'video', url: string | null } {
  // For video ads, try the videoUrl from adCreative first
  if (ad.format === 'Video' && (ad.adCreative as VideoAdCreative).videoUrl) {
    return { type: 'video', url: (ad.adCreative as VideoAdCreative).videoUrl };
  }
  
  // For video ads, try the videoThumbnailUrl as fallback
  if (ad.format === 'Video' && ad.videoThumbnailUrl) {
    return { type: 'image', url: ad.videoThumbnailUrl };
  }
  
  // For image ads, try the adCreative imageUrl
  if (ad.adCreative && ad.adCreative.imageUrl) {
    return { type: 'image', url: ad.adCreative.imageUrl };
  }
  
  // For image ads, also try the top-level imageUrl
  if (ad.format === 'Image' && ad.imageUrl) {
    return { type: 'image', url: ad.imageUrl };
  }
  
  // Fallback: attempt to generate a preview image from the GATC page
  if (ad.gatcLink) {
    const encoded = encodeURIComponent(ad.gatcLink);
    // Using thum.io to render a static preview image of the GATC page
    // You can replace with your own screenshot service if preferred
    return { type: 'image', url: `https://image.thum.io/get/width/800/crop/800/${encoded}` };
  }
  
  return { type: 'image', url: null };
}

export function AdCard({ ad }: AdCardProps) {
  const media = resolveMedia(ad);
  const gatcLink = ad.gatcLink ?? null;
  const platforms = Array.isArray((ad as AdRecord).publisher_platform) ? (ad as AdRecord).publisher_platform as string[] : null;
  const platformIconSrc: Record<string, string> = {
    FACEBOOK: '/facebook.png',
    INSTAGRAM: '/instagram.png',
    AUDIENCE_NETWORK: '/network.png',
    MESSENGER: '/messenger.png',
  };

  // Determine an icon based on format
  const formatIcon = ad.format === 'Image' ? '🖼️' : '🎥';
  
  // Check if the ad was last seen today to show the "Live" tag
  const isLive = () => {
    const today = new Date();
    const lastSeen = new Date(ad.lastSeenDate);
    
    return (
      lastSeen.getDate() === today.getDate() &&
      lastSeen.getMonth() === today.getMonth() &&
      lastSeen.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className="ad-card">
      {isLive() && (
        <div className="ad-live-pill" aria-hidden>
          <span className="ad-live-icon">●</span>
          <span className="ad-live-text">LIVE</span>
        </div>
      )}
      {media.url ? (
        gatcLink ? (
          <a
            href={gatcLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open on Google Ads Transparency Center"
          >
            <CardMedia src={media.url} type={media.type} alt={ad.advertiserName} />
          </a>
        ) : (
          <CardMedia src={media.url} type={media.type} alt={ad.advertiserName} />
        )
      ) : (
        <div className="card-image-wrapper">
          <div className="card-image placeholder">
            <span className="placeholder-icon">{media.type === 'video' ? '🎥' : '🖼️'}</span>
            <span>No Preview Available</span>
          </div>
        </div>
      )}
      <CardBody>
        <div className="ad-header">
          <CardTitle>{ad.advertiserName}</CardTitle>
          {gatcLink && (
            <a
              href={gatcLink}
              target="_blank"
              rel="noopener noreferrer"
              className="view-ad-button"
            >
              View Ad
            </a>
          )}
        </div>
        <div className="ad-meta">
          <CardBadge>
            {formatIcon} {ad.format}
          </CardBadge>
          {platforms && platforms.length > 0 && (
            <div className="ad-platform-icons" title={`Platforms: ${platforms.join(', ')}`}>
              {platforms.slice(0, 3).map((p, index) => (
                <img
                  key={`${p}-${index}`}
                  className="ad-platform-icon"
                  src={platformIconSrc[p] ?? '/network.png'}
                  alt={p}
                  title={p}
                />
              ))}
              {platforms.length > 3 && (
                <span className="ad-platform-icon" title={`+${platforms.length - 3} more`}>
                  +{platforms.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="ad-fields">
          <div className="ad-field-item">
            <span className="label">Last Active:</span>
            <span className="value">{formatDateDisplay(ad.lastSeenDate)}</span>
          </div>
          <div className="ad-field-highlighted">
            <span className="label">Running Since:</span>
            <span className="value">{formatActiveDuration(ad.firstSeenDate, ad.lastSeenDate)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AdCard;


