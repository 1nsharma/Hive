import React, { useEffect, useRef, useState } from 'react';
import { timelineData, categoryFilters } from '../utils/timelineData';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export default function Timeline({
  onSelectEvent,
  activeEvent,
  isPlaying,
  setIsPlaying,
  selectedCategory,
  setSelectedCategory
}) {
  const currentIndex = timelineData.findIndex((item) => item.id === (activeEvent?.id || 1));
  const autoPlayRef = useRef(null);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);

  // Auto-play timelapse interval
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % timelineData.length;
        onSelectEvent(timelineData[nextIndex]);
      }, 4200);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, currentIndex, onSelectEvent]);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + timelineData.length) % timelineData.length;
    onSelectEvent(timelineData[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % timelineData.length;
    onSelectEvent(timelineData[nextIndex]);
  };

  return (
    <>
      {/* Floating On-Screen Navigation Arrows on Left & Right for Effortless Walking */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          zIndex: 40,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={handlePrev}
          className="glass-panel"
          style={{
            border: '1px solid rgba(255, 153, 51, 0.3)',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            transition: 'all 0.25s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#FF9933';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 153, 51, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Walk to Previous Milestone"
        >
          <SkipBack size={16} color="#FF9933" />
          <span style={{ display: 'inline-block' }}>Prev</span>
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          zIndex: 40,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={handleNext}
          className="glass-panel"
          style={{
            border: '1px solid rgba(255, 153, 51, 0.3)',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            transition: 'all 0.25s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#FF9933';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 153, 51, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Walk to Next Milestone"
        >
          <span style={{ display: 'inline-block' }}>Next</span>
          <SkipForward size={16} color="#FF9933" />
        </button>
      </div>

      {/* Main Bottom Timeline Scrubber */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '94%',
          maxWidth: '960px',
          zIndex: 50,
          pointerEvents: 'auto'
        }}
      >
        <div
          className="glass-panel"
          style={{
            borderRadius: '16px',
            padding: isTimelineCollapsed ? '8px 18px' : '14px 20px',
            border: '1px solid rgba(255, 153, 51, 0.25)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Collapse Toggle Handle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: isTimelineCollapsed ? '0' : '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: activeEvent?.color || '#FF9933',
                  boxShadow: `0 0 10px ${activeEvent?.color || '#FF9933'}`
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
                {activeEvent?.year}: {activeEvent?.title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#CBD5E0',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title={isTimelineCollapsed ? 'Expand Timeline Panel' : 'Collapse Timeline Panel'}
              >
                {isTimelineCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{isTimelineCollapsed ? 'Show Bar' : 'Hide Bar'}</span>
              </button>
            </div>
          </div>

          {!isTimelineCollapsed && (
            <>
              {/* Category Filters Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                  overflowX: 'auto',
                  paddingBottom: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#A0AEC0', fontSize: '11px', fontWeight: 600 }}>
                  <Filter size={11} />
                  Filter:
                </div>
                {categoryFilters.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${cat.color}33, ${cat.color}66)`
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? `1px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isSelected ? '#FFFFFF' : '#A0AEC0',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '10.5px',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Scrubber Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '10px'
                }}
              >
                <button
                  onClick={handlePrev}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', borderRadius: '8px' }}
                  title="Previous Milestone"
                >
                  <SkipBack size={14} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-primary"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={14} />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      <span>Auto-Walk</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', borderRadius: '8px' }}
                  title="Next Milestone"
                >
                  <SkipForward size={14} />
                </button>

                {/* Range Slider for Interactive Walking */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="range"
                    min="0"
                    max={timelineData.length - 1}
                    value={currentIndex >= 0 ? currentIndex : 0}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      onSelectEvent(timelineData[idx]);
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#A0AEC0',
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  <span style={{ color: '#FF9933' }}>{currentIndex + 1}</span> / {timelineData.length}
                </div>
              </div>

              {/* Milestone Badges Strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '5px',
                  overflowX: 'auto',
                  paddingTop: '2px'
                }}
              >
                {timelineData.map((item) => {
                  const isActive = activeEvent?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectEvent(item)}
                      style={{
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: isActive ? item.color : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#080a0f' : '#CBD5E0',
                        fontWeight: isActive ? 800 : 500,
                        fontSize: '10.5px',
                        textAlign: 'center',
                        minWidth: '42px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isActive ? `0 0 12px ${item.color}99` : 'none',
                        transform: isActive ? 'scale(1.08) translateY(-2px)' : 'scale(1)'
                      }}
                      title={`${item.year}: ${item.title}`}
                    >
                      {item.year}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
