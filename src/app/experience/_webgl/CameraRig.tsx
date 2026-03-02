'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { RoomConfig } from '../_data/rooms';
import { clamp01, getBlueprintMix, getRoomByProgress, lerpVec3 } from '../_data/rooms';
import type { MotionRefs } from './SceneRoot';

type CameraRigProps = {
  rooms: RoomConfig[];
  motionRefs: MotionRefs;
};

function getDocumentProgress(sections: HTMLElement[]): number {
  if (!sections.length) return 0;

  const first = sections[0];
  const last = sections[sections.length - 1];
  const viewport = window.innerHeight;

  const start = first.offsetTop;
  const end = last.offsetTop + last.offsetHeight;
  const travel = Math.max(1, end - start - viewport * 0.55);
  const y = window.scrollY + viewport * 0.4;

  return clamp01((y - start) / travel);
}

export function CameraRig({ rooms, motionRefs }: CameraRigProps) {
  const { camera } = useThree();
  const targetProgressRef = useRef(0);
  const lookAtRef = useMemo(() => new Vector3(0, 1, 0), []);
  const tmpPos = useMemo(() => new Vector3(), []);
  const tmpLook = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-room-section="true"]'));
    if (!sections.length) return;

    let rafId: number | null = null;
    let paused = document.hidden;

    const compute = () => {
      rafId = null;
      if (paused) return;
      targetProgressRef.current = getDocumentProgress(sections);
    };

    const queueCompute = () => {
      if (rafId != null || paused) return;
      rafId = window.requestAnimationFrame(compute);
    };

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) queueCompute();
    };

    queueCompute();

    window.addEventListener('scroll', queueCompute, { passive: true });
    window.addEventListener('resize', queueCompute);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('scroll', queueCompute);
      window.removeEventListener('resize', queueCompute);
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useFrame((_, delta) => {
    const response = Math.min(1, delta * 3.6);
    motionRefs.progressRef.current += (targetProgressRef.current - motionRefs.progressRef.current) * response;

    const { roomIndex, roomProgress } = getRoomByProgress(motionRefs.progressRef.current);
    motionRefs.activeRoomRef.current = roomIndex;

    const activeRoom = rooms[roomIndex] ?? rooms[rooms.length - 1];
    const camPos = lerpVec3(activeRoom.cameraStart, activeRoom.cameraEnd, roomProgress);
    const lookTarget = lerpVec3(activeRoom.lookAtStart, activeRoom.lookAtEnd, roomProgress);

    motionRefs.mixRef.current = getBlueprintMix(roomProgress, activeRoom.blueprintWindow);

    tmpPos.set(camPos[0], camPos[1], camPos[2]);
    tmpLook.set(lookTarget[0], lookTarget[1], lookTarget[2]);

    camera.position.lerp(tmpPos, 1 - Math.exp(-delta * 4.4));
    lookAtRef.lerp(tmpLook, 1 - Math.exp(-delta * 4.4));
    camera.lookAt(lookAtRef);
  });

  return null;
}
