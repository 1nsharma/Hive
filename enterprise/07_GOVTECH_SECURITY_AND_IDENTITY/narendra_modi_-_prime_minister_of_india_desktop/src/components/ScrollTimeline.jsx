import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { scrollSections, chapters } from '../utils/scrollData';
import TimelineSection from './TimelineSection';
import ChapterNav from './ChapterNav';
import ScrollProgress from './ScrollProgress';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTimeline({ activeSectionIndex, onSectionChange, onVelocityChange }) {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(activeSectionIndex || 0);

  // Initialize Lenis smooth scroll with velocity tracking and reduced motion check
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.2 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: !prefersReducedMotion,
      smoothTouch: false,
      touchMultiplier: 1.8
    });
    lenisRef.current = lenis;

    // Synchronize Lenis smooth scroll with GSAP ticker
    function updateLenis(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Track scroll velocity for reactive particles & audio
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (onVelocityChange) {
        onVelocityChange(e.velocity || 0);
      }
    });

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [onVelocityChange]);

  // Set up ScrollTrigger triggers for each section
  useEffect(() => {
    // Slight delay to allow DOM render and fonts to stabilize
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const triggers = scrollSections.map((section, index) => {
      const sectionEl = document.getElementById(`section-${index}`);
      if (!sectionEl) return null;

      return ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            setCurrentSection(index);
            onSectionChange?.(index, section);
          }
        }
      });
    });

    return () => {
      clearTimeout(timeout);
      triggers.forEach((t) => t && t.kill());
    };
  }, [onSectionChange]);

  // Keyboard navigation handler (ArrowDown, ArrowUp, PageDown, PageUp, Home, End)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const nextIdx = Math.min(scrollSections.length - 1, currentSection + 1);
        handleSelectChapter(nextIdx);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevIdx = Math.max(0, currentSection - 1);
        handleSelectChapter(prevIdx);
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleSelectChapter(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleSelectChapter(scrollSections.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection]);

  const handleSelectChapter = (sectionIndex) => {
    const targetEl = document.getElementById(`section-${sectionIndex}`);
    if (targetEl && lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, { offset: 0, duration: 1.4 });
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="scroll-timeline-container"
      role="region"
      aria-label="The Years of Modi Cinematic Timeline"
    >
      {/* Vertical Reading Progress Bar */}
      <ScrollProgress current={currentSection} total={scrollSections.length} />

      {/* Chapter Quick Jump Navigation */}
      <ChapterNav
        chapters={chapters}
        currentSection={currentSection}
        onSelectChapter={handleSelectChapter}
      />

      {/* Narrative Sections */}
      <div className="scroll-content">
        {scrollSections.map((section, index) => (
          <TimelineSection
            key={section.id}
            section={section}
            index={index}
            isActive={currentSection === index}
          />
        ))}
      </div>
    </div>
  );
}
