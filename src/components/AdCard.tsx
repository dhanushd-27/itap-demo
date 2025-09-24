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
    return ad.videoThumbnailUrl ?? null;
  }
  return null;
}

export function AdCard({ ad }: AdCardProps) {
  const img = resolveImage(ad);
  const isImage = ad.format === 'Image';
  const assetUrl = img;
  const fallbackUrl = !assetUrl && isVideoAdRecord(ad) ? ad.gatcLink : null;

  return (
    <Card className="ad-card">
      {img ? (
        <CardImage src={img} alt={ad.advertiserName} />
      ) : (
        <div className="card-image placeholder professional">
          {isImage
            ? 'Image preview unavailable'
            : 'No thumbnail available for this video in the dataset. Use the link below to view.'}
        </div>
      )}
      <CardBody>
        <CardTitle>{ad.advertiserName}</CardTitle>
        <div className="ad-meta">
          <CardBadge>Asset type: {ad.format}</CardBadge>
          {assetUrl || fallbackUrl ? (
            <a
              href={(assetUrl || fallbackUrl) as string}
              target="_blank"
              rel="noopener noreferrer"
              className="badge"
            >
              {assetUrl ? 'Open asset' : 'Open on GATC'}
            </a>
          ) : null}
        </div>
        <div className="ad-fields">
          <div>
            <span className="label">Last seen:</span> {formatDateDisplay(ad.lastSeenDate)}
          </div>
          <div>
            <span className="label">Active from:</span> {formatActiveDuration(ad.firstSeenDate, ad.lastSeenDate)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AdCard;


