import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface CardRootProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardRootProps) {
  return <div className={`card ${className ?? ''}`.trim()}>{children}</div>;
}

interface CardMediaProps {
  src?: string | null;
  type: 'image' | 'video';
  alt?: string;
}

export function CardMedia({ src, type, alt }: CardMediaProps) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set initial video to paused state on mount
  useEffect(() => {
    if (type === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.controls = false;
    }
  }, [type]);

  const showPlaceholder = !src || hasError;

  const style = naturalSize && naturalSize.w > 0 && naturalSize.h > 0
    ? { aspectRatio: `${naturalSize.w} / ${naturalSize.h}` }
    : { aspectRatio: '16 / 9' };

  if (showPlaceholder) {
    return (
      <div className="card-image-wrapper" style={style}>
        <div className="card-image placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">{type === 'video' ? '🎥' : '🖼️'}</span>
            <span>No Preview Available</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="card-image-wrapper" style={style}>
        <video
          ref={videoRef}
          className="card-image"
          src={src}
          muted
          preload="metadata"
          playsInline
          onClick={(e) => {
            // Toggle play/pause on click
            const video = e.currentTarget;
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }}
          onMouseEnter={(e) => {
            // Show controls on hover
            e.currentTarget.controls = true;
          }}
          onMouseLeave={(e) => {
            // Hide controls when not hovering
            e.currentTarget.controls = false;
          }}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="card-image-wrapper" style={style}>
      <img
        className="card-image"
        src={src}
        alt={alt ?? ''}
        onLoad={(e) => {
          const img = e.currentTarget;
          setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="ad-card-content">{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
  return <div className="card-title">{children}</div>;
}

interface CardBadgeProps {
  children: ReactNode;
}

export function CardBadge({ children }: CardBadgeProps) {
  return <span className="badge">{children}</span>;
}


