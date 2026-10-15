import React from 'react';

export default function MediaStage({ media, isActive }) {
  if (!media) return <div style={{ minHeight: '200px' }} />;

  return (
    <div className={`media-stage ${isActive ? 'active' : ''}`}>
      <div className="media-frame">
        {media.type === 'video' ? (
          <video
            src={media.url}
            controls
            playsInline
            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={media.url}
            alt={media.caption || 'Milestone visual'}
            loading="lazy"
          />
        )}
        {media.caption && (
          <div className="media-caption">
            {media.caption}
          </div>
        )}
      </div>
    </div>
  );
}
