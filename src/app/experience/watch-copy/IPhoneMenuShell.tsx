'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import styles from './iphone-menu.module.css';

type ProjectItem = {
  slug: string;
  title: string;
  image: string;
};

type IPhoneMenuShellProps = {
  projects: ProjectItem[];
};

type LayoutSpec = {
  cols: number;
  rows: number;
  iconSize: number;
  pageCapacity: number;
  dockSize: number;
  dockIcon: number;
  frameWidth: number;
  frameHeight: number;
  gapX: number;
  gapY: number;
};

const MOBILE_DOCK = 4;
const DESKTOP_DOCK = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function chunkProjects(items: ProjectItem[], size: number) {
  const chunks: ProjectItem[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function compactTitle(value: string) {
  return value.length > 28 ? `${value.slice(0, 28)}...` : value;
}

function computeLayout(vw: number, vh: number): LayoutSpec {
  const isDesktop = vw >= 1024;

  if (isDesktop) {
    const frameWidth = clamp(Math.round(vw * 0.94), 1080, 1700);
    const frameHeight = clamp(Math.round(vh * 0.9), 680, 980);
    const cols = clamp(Math.floor((frameWidth - 160) / 194), 5, 9);
    const rows = clamp(Math.floor((frameHeight - 230) / 194), 3, 5);
    const gapX = clamp(Math.round(frameWidth * 0.018), 16, 30);
    const gapY = clamp(Math.round(frameHeight * 0.018), 16, 28);
    const iconSize = clamp(Math.floor((frameWidth - 110 - gapX * (cols - 1)) / cols), 116, 182);
    const dockIcon = clamp(Math.round(iconSize * 0.75), 88, 132);

    return {
      cols,
      rows,
      iconSize,
      pageCapacity: cols * rows,
      dockSize: DESKTOP_DOCK,
      dockIcon,
      frameWidth,
      frameHeight,
      gapX,
      gapY
    };
  }

  const frameWidth = Math.max(vw - 14, 320);
  const frameHeight = Math.max(vh - 14, 560);
  const cols = vw < 420 ? 4 : vw < 768 ? 4 : 5;
  const rows = vw < 420 ? 5 : 5;
  const gapX = vw < 420 ? 10 : 12;
  const gapY = 14;
  const iconSize = clamp(Math.floor((frameWidth - 28 - gapX * (cols - 1)) / cols), 78, 112);
  const dockIcon = clamp(Math.round(iconSize * 0.88), 70, 96);

  return {
    cols,
    rows,
    iconSize,
    pageCapacity: cols * rows,
    dockSize: MOBILE_DOCK,
    dockIcon,
    frameWidth,
    frameHeight,
    gapX,
    gapY
  };
}

export function IPhoneMenuShell({ projects }: IPhoneMenuShellProps) {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const iconRafRef = useRef<number | null>(null);

  const [layout, setLayout] = useState<LayoutSpec>(() => computeLayout(1280, 800));
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const update = () => setLayout(computeLayout(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (reducedMotion || !stageRef.current) return undefined;

    const node = stageRef.current;
    let rafId = 0;

    const applyVars = (clientX: number, clientY: number) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const bounds = node.getBoundingClientRect();
        const x = ((clientX - bounds.left) / bounds.width) * 100;
        const y = ((clientY - bounds.top) / bounds.height) * 100;
        node.style.setProperty('--mx', `${clamp(x, 0, 100)}%`);
        node.style.setProperty('--my', `${clamp(y, 0, 100)}%`);
      });
    };

    const onMove = (event: PointerEvent) => applyVars(event.clientX, event.clientY);
    const onLeave = () => {
      node.style.setProperty('--mx', '50%');
      node.style.setProperty('--my', '45%');
    };

    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  useEffect(
    () => () => {
      if (iconRafRef.current) cancelAnimationFrame(iconRafRef.current);
    },
    []
  );

  const dockApps = useMemo(() => projects.slice(0, layout.dockSize), [projects, layout.dockSize]);
  const pagedApps = useMemo(() => {
    const rest = projects.slice(layout.dockSize);
    return chunkProjects(rest, Math.max(1, layout.pageCapacity));
  }, [projects, layout.dockSize, layout.pageCapacity]);

  const pageCount = Math.max(1, pagedApps.length);

  useEffect(() => {
    setCurrentPage((prev) => clamp(prev, 0, pageCount - 1));
  }, [pageCount]);

  const goToPage = (index: number) => {
    const node = pagesRef.current;
    if (!node) return;
    const next = clamp(index, 0, pageCount - 1);
    node.scrollTo({
      left: next * node.clientWidth,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    setCurrentPage(next);
  };

  const cssVars = {
    '--cols': `${layout.cols}`,
    '--rows': `${layout.rows}`,
    '--icon-size': `${layout.iconSize}px`,
    '--dock-icon': `${layout.dockIcon}px`,
    '--frame-width': `${layout.frameWidth}px`,
    '--frame-height': `${layout.frameHeight}px`,
    '--gap-x': `${layout.gapX}px`,
    '--gap-y': `${layout.gapY}px`
  } as CSSProperties;

  return (
    <main
      ref={stageRef}
      className={styles.root}
      style={cssVars}
      aria-label='Apple style project app showcase'
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goToPage(currentPage + 1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goToPage(currentPage - 1);
        }
      }}
    >
      <div className={styles.wallpaper} />
      <div className={styles.overlay} />

      <section className={styles.surface}>
        <p className={styles.hint}>Hover to preview • Click to open</p>

        <section className={styles.pagesWrap}>
          <div
            ref={pagesRef}
            className={styles.pages}
            onScroll={(event) => {
              const node = event.currentTarget;
              const width = node.clientWidth || 1;
              const page = Math.round(node.scrollLeft / width);
              setCurrentPage(page);
            }}
          >
            {(pagedApps.length ? pagedApps : [projects]).map((page, pageIndex) => (
              <div className={styles.page} key={`page-${pageIndex}`}>
                <div className={styles.grid}>
                  {page.map((project, index) => (
                    <motion.div
                      key={`${project.slug}-${pageIndex}`}
                      initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
                      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.46, ease: [0.16, 1, 0.3, 1], delay: pageIndex * 0.04 + index * 0.012 }
                      }
                      whileHover={
                        reducedMotion
                          ? undefined
                          : {
                              y: -16,
                              scale: 1.06,
                              transition: { type: 'spring', stiffness: 360, damping: 18, mass: 0.65 }
                            }
                      }
                      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className={styles.app}
                        aria-label={`Open ${project.title}`}
                        title={project.title}
                        onPointerMove={(event) => {
                          if (reducedMotion) return;
                          const node = event.currentTarget as HTMLElement;
                          const bounds = node.getBoundingClientRect();
                          const dx = (event.clientX - bounds.left) / bounds.width - 0.5;
                          const dy = (event.clientY - bounds.top) / bounds.height - 0.5;
                          const rx = clamp(-dy * 12, -12, 12);
                          const ry = clamp(dx * 12, -12, 12);
                          const hx = clamp((dx + 0.5) * 100, 0, 100);
                          const hy = clamp((dy + 0.5) * 100, 0, 100);

                          if (iconRafRef.current) cancelAnimationFrame(iconRafRef.current);
                          iconRafRef.current = requestAnimationFrame(() => {
                            node.style.setProperty('--tilt-x', `${rx}deg`);
                            node.style.setProperty('--tilt-y', `${ry}deg`);
                            node.style.setProperty('--spark-x', `${hx}%`);
                            node.style.setProperty('--spark-y', `${hy}%`);
                          });
                        }}
                        onPointerLeave={(event) => {
                          const node = event.currentTarget as HTMLElement;
                          node.style.setProperty('--tilt-x', '0deg');
                          node.style.setProperty('--tilt-y', '0deg');
                          node.style.setProperty('--spark-x', '50%');
                          node.style.setProperty('--spark-y', '50%');
                        }}
                      >
                        <span className={styles.icon}>
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes={`(max-width: 1024px) ${layout.iconSize}px, ${layout.iconSize}px`}
                            className={styles.iconImage}
                            priority={pageIndex === 0 && index < 16}
                          />
                        </span>
                        <span className={styles.hoverName}>{compactTitle(project.title)}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {pageCount > 1 ? (
            <div className={styles.pageDots} aria-hidden>
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type='button'
                  className={index === currentPage ? styles.dotActive : styles.dot}
                  aria-label={`Go to page ${index + 1}`}
                  onClick={() => goToPage(index)}
                />
              ))}
            </div>
          ) : null}
        </section>

        <div className={styles.dock}>
          {dockApps.map((project) => (
            <motion.div
              key={`dock-${project.slug}`}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.09,
                      transition: { type: 'spring', stiffness: 340, damping: 18, mass: 0.66 }
                    }
              }
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            >
              <Link href={`/projects/${project.slug}`} className={styles.dockApp} aria-label={`Open ${project.title}`}>
                <span className={styles.dockIcon}>
                  <Image src={project.image} alt={project.title} fill sizes={`${layout.dockIcon}px`} className={styles.iconImage} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
