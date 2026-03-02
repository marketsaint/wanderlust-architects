'use client';

import { useRef, type MutableRefObject } from 'react';
import { Color } from 'three';
import { CameraRig } from './CameraRig';
import { Rooms } from './Rooms';
import { BlueprintOverlay } from './BlueprintOverlay';
import type { RoomConfig } from '../_data/rooms';

type SceneRootProps = {
  rooms: RoomConfig[];
};

export type MotionRefs = {
  progressRef: MutableRefObject<number>;
  mixRef: MutableRefObject<number>;
  activeRoomRef: MutableRefObject<number>;
};

export function SceneRoot({ rooms }: SceneRootProps) {
  const progressRef = useRef(0);
  const mixRef = useRef(0);
  const activeRoomRef = useRef(0);

  const motionRefs: MotionRefs = {
    progressRef,
    mixRef,
    activeRoomRef
  };

  return (
    <>
      <color attach='background' args={[new Color('#050505')]} />
      <fog attach='fog' args={['#050505', 7, 30]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 7, 2]} intensity={0.8} color={'#f1f1f1'} />
      <directionalLight position={[-5, 3, -8]} intensity={0.45} color={'#d9d9d9'} />

      <Rooms rooms={rooms} motionRefs={motionRefs} />
      <BlueprintOverlay rooms={rooms} motionRefs={motionRefs} />
      <CameraRig rooms={rooms} motionRefs={motionRefs} />
    </>
  );
}
