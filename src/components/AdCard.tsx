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
  const assetUrl = img;
  const fallbackUrl = !assetUrl && isVideoAdRecord(ad) ? ad.gatcLink : null;
  const gatcLink = ad.gatcLink ?? null;

  return (
    <Card className="ad-card">
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
              className="card-image placeholder grey"
              aria-label="Open on Google Ads Transparency Center"
            />
          ) : (
            <div className="card-image placeholder grey" />
          )}
        </div>
      )}
      <CardBody>
        <CardTitle>{ad.advertiserName}</CardTitle>
        <div className="ad-meta">
          <CardBadge>Format: {ad.format}</CardBadge>
        </div>
        <div className="ad-fields">
          {(assetUrl || fallbackUrl) && (
            <div>
              <span className="label">Link:</span>{' '}
              <a
                href={(assetUrl || fallbackUrl) as string}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Ad
              </a>
            </div>
          )}
          <div>
            <span className="label">Last seen:</span> {formatDateDisplay(ad.lastSeenDate)}
          </div>
          <div>
            <span className="label">Running Since:</span> {formatActiveDuration(ad.firstSeenDate, ad.lastSeenDate)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AdCard;


