import React from 'react';

export default function ScrollProgress({ current, total }) {
  const percent = total > 1 ? Math.min(100, Math.max(0, ((current + 1) / total) * 100)) : 0;

  return (
    <div className="scroll-progress-bar">
      <div
        className="scroll-progress-fill"
        style={{ height: `${percent}%` }}
      />
    </div>
  );
}
