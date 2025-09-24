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

function formatActiveDuration(firstSeen: string, lastSeen: string): string {
  const first = new Date(firstSeen);
  const last = new Date(lastSeen);
  if (Number.isNaN(first.getTime()) || Number.isNaN(last.getTime())) {
    return firstSeen; // fallback to raw value if dates are invalid
  }

  let diffMs = last.getTime() - first.getTime();
  if (diffMs < 0) diffMs = 0;
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.floor(diffMs / dayMs);

  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'}`;
  }

  const months = Math.floor(days / 30);
  const remainingDays = days - months * 30;
  const weeks = Math.floor(remainingDays / 7);
  if (weeks > 0) {
    return `${months} month${months === 1 ? '' : 's'} ${weeks} week${weeks === 1 ? '' : 's'}`;
  }
  return `${months} month${months === 1 ? '' : 's'}`;
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
          {ad.gatcLink ? (
            <a
              href={ad.gatcLink}
              target="_blank"
              rel="noopener noreferrer"
              className="badge"
            >
              GATC link
            </a>
          ) : null}
        </div>
        <div className="ad-fields">
          <div>
            <span className="label">Last seen:</span> {formatDate(ad.lastSeenDate)}
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


