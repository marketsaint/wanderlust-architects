"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

const TOTAL_ITEMS = 28;
const ROWS = 4;
const ITEMS_PER_ROW = 7;
const SPEED_MULTIPLIER = 2;

export default function GridMotion({ items = [], gradientColor = 'rgba(0,0,0,0.66)', className = '', disabled = false }) {
  const containerRef = useRef(null);
  const rowRefs = useRef([]);
  const segmentRefs = useRef([]);
  const rowSettersRef = useRef([]);
  const rowOffsetsRef = useRef([]);
  const rowDistancesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const speedRef = useRef(0);
  const isHoveringRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const defaultItems = Array.from({ length: TOTAL_ITEMS }, (_, index) => `Item ${index + 1}`);
  const filteredItems = items.filter(Boolean);
  const combinedItems =
    filteredItems.length > 0
      ? Array.from({ length: TOTAL_ITEMS }, (_, index) => filteredItems[index % filteredItems.length])
      : defaultItems;

  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    const handleMotionPreference = (event) => {
      reducedMotionRef.current = event.matches;
    };

    const handlePointerEnter = () => {
      isHoveringRef.current = true;
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
    };

    const containerEl = containerRef.current;

    const updateDistances = () => {
      rowDistancesRef.current = rowRefs.current.map((row, index) => {
        const firstSegment = segmentRefs.current[index];
        if (!row || !firstSegment) return 0;
        const rowStyles = window.getComputedStyle(row);
        const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || '0');
        return firstSegment.offsetWidth + (Number.isNaN(gap) ? 0 : gap);
      });
    };

    rowSettersRef.current = rowRefs.current.map((row) => {
      if (!row) return null;
      return gsap.quickSetter(row, 'x', 'px');
    });
    rowOffsetsRef.current = rowRefs.current.map(() => 0);
    updateDistances();

    const handleResize = () => updateDistances();
    window.addEventListener('resize', handleResize);

    const updateMotion = () => {
      const isReduced = reducedMotionRef.current;
      const isActive = isHoveringRef.current;
      // Keep movement smooth and predictable: 2x baseline speed plus hover acceleration.
      const basePixelsPerSec = (isReduced ? 8 : 18) * SPEED_MULTIPLIER;
      const hoverPixelsPerSec = (isReduced ? 22 : 96) * SPEED_MULTIPLIER;
      const targetSpeed = isActive ? hoverPixelsPerSec : basePixelsPerSec;

      const now = performance.now();
      const dt = lastTimeRef.current ? Math.min(0.05, (now - lastTimeRef.current) / 1000) : 0;
      lastTimeRef.current = now;
      speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, dt * 9);
      const speed = speedRef.current;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const distance = rowDistancesRef.current[index];
        if (!distance) return;

        const direction = index % 2 === 0 ? 1 : -1;
        let offset = rowOffsetsRef.current[index] || 0;
        offset += direction * speed * dt;
        if (offset >= distance) offset -= distance;
        if (offset <= -distance) offset += distance;
        rowOffsetsRef.current[index] = offset;

        const setX = rowSettersRef.current[index];
        if (setX) setX(offset);
      });
    };

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(updateMotion);
    containerEl?.addEventListener('pointerenter', handlePointerEnter);
    containerEl?.addEventListener('pointerleave', handlePointerLeave);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreference);
    } else {
      mediaQuery.addListener(handleMotionPreference);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      containerEl?.removeEventListener('pointerenter', handlePointerEnter);
      containerEl?.removeEventListener('pointerleave', handlePointerLeave);
      gsap.ticker.remove(updateMotion);
      rowSettersRef.current = [];
      rowOffsetsRef.current = [];
      rowDistancesRef.current = [];
      lastTimeRef.current = 0;
      speedRef.current = 0;
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionPreference);
      } else {
        mediaQuery.removeListener(handleMotionPreference);
      }
    };
  }, [disabled]);

  return (
    <div className={`wa-gridmotion ${className}`} aria-hidden='true'>
      <section
        ref={containerRef}
        className='wa-gridmotion__intro'
        style={{
          background: `radial-gradient(circle at 50% 50%, ${gradientColor} 0%, transparent 78%)`
        }}
      >
        <div className='wa-gridmotion__container'>
          {Array.from({ length: ROWS }).map((_, rowIndex) => {
            const rowItems = Array.from({ length: ITEMS_PER_ROW }, (_, itemIndex) => combinedItems[rowIndex * ITEMS_PER_ROW + itemIndex]);

            return (
              <div key={rowIndex} className='wa-gridmotion__row' ref={(element) => (rowRefs.current[rowIndex] = element)}>
                {[0, 1].map((segmentIndex) => (
                  <div
                    key={`${rowIndex}-${segmentIndex}`}
                    className='wa-gridmotion__segment'
                    ref={segmentIndex === 0 ? (element) => (segmentRefs.current[rowIndex] = element) : undefined}
                  >
                    {rowItems.map((content, itemIndex) => {
                      const isImage = typeof content === 'string' && content.startsWith('http');

                      return (
                        <div key={`${rowIndex}-${segmentIndex}-${itemIndex}`} className='wa-gridmotion__item'>
                          <div className='wa-gridmotion__item-inner'>
                            {isImage ? (
                              <>
                                <div className='wa-gridmotion__item-img' style={{ backgroundImage: `url(${content})` }} />
                                <div className='wa-gridmotion__item-img-overlay' />
                              </>
                            ) : (
                              <div className='wa-gridmotion__item-content'>{content}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className='wa-gridmotion__mono-overlay' />
      </section>
    </div>
  );
}
