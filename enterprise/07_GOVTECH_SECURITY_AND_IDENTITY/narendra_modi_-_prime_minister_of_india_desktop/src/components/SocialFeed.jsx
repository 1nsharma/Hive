import React from 'react';
import { socialMediaPosts } from '../utils/timelineData';
import { X, Heart, Repeat2, MessageCircle, Globe2, Twitter } from 'lucide-react';

export default function SocialFeed({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        left: '24px',
        width: '380px',
        maxWidth: 'calc(100vw - 48px)',
        maxHeight: 'calc(100vh - 180px)',
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
          maxHeight: 'calc(100vh - 180px)',
          border: '1px solid rgba(0, 191, 255, 0.3)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00BFFF, #1DA1F2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Globe2 size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Digital Footprint
              </h3>
              <p style={{ fontSize: '11px', color: '#A0AEC0', margin: 0 }}>
                Worldwide Social Reach
              </p>
            </div>
          </div>
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
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Aggregate Stats Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            marginBottom: '16px'
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#00BFFF', fontWeight: 700, fontSize: '14px' }}>100M+</div>
            <div style={{ color: '#A0AEC0', fontSize: '10px' }}>X Followers</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#E1306C', fontWeight: 700, fontSize: '14px' }}>90M+</div>
            <div style={{ color: '#A0AEC0', fontSize: '10px' }}>Instagram</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#FF0000', fontWeight: 700, fontSize: '14px' }}>24M+</div>
            <div style={{ color: '#A0AEC0', fontSize: '10px' }}>YouTube</div>
          </div>
        </div>

        {/* Notable Posts List */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {socialMediaPosts.map((post) => (
            <div
              key={post.id}
              className="glass-card"
              style={{ padding: '14px', borderRadius: '10px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#00BFFF',
                    background: 'rgba(0, 191, 255, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}
                >
                  {post.platform}
                </span>
                <span style={{ fontSize: '11px', color: '#718096' }}>{post.date}</span>
              </div>

              <p style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                "{post.content}"
              </p>

              {post.image && (
                <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                  <img src={post.image} alt="post visual" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', color: '#A0AEC0', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={12} color="#FF6B6B" />
                  <span>{post.likes}</span>
                </div>
                {post.retweets && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Repeat2 size={12} color="#48BB78" />
                    <span>{post.retweets}</span>
                  </div>
                )}
                {post.comments && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={12} color="#00BFFF" />
                    <span>{post.comments}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
