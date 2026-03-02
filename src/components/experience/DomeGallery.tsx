'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEventHandler } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import styles from './dome-gallery.module.css';

type DomeItem = {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
};

type FocusState = {
  active: boolean;
  fx: number;
  fy: number;
  index: number;
};

type ComputedTile = {
  index: number;
  row: number;
  col: number;
  yaw: number;
  pitch: number;
  offsetX: number;
  offsetY: number;
  item: DomeItem;
};

type DomeGalleryProps = {
  items: DomeItem[];
  radius?: number;
  tileSize?: number;
  focusZoomEnabled?: boolean;
  focusZoom?: number;
  focusFalloff?: number;
  focusLift?: number;
  focusMinScale?: number;
  focusMaxScale?: number;
};

const DEFAULT_FOCUS: FocusState = {
  active: false,
  fx: 0,
  fy: 0,
  index: -1
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function DomeGallery({
  items,
  radius = 620,
  tileSize = 132,
  focusZoomEnabled = true,
  focusZoom = 1.55,
  focusFalloff = 7.5,
  focusLift = 60,
  focusMinScale = 0.92,
  focusMaxScale = 1.55
}: DomeGalleryProps) {
  const reducedMotion = useReducedMotion();
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ down: false, x: 0, y: 0 });
  const rotationRef = useRef({ x: -17, y: 14 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const inertiaRef = useRef<number | null>(null);
  const [focus, setFocus] = useState<FocusState>(DEFAULT_FOCUS);
  const focusRef = useRef<FocusState>(DEFAULT_FOCUS);

  const effectiveFocusEnabled = focusZoomEnabled && !reducedMotion;
  const rows = 7;
  const cols = 9;
  const totalTiles = rows * cols;

  const domeItems = useMemo(() => {
    if (items.length === 0) return [];
    return Array.from({ length: totalTiles }, (_, index) => items[index % items.length]);
  }, [items, totalTiles]);

  const tiles = useMemo<ComputedTile[]>(() => {
    if (domeItems.length === 0) return [];

    const maxRow = rows - 1;
    const maxCol = cols - 1;
    const pitchRange = 92;
    const yawRange = 170;

    const computed: ComputedTile[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const index = row * cols + col;
        const item = domeItems[index];
        const colWithOffset = col + (row % 2 ? 0.5 : 0);
        const normalizedX = colWithOffset / maxCol;
        const normalizedY = row / maxRow;
        const yaw = (normalizedX - 0.5) * yawRange;
        const pitch = (0.5 - normalizedY) * pitchRange;
        const offsetX = colWithOffset - maxCol / 2;
        const offsetY = row - maxRow / 2;

        computed.push({
          index,
          row,
          col,
          yaw,
          pitch,
          offsetX,
          offsetY,
          item
        });
      }
    }
    return computed;
  }, [domeItems]);

  const setSphereTransform = useCallback(
    (withTransition = false) => {
      const node = sphereRef.current;
      if (!node) return;

      const { x, y } = rotationRef.current;
      const shouldScale = effectiveFocusEnabled && focusRef.current.active;
      const cameraScale = shouldScale ? 1 + (focusZoom - 1) * 0.15 : 1;
      node.style.transition = withTransition && !reducedMotion ? 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      node.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${x}deg) rotateY(${y}deg) scale(${cameraScale})`;
    },
    [effectiveFocusEnabled, focusZoom, reducedMotion]
  );

  useEffect(() => {
    setSphereTransform(true);
  }, [focus.active, setSphereTransform]);

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocus(DEFAULT_FOCUS);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (inertiaRef.current) {
        window.cancelAnimationFrame(inertiaRef.current);
      }
    };
  }, []);

  const stopInertia = () => {
    if (inertiaRef.current) {
      window.cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
  };

  const startInertia = () => {
    if (reducedMotion || focusRef.current.active) return;
    stopInertia();

    const tick = () => {
      velocityRef.current.x *= 0.93;
      velocityRef.current.y *= 0.93;

      if (Math.abs(velocityRef.current.x) < 0.015 && Math.abs(velocityRef.current.y) < 0.015) {
        inertiaRef.current = null;
        return;
      }

      rotationRef.current.x = clamp(rotationRef.current.x - velocityRef.current.y, -62, 22);
      rotationRef.current.y += velocityRef.current.x;
      setSphereTransform(false);
      inertiaRef.current = window.requestAnimationFrame(tick);
    };

    inertiaRef.current = window.requestAnimationFrame(tick);
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (focusRef.current.active) return;
    stopInertia();
    pointerRef.current.down = true;
    pointerRef.current.x = event.clientX;
    pointerRef.current.y = event.clientY;
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!pointerRef.current.down) return;

    const deltaX = event.clientX - pointerRef.current.x;
    const deltaY = event.clientY - pointerRef.current.y;

    pointerRef.current.x = event.clientX;
    pointerRef.current.y = event.clientY;

    const dragSensitivity = focusRef.current.active ? 0.12 : 0.2;
    velocityRef.current.x = deltaX * dragSensitivity * 0.3;
    velocityRef.current.y = deltaY * dragSensitivity * 0.3;

    rotationRef.current.x = clamp(rotationRef.current.x - deltaY * dragSensitivity, -62, 22);
    rotationRef.current.y += deltaX * dragSensitivity;
    setSphereTransform(false);
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    pointerRef.current.down = false;
    try {
      (event.currentTarget as HTMLDivElement).releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released.
    }
    startInertia();
  };

  const handleTileSelect = (tile: ComputedTile, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!effectiveFocusEnabled) return;

    setFocus({
      active: true,
      fx: tile.offsetX,
      fy: tile.offsetY,
      index: tile.index
    });
  };

  const handleResetFocus = () => {
    setFocus(DEFAULT_FOCUS);
  };

  const sphereStyle: CSSProperties = {
    ['--radius' as string]: `${radius}px`,
    ['--tile-size' as string]: `${tileSize}px`,
    ['--focus-zoom' as string]: `${focusZoom}`
  };

  return (
    <div className={styles.root} data-reduced-motion={reducedMotion ? 'true' : 'false'}>
      <div
        className={styles.stage}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleResetFocus}
      >
        <div ref={sphereRef} className={styles.sphere} style={sphereStyle}>
          {tiles.map((tile) => {
            let scale = 1;
            let lift = 0;

            if (effectiveFocusEnabled && focus.active) {
              const dx = tile.offsetX - focus.fx;
              const dy = tile.offsetY - focus.fy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const t = clamp(dist / focusFalloff, 0, 1);
              const eased = t * t * (3 - 2 * t);
              scale = focusMaxScale - (focusMaxScale - focusMinScale) * eased;
              lift = focusLift * (1 - eased);
            }

            const tileStyle: CSSProperties = {
              ['--ry' as string]: `${tile.yaw}deg`,
              ['--rx' as string]: `${tile.pitch}deg`,
              ['--scale' as string]: `${scale}`,
              ['--lift' as string]: `${lift}px`
            };

            return (
              <button
                key={`${tile.index}-${tile.item.id}`}
                type='button'
                className={`${styles.tile} ${focus.index === tile.index ? styles.tileActive : ''}`}
                style={tileStyle}
                onClick={(event) => handleTileSelect(tile, event)}
                aria-label={tile.item.title || 'Open tile focus'}
              >
                <div className={styles.tileMedia}>
                  <Image
                    src={tile.item.image}
                    alt={tile.item.title || 'Wanderlust project'}
                    fill
                    sizes='132px'
                    className={styles.image}
                    loading='lazy'
                  />
                  <span className={styles.scrim} />
                </div>
                {(tile.item.title || tile.item.subtitle) && (
                  <span className={styles.meta}>
                    {tile.item.title ? <span>{tile.item.title}</span> : null}
                    {tile.item.subtitle ? <small>{tile.item.subtitle}</small> : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type='button'
          aria-label='Reset focused zoom'
          className={styles.focusScrim}
          onClick={(event) => {
            event.stopPropagation();
            handleResetFocus();
          }}
          data-active={focus.active && effectiveFocusEnabled ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}
