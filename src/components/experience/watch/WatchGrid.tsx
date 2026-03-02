'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './watch-grid.module.css';

type WatchProject = {
  slug: string;
  title: string;
  image: string;
};

type Position = {
  x: number;
  y: number;
};

type TouchSnapshot = {
  x: number;
  y: number;
  dist: number;
  zoom: number;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.4;
const FALLBACK_IMAGE = '/images/projects/project-1.svg';
const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function calculateHoneycombPositions(count: number, baseSize: number) {
  const positions: Position[] = [];
  if (count <= 0) return positions;

  positions.push({ x: 0, y: 0 });
  if (count === 1) return positions;

  const spacing = baseSize * 1.12;
  const sqrt3 = Math.sqrt(3);
  const hexPositions: Array<{ q: number; r: number; s: number }> = [{ q: 0, r: 0, s: 0 }];

  for (let ring = 1; hexPositions.length < count; ring += 1) {
    let q = 0;
    let r = -ring;
    let s = ring;

    const directions = [
      { q: 1, r: 0, s: -1 },
      { q: 0, r: 1, s: -1 },
      { q: -1, r: 1, s: 0 },
      { q: -1, r: 0, s: 1 },
      { q: 0, r: -1, s: 1 },
      { q: 1, r: -1, s: 0 }
    ];

    for (let dir = 0; dir < 6 && hexPositions.length < count; dir += 1) {
      for (let step = 0; step < ring && hexPositions.length < count; step += 1) {
        hexPositions.push({ q, r, s });
        q += directions[dir].q;
        r += directions[dir].r;
        s += directions[dir].s;
      }
    }
  }

  for (let i = 1; i < Math.min(hexPositions.length, count); i += 1) {
    const { q, r } = hexPositions[i];
    positions.push({
      x: spacing * (sqrt3 * q + (sqrt3 / 2) * r),
      y: spacing * ((3 / 2) * r)
    });
  }

  return positions;
}

function measureClusterBounds(count: number, tileSize: number) {
  const positions = calculateHoneycombPositions(count, tileSize);
  if (!positions.length) {
    return { width: tileSize, height: tileSize };
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of positions) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  return {
    width: maxX - minX + tileSize,
    height: maxY - minY + tileSize
  };
}

function computeAdaptiveTileSize(count: number, viewportWidth: number, viewportHeight: number) {
  if (count <= 1) return 184;

  const minTile = 84;
  const maxTile = 190;
  const targetWidth = Math.max(320, viewportWidth * 0.82);
  const targetHeight = Math.max(260, viewportHeight * 0.66);

  let low = minTile;
  let high = maxTile;
  let best = minTile;

  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) / 2;
    const bounds = measureClusterBounds(count, mid);
    if (bounds.width <= targetWidth && bounds.height <= targetHeight) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  if (count <= 7) best *= 1.05;
  if (count >= 28) best *= 0.96;
  if (count >= 40) best *= 0.92;

  return Math.round(clamp(best, minTile, maxTile));
}

export function WatchGrid({ projects }: { projects: WatchProject[] }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef({ x: 0, y: 0, t: Date.now() });
  const momentumRafRef = useRef<number | null>(null);
  const touchRef = useRef<TouchSnapshot | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const baseSize = useMemo(
    () => computeAdaptiveTileSize(projects.length, viewport.width, viewport.height),
    [projects.length, viewport.height, viewport.width]
  );
  const positions = useMemo(() => calculateHoneycombPositions(projects.length, baseSize), [projects.length, baseSize]);
  const selectedIndex = useMemo(() => projects.findIndex((project) => project.slug === selectedSlug), [projects, selectedSlug]);

  const stopMomentum = () => {
    if (momentumRafRef.current != null) {
      window.cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopMomentum();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      stopMomentum();

      const rect = container.getBoundingClientRect();
      const originX = event.clientX - rect.left - rect.width / 2;
      const originY = event.clientY - rect.top - rect.height / 2;
      const direction = event.deltaY > 0 ? 0.95 : 1.05;

      setZoom((previousZoom) => {
        const nextZoom = clamp(previousZoom * direction, MIN_ZOOM, MAX_ZOOM);
        const worldX = (originX - pan.x) / previousZoom;
        const worldY = (originY - pan.y) / previousZoom;
        setPan({
          x: originX - worldX * nextZoom,
          y: originY - worldY * nextZoom
        });
        return nextZoom;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [pan.x, pan.y]);

  useEffect(() => {
    if (selectedIndex < 0 || !containerRef.current) return;

    const container = containerRef.current;
    const selectedPosition = positions[selectedIndex];
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    setPan({
      x: centerX - selectedPosition.x * zoom,
      y: centerY - selectedPosition.y * zoom
    });
  }, [positions, selectedIndex, zoom]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedSlug(null);
      }
      if (event.key === 'Enter' && selectedSlug) {
        router.push(`/projects/${selectedSlug}`);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [router, selectedSlug]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedSlug) return;
    stopMomentum();
    setIsDragging(true);
    dragStartRef.current = {
      x: event.clientX - pan.x,
      y: event.clientY - pan.y
    };
    lastMoveRef.current = {
      x: event.clientX,
      y: event.clientY,
      t: Date.now()
    };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const now = Date.now();
    const dt = now - lastMoveRef.current.t;
    if (dt > 0) {
      velocityRef.current = {
        x: (event.clientX - lastMoveRef.current.x) / dt,
        y: (event.clientY - lastMoveRef.current.y) / dt
      };
    }

    setPan({
      x: event.clientX - dragStartRef.current.x,
      y: event.clientY - dragStartRef.current.y
    });

    lastMoveRef.current = {
      x: event.clientX,
      y: event.clientY,
      t: now
    };
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (reducedMotion) return;

    let currentPan = { ...pan };
    let currentVelocity = { ...velocityRef.current };
    const momentumMultiplier = 100;
    const damping = 0.95;

    const animate = () => {
      if (Math.abs(currentVelocity.x) <= 0.01 && Math.abs(currentVelocity.y) <= 0.01) {
        momentumRafRef.current = null;
        return;
      }

      currentPan = {
        x: currentPan.x + currentVelocity.x * momentumMultiplier,
        y: currentPan.y + currentVelocity.y * momentumMultiplier
      };
      currentVelocity = {
        x: currentVelocity.x * damping,
        y: currentVelocity.y * damping
      };
      setPan(currentPan);
      momentumRafRef.current = window.requestAnimationFrame(animate);
    };

    momentumRafRef.current = window.requestAnimationFrame(animate);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (selectedSlug) return;
    stopMomentum();

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX - pan.x,
        y: touch.clientY - pan.y
      };
      touchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        dist: 0,
        zoom
      };
      return;
    }

    if (event.touches.length === 2) {
      const t1 = event.touches[0];
      const t2 = event.touches[1];
      touchRef.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
        dist: Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY),
        zoom
      };
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1 && isDragging) {
      const touch = event.touches[0];
      setPan({
        x: touch.clientX - dragStartRef.current.x,
        y: touch.clientY - dragStartRef.current.y
      });
      return;
    }

    if (event.touches.length === 2 && touchRef.current && containerRef.current) {
      const t1 = event.touches[0];
      const t2 = event.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const centerX = (t1.clientX + t2.clientX) / 2;
      const centerY = (t1.clientY + t2.clientY) / 2;

      if (touchRef.current.dist > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const originX = centerX - rect.left - rect.width / 2;
        const originY = centerY - rect.top - rect.height / 2;
        const nextZoom = clamp(touchRef.current.zoom * (dist / touchRef.current.dist), MIN_ZOOM, MAX_ZOOM);
        const worldX = (originX - pan.x) / zoom;
        const worldY = (originY - pan.y) / zoom;

        setZoom(nextZoom);
        setPan({
          x: originX - worldX * nextZoom,
          y: originY - worldY * nextZoom
        });
      }

      touchRef.current = {
        x: centerX,
        y: centerY,
        dist,
        zoom
      };
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchRef.current = null;
  };

  const getTileScale = (slug: string, position: Position) => {
    if (!selectedSlug) return 1;
    if (slug === selectedSlug) return 1.35;

    const focusPosition = selectedIndex >= 0 ? positions[selectedIndex] : null;
    if (!focusPosition) return 1;

    const distance = Math.hypot(position.x - focusPosition.x, position.y - focusPosition.y);
    if (distance < baseSize * 2) return 1.1;
    if (distance < baseSize * 4) return 0.95;
    return 0.85;
  };

  const getTileOpacity = (slug: string, position: Position) => {
    if (!selectedSlug || slug === selectedSlug) return 1;
    const focusPosition = selectedIndex >= 0 ? positions[selectedIndex] : null;
    if (!focusPosition) return 1;

    const distance = Math.hypot(position.x - focusPosition.x, position.y - focusPosition.y);
    if (distance < baseSize * 2) return 1;
    if (distance < baseSize * 4) return 0.88;
    return 0.72;
  };

  const handleTileClick = (slug: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (selectedSlug === slug) {
      router.push(`/projects/${slug}`);
      return;
    }
    setSelectedSlug(slug);
  };

  const selectedTitle = selectedSlug ? projects.find((project) => project.slug === selectedSlug)?.title : null;

  return (
    <section
      ref={containerRef}
      className={styles.root}
      onClick={() => setSelectedSlug(null)}
      style={{ cursor: isDragging ? 'grabbing' : selectedSlug ? 'default' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label='Project honeycomb showcase'
    >
      <div className={styles.backgroundTexture} />
      <div className={styles.vignette} />

      <motion.div
        className={styles.cluster}
        animate={{ x: pan.x, y: pan.y, scale: zoom }}
        transition={
          reducedMotion
            ? { duration: 0.16 }
            : {
                type: 'spring',
                stiffness: selectedSlug ? 200 : 300,
                damping: selectedSlug ? 35 : 40
              }
        }
        style={{ transformOrigin: 'center center' }}
      >
        <div className={styles.center}>
          {projects.map((project, index) => {
            const position = positions[index] || { x: 0, y: 0 };
            const isSelected = project.slug === selectedSlug;
            const isHovered = project.slug === hoveredSlug;
            const scale = getTileScale(project.slug, position);
            const opacity = getTileOpacity(project.slug, position);

            return (
              <motion.button
                key={project.slug}
                type='button'
                className={styles.tileButton}
                style={{
                  left: position.x,
                  top: position.y,
                  width: baseSize,
                  height: baseSize
                }}
                initial={false}
                animate={{
                  scale: scale * (isHovered && !isSelected ? 1.05 : 1),
                  x: -baseSize / 2,
                  y: -baseSize / 2,
                  opacity
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                onClick={handleTileClick(project.slug)}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                aria-label={project.title}
              >
                <motion.span
                  className={styles.outerGlow}
                  animate={{
                    opacity: isSelected ? 0.8 : isHovered ? 0.42 : 0.22,
                    scale: isSelected ? 1.2 : 1
                  }}
                  transition={{
                    duration: reducedMotion ? 0.14 : 0.4,
                    ease: APPLE_EASE
                  }}
                />

                {isSelected ? (
                  <motion.span
                    className={styles.bloom}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.8 }}
                    transition={{
                      duration: reducedMotion ? 0.16 : 0.5,
                      ease: APPLE_EASE
                    }}
                  />
                ) : null}

                <span className={styles.tile}>
                  <span className={styles.imageFrame}>
                    <Image
                      src={project.image || FALLBACK_IMAGE}
                      alt={project.title}
                      fill
                      sizes='(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 140px'
                      priority={index < 14}
                      className={styles.image}
                    />
                  </span>
                  <span className={styles.glassOverlay} />
                  <span className={styles.innerShadow} />
                  <motion.span
                    className={styles.hoverHighlight}
                    animate={{ opacity: isHovered || isSelected ? 1 : 0 }}
                    transition={{ duration: reducedMotion ? 0.1 : 0.3 }}
                  />
                </span>

                {isHovered && !isSelected ? (
                  <motion.span
                    className={styles.tooltip}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
                  >
                    {project.title}
                  </motion.span>
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {!selectedSlug ? (
        <motion.div
          className={styles.instructions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: reducedMotion ? 0.12 : 0.6
          }}
        >
          Drag to pan • Scroll to zoom • Click to focus • Click again to open
        </motion.div>
      ) : null}

      {selectedTitle ? (
        <motion.div
          className={styles.selectedProject}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0.12 : 0.4,
            ease: APPLE_EASE
          }}
        >
          {selectedTitle}
        </motion.div>
      ) : null}
    </section>
  );
}

