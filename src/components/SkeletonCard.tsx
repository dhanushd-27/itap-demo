import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="ad-card skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;