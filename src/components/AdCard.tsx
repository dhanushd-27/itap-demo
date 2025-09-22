import type { AdRecord, ImageAdRecord, VideoAdRecord } from '../types';
import type { AdCardProps } from '../types/components';
import { Card, CardImage, CardBody, CardTitle, CardBadge } from './ui/Card';

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

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

  return (
    <Card className="ad-card">
      {img ? (
        <CardImage src={img} alt={ad.advertiserName} />
      ) : (
        <div className="card-image placeholder professional">
          {isImage ? 'Image preview unavailable' : 'Video preview not available. Please use the provided link to view.'}
        </div>
      )}
      <CardBody>
        <CardTitle>{ad.advertiserName}</CardTitle>
        <div className="ad-meta">
          <CardBadge>Asset type: {ad.format}</CardBadge>
        </div>
        <div className="ad-fields">
          <div>
            <span className="label">Last seen:</span> {formatDate(ad.lastSeenDate)}
          </div>
          <div>
            <span className="label">Available from:</span> {formatDate(ad.firstSeenDate)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AdCard;


