import React from 'react';
import MediaStage from './MediaStage';

export default function TimelineSection({ section, index, isActive }) {
  return (
    <section
      id={`section-${index}`}
      className="timeline-section"
      aria-label={`${section.year}: ${section.title}`}
      tabIndex={0}
      style={{
        minHeight: `${(section.duration || 1.8) * 90}vh`,
        backgroundColor: 'transparent'
      }}
    >
      <div className="section-inner">
        {/* Left: Spacer anchor for 3D model */}
        <div className="model-spacer" aria-hidden="true" />

        {/* Center: Media stage display */}
        <MediaStage media={section.media} isActive={isActive} />

        {/* Right: Narrative typography & details */}
        <article className={`content-overlay ${isActive ? 'active' : ''}`}>
          <div
            className="chapter-badge"
            style={{ color: section.chapterColor || '#E67E22' }}
            aria-label={`Chapter: ${section.chapter}`}
          >
            {section.chapter}
          </div>

          <h2 className="section-year">{section.year}</h2>
          <h3 className="section-title">{section.title}</h3>

          {section.subtitle && (
            <p className="section-subtitle">{section.subtitle}</p>
          )}

          {section.content && (
            <p className="section-content">{section.content}</p>
          )}

          {section.quote && (
            <blockquote className="section-quote">
              "{section.quote}"
            </blockquote>
          )}

          {section.achievements && (
            <div className="section-decisions">
              <h4>Key Achievements</h4>
              <ul className="section-list">
                {section.achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {section.decisions && (
            <div className="section-decisions">
              <h4>Key Decisions</h4>
              {section.decisions.map((decision, i) => (
                <div key={i} className="decision-item">
                  <strong>{decision}</strong>
                </div>
              ))}
            </div>
          )}

          {section.impact && (
            <div className="section-decisions">
              <h4>Impact Metrics</h4>
              {Object.entries(section.impact).map(([key, val]) => (
                <div key={key} className="decision-item">
                  <strong>{key.toUpperCase()}:</strong> {val}
                </div>
              ))}
            </div>
          )}

          {section.vision && (
            <div className="section-decisions">
              <h4>Vision 2047 Roadmap</h4>
              <ul className="section-list">
                {section.vision.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
