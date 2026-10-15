import React, { useState } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Share2,
  Zap,
  Minimize2,
  Maximize2,
  ChevronRight,
  Eye,
  Layers
} from 'lucide-react';

export default function MediaPopup({ event, onClose, isMinimized, setIsMinimized }) {
  if (!event) return null;

  const [activeTab, setActiveTab] = useState('overview');

  // Minimized state pill: leaves 95%+ of the screen clear for the 3D model!
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '75px',
          right: '20px',
          zIndex: 60,
          pointerEvents: 'auto'
        }}
        className="animate-fade-in"
      >
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '24px',
            border: `1.5px solid ${event.color}88`,
            boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${event.color}33`,
            cursor: 'pointer'
          }}
          onClick={() => setIsMinimized(false)}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: event.color,
              boxShadow: `0 0 8px ${event.color}`
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}>
              MILESTONE {event.year}
            </span>
            <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 700 }}>
              {event.title}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <Maximize2 size={12} />
            Expand
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A0AEC0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Close popup"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '75px',
        right: '20px',
        width: '380px',
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 190px)',
        zIndex: 60,
        pointerEvents: 'auto'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          padding: '20px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 190px)',
          border: `1px solid ${event.color}55`,
          boxShadow: `0 16px 48px rgba(0,0,0,0.7), 0 0 30px ${event.color}22`
        }}
      >
        {/* Header & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: `${event.color}22`,
                color: event.color,
                border: `1px solid ${event.color}66`,
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px'
              }}
            >
              <Calendar size={12} />
              {event.year} • {event.category.toUpperCase()}
            </div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {event.title}
            </h2>
            <div style={{ fontSize: '11px', color: '#A0AEC0', marginTop: '3px' }}>
              {event.date}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#CBD5E0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Minimize panel (unobstructed 3D view)"
            >
              <Minimize2 size={14} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#CBD5E0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Media Box */}
        {event.media && (
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '14px',
              background: '#040609',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <img
              src={event.media.url}
              alt={event.media.caption}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div
              style={{
                padding: '6px 10px',
                fontSize: '11px',
                color: '#CBD5E0',
                background: 'rgba(10, 15, 20, 0.85)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {event.media.caption}
            </div>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            fontSize: '12.5px',
            lineHeight: '1.55',
            color: '#E2E8F0',
            marginBottom: '14px'
          }}
        >
          {event.description}
        </p>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '6px',
            marginBottom: '14px'
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'overview' ? event.color : '#A0AEC0',
              fontWeight: activeTab === 'overview' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'overview' ? `2px solid ${event.color}` : '2px solid transparent',
              paddingBottom: '3px'
            }}
          >
            Overview
          </button>
          {(event.decisions || event.impact) && (
            <button
              onClick={() => setActiveTab('decisions')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'decisions' ? event.color : '#A0AEC0',
                fontWeight: activeTab === 'decisions' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: activeTab === 'decisions' ? `2px solid ${event.color}` : '2px solid transparent',
                paddingBottom: '3px'
              }}
            >
              Key Decisions
            </button>
          )}
          {event.achievements && (
            <button
              onClick={() => setActiveTab('achievements')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'achievements' ? event.color : '#A0AEC0',
                fontWeight: activeTab === 'achievements' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: activeTab === 'achievements' ? `2px solid ${event.color}` : '2px solid transparent',
                paddingBottom: '3px'
              }}
            >
              Achievements
            </button>
          )}
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div>
            {event.details && (
              <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                {Object.entries(event.details).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11.5px'
                    }}
                  >
                    <span style={{ color: event.color, fontWeight: 600, textTransform: 'capitalize' }}>
                      {k.replace(/([A-Z])/g, ' $1')}:{' '}
                    </span>
                    <span style={{ color: '#CBD5E0' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {event.socialMedia && (
              <div
                style={{
                  background: 'rgba(0, 191, 255, 0.08)',
                  border: '1px solid rgba(0, 191, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#00BFFF', fontSize: '11.5px', fontWeight: 600 }}>
                  <Share2 size={12} />
                  Digital Footprint ({event.socialMedia.twitter})
                </div>
                <div style={{ fontSize: '11px', color: '#A0AEC0' }}>
                  Global Following: <strong style={{ color: '#fff' }}>{event.socialMedia.followers}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Decisions & Impact */}
        {activeTab === 'decisions' && (
          <div style={{ display: 'grid', gap: '8px' }}>
            {event.decisions?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 12px',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: event.color, fontWeight: 700, fontSize: '12px' }}>
                  <Zap size={12} />
                  {item.name}
                </div>
                <div style={{ fontSize: '11.5px', color: '#CBD5E0', marginTop: '3px', lineHeight: '1.4' }}>
                  {item.impact}
                </div>
              </div>
            ))}

            {event.impact && (
              <div style={{ display: 'grid', gap: '6px' }}>
                {Object.entries(event.impact).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px'
                    }}
                  >
                    <div style={{ color: '#FFD700', fontWeight: 600, textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <TrendingUp size={11} />
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div style={{ color: '#E2E8F0', marginTop: '2px' }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Achievements */}
        {activeTab === 'achievements' && event.achievements && (
          <div style={{ display: 'grid', gap: '6px' }}>
            {event.achievements.map((ach, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  fontSize: '11.5px',
                  color: '#E2E8F0',
                  lineHeight: '1.4',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '8px 10px',
                  borderRadius: '6px'
                }}
              >
                <CheckCircle2 size={13} color={event.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
