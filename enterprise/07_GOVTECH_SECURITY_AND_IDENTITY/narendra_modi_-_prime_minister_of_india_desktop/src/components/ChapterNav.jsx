import React from 'react';

export default function ChapterNav({ chapters, currentSection, onSelectChapter }) {
  return (
    <nav
      className="chapter-nav-pill-container"
      aria-label="Chapter quick navigation"
    >
      <div className="chapter-nav-pill">
        {chapters.map((chap) => {
          const isActive = Math.abs(currentSection - chap.sectionIndex) <= 1;

          return (
            <button
              key={chap.id}
              onClick={() => onSelectChapter(chap.sectionIndex)}
              className={`chapter-nav-item ${isActive ? 'active' : ''}`}
              aria-label={`Jump to ${chap.name}`}
              title={chap.name}
            >
              <span
                className="chapter-nav-dot"
                style={{
                  backgroundColor: isActive ? chap.color : 'rgba(255, 255, 255, 0.28)',
                  boxShadow: isActive ? `0 0 14px ${chap.color}` : 'none'
                }}
              />
              <span className="chapter-nav-tooltip">
                <span className="chapter-tooltip-color" style={{ background: chap.color }} />
                {chap.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
