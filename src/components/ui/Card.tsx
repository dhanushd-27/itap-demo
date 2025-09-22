import { ReactNode } from 'react';

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
  if (!src) {
    return <div className="card-image placeholder">No image</div>;
  }
  return <img className="card-image" src={src} alt={alt ?? ''} />;
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


