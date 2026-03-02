'use client';

import { Canvas } from '@react-three/fiber';
import type { RoomConfig } from '../_data/rooms';
import { SceneRoot } from './SceneRoot';

type WebGLCanvasProps = {
  rooms: RoomConfig[];
  onReady?: () => void;
};

export default function WebGLCanvas({ rooms, onReady }: WebGLCanvasProps) {
  return (
    <div className='pointer-events-none fixed inset-0 z-0'>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        camera={{ fov: 45, position: [0, 1.2, 6] }}
        onCreated={() => onReady?.()}
      >
        <SceneRoot rooms={rooms} />
      </Canvas>
    </div>
  );
}
