import { useState } from 'react';
import type { ReactNode } from 'react';

interface CardRootProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardRootProps) {
  return <div className={`card ${className ?? ''}`.trim()}>{children}</div>;
}

interface CardImageProps {
  src?: string | null;
  alt?: string;
}

export function CardImage({ src, alt }: CardImageProps) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [hasError, setHasError] = useState(false);

  const showPlaceholder = !src || hasError;

  const style = naturalSize && naturalSize.w > 0 && naturalSize.h > 0
    ? { aspectRatio: `${naturalSize.w} / ${naturalSize.h}` }
    : { aspectRatio: '16 / 9' };

  if (showPlaceholder) {
    return (
      <div className="card-image-wrapper" style={style}>
        <div className="card-image placeholder grey"></div>
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
  return <div className="card-body">{children}</div>;
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


