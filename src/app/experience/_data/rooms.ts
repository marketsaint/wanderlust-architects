export type Vec3 = [number, number, number];

export type RoomConfig = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  start: number;
  end: number;
  cameraStart: Vec3;
  cameraEnd: Vec3;
  lookAtStart: Vec3;
  lookAtEnd: Vec3;
  blueprintWindow: [number, number];
};

export const rooms: RoomConfig[] = [
  {
    id: 'arrival',
    title: 'Arrival',
    subtitle: 'Threshold planning and first-view choreography.',
    bullets: [
      'Approach axis establishes hierarchy before entry.',
      'Facade rhythm aligns with interior circulation intent.',
      'Entry sequence is calibrated for hospitality and residence scales.'
    ],
    start: 0,
    end: 0.2,
    cameraStart: [0, 1.2, 7.5],
    cameraEnd: [0, 1.2, 4.8],
    lookAtStart: [0, 1, 3.8],
    lookAtEnd: [0, 1, 1.5],
    blueprintWindow: [0.06, 0.58]
  },
  {
    id: 'gallery-hall',
    title: 'Gallery Hall',
    subtitle: 'Long-span order with framed focal moments.',
    bullets: [
      'Program zones line up along a clear structural spine.',
      'View cones are controlled with layered portals.',
      'Public movement and private transitions remain independent.'
    ],
    start: 0.2,
    end: 0.4,
    cameraStart: [0, 1.25, 4.8],
    cameraEnd: [0.4, 1.3, 1.2],
    lookAtStart: [0, 1, 0],
    lookAtEnd: [0.4, 1, -2.6],
    blueprintWindow: [0.08, 0.6]
  },
  {
    id: 'courtyard-light',
    title: 'Courtyard Light',
    subtitle: 'Daylight capture and micro-climate balancing.',
    bullets: [
      'Courtyard void pulls soft light deep into the plan.',
      'Shade edges reduce heat gain while keeping depth readable.',
      'Landscape pockets are integrated with service routes.'
    ],
    start: 0.4,
    end: 0.6,
    cameraStart: [0.4, 1.3, 1.2],
    cameraEnd: [-0.25, 1.35, -2.2],
    lookAtStart: [0.25, 1, -3.2],
    lookAtEnd: [0, 1, -6],
    blueprintWindow: [0.1, 0.62]
  },
  {
    id: 'material-library',
    title: 'Material Library',
    subtitle: 'Detail systems and execution consistency.',
    bullets: [
      'Joinery, edge profiles, and lighting details are coordinated early.',
      'Spec decisions are tied directly to site sequencing.',
      'Documentation aligns vendor conversations with design intent.'
    ],
    start: 0.6,
    end: 0.8,
    cameraStart: [-0.25, 1.35, -2.2],
    cameraEnd: [0.15, 1.25, -5.8],
    lookAtStart: [0, 1, -6],
    lookAtEnd: [0, 1, -8.9],
    blueprintWindow: [0.12, 0.64]
  },
  {
    id: 'penthouse-grid',
    title: 'Penthouse Grid',
    subtitle: 'Final spatial coherence and handover readiness.',
    bullets: [
      'Upper-level planning balances openness with privacy.',
      'Final detailing closes interpretation gaps on site.',
      'Handover is prepared as an execution-ready package.'
    ],
    start: 0.8,
    end: 1,
    cameraStart: [0.15, 1.25, -5.8],
    cameraEnd: [0, 1.3, -9.8],
    lookAtStart: [0, 1, -9],
    lookAtEnd: [0, 1, -12.5],
    blueprintWindow: [0.1, 0.66]
  }
];

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function smoothStep(edge0: number, edge1: number, x: number): number {
  const width = edge1 - edge0;
  if (width <= 0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / width);
  return t * t * (3 - 2 * t);
}

export function getRoomByProgress(progress: number): { roomIndex: number; roomProgress: number } {
  const clamped = clamp01(progress);
  const index = rooms.findIndex((room) => clamped >= room.start && clamped <= room.end);
  const roomIndex = index === -1 ? rooms.length - 1 : index;
  const room = rooms[roomIndex];
  const span = Math.max(0.0001, room.end - room.start);
  const roomProgress = clamp01((clamped - room.start) / span);
  return { roomIndex, roomProgress };
}

export function getBlueprintMix(roomProgress: number, window: [number, number]): number {
  return smoothStep(window[0], window[1], roomProgress);
}
