import type { AdRecord, ImageAdRecord, VideoAdRecord } from '../types';
import type { AdCardProps } from '../types/components';
import { Card, CardImage, CardBody, CardTitle, CardBadge } from './ui/Card';
import { formatDateDisplay, formatActiveDuration } from '../utils/dates';

function isImageAdRecord(ad: AdRecord): ad is ImageAdRecord {
  return ad.format === 'Image';
}

function isVideoAdRecord(ad: AdRecord): ad is VideoAdRecord {
  return ad.format === 'Video';
}

function resolveImage(ad: AdRecord): string | null {
  if (isImageAdRecord(ad)) {
    return ad.adCreative.imageUrl ?? ad.imageUrl ?? null;
  }
  if (isVideoAdRecord(ad)) {
    if (ad.videoThumbnailUrl) return ad.videoThumbnailUrl;
    // Fallback: attempt to generate a preview image from the GATC page
    if (ad.gatcLink) {
      const encoded = encodeURIComponent(ad.gatcLink);
      // Using thum.io to render a static preview image of the GATC page
      // You can replace with your own screenshot service if preferred
      return `https://image.thum.io/get/width/800/crop/800/${encoded}`;
    }
    return null;
  }
  return null;
}

export function AdCard({ ad }: AdCardProps) {
  const img = resolveImage(ad);
  const gatcLink = ad.gatcLink ?? null;
  const platforms = Array.isArray((ad as AdRecord).publisher_platform) ? (ad as AdRecord).publisher_platform as string[] : null;
  const platformIconSrc: Record<string, string> = {
    FACEBOOK: '/facebook.png',
    INSTAGRAM: '/instagram.png',
    AUDIENCE_NETWORK: '/network.png',
    MESSENGER: '/messenger.png',
  };

  return (
    <Card className="ad-card">
      <div className="ad-live-pill" aria-hidden>
        <img className="ad-live-icon" src="/available.gif" alt="" />
        <span className="ad-live-text">Live</span>
      </div>
      {img ? (
        gatcLink ? (
          <a
            href={gatcLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open on Google Ads Transparency Center"
          >
            <CardImage src={img} alt={ad.advertiserName} />
          </a>
        ) : (
          <CardImage src={img} alt={ad.advertiserName} />
        )
      ) : (
        <div className="card-image-wrapper">
          {gatcLink ? (
            <a
              href={gatcLink}
              target="_blank"
              rel="noopener noreferrer"
              className="card-image placeholder"
              aria-label="Open on Google Ads Transparency Center"
            />
          ) : (
            <div className="card-image placeholder " />
          )}
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
          <CardBadge>Format: {ad.format}</CardBadge>
          {platforms && platforms.length > 0 && (
            <div className="ad-platform-icons" title={`Platforms: ${platforms.join(', ')}`}>
              {platforms.map((p) => (
                <img
                  key={p}
                  className="ad-platform-icon"
                  src={platformIconSrc[p] ?? '/network.png'}
                  alt={p}
                  title={p}
                />
              ))}
            </div>
          )}
        </div>
        <div className="ad-fields">
          <div>
            <span className="label">Last Active:</span> {formatDateDisplay(ad.lastSeenDate)}
          </div>
          <div className="ad-field-highlighted">
            <span className="label">Running Since:</span> {formatActiveDuration(ad.firstSeenDate, ad.lastSeenDate)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AdCard;


