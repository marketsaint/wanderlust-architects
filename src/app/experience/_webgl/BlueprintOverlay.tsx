'use client';

import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import type { MotionRefs } from './SceneRoot';
import type { RoomConfig } from '../_data/rooms';
import { clamp01 } from '../_data/rooms';

type BlueprintOverlayProps = {
  rooms: RoomConfig[];
  motionRefs: MotionRefs;
};

const roomDepth = (index: number) => -index * 4.2;

function roomPresence(progress: number, room: RoomConfig): number {
  const mid = (room.start + room.end) * 0.5;
  const radius = 0.26;
  return clamp01(1 - Math.abs(progress - mid) / radius);
}

export function BlueprintOverlay({ rooms, motionRefs }: BlueprintOverlayProps) {
  const lineMats = useRef<Array<Array<{ opacity: number; transparent: boolean }>>>([]);
  const roomGroups = useRef<Group[]>([]);

  const registerLineMaterial = (roomIndex: number, material: { opacity: number; transparent: boolean }) => {
    const current = lineMats.current[roomIndex] || [];
    if (current.includes(material)) return;
    lineMats.current[roomIndex] = [...current, material];
  };

  useFrame((_, delta) => {
    const progress = motionRefs.progressRef.current;
    const mix = motionRefs.mixRef.current;

    for (let i = 0; i < rooms.length; i += 1) {
      const mats = lineMats.current[i] || [];
      const group = roomGroups.current[i];
      if (!group) continue;

      const presence = roomPresence(progress, rooms[i]);
      const targetOpacity = presence * (1 - mix) * 0.9;
      group.position.y += (0.01 - group.position.y) * Math.min(1, delta * 1.8);

      mats.forEach((material) => {
        material.opacity += (targetOpacity - material.opacity) * Math.min(1, delta * 7);
      });
    }
  });

  return (
    <group>
      {rooms.map((room, roomIndex) => (
        <group
          key={`bp-${room.id}`}
          position={[0, 0.01, roomDepth(roomIndex)]}
          ref={(value) => {
            if (value) roomGroups.current[roomIndex] = value;
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[6, 4.8]} />
            <meshBasicMaterial transparent opacity={0} />
            <Edges
              color='#d8d8d8'
              threshold={20}
              ref={(value) => {
                const mat = value?.material as { opacity: number; transparent: boolean } | undefined;
                if (!mat) return;
                mat.transparent = true;
                mat.opacity = 0;
                registerLineMaterial(roomIndex, mat);
              }}
            />
          </mesh>

          <mesh position={[0, 1.7, -2.4]}>
            <boxGeometry args={[6, 3.4, 0.02]} />
            <meshBasicMaterial transparent opacity={0} />
            <Edges
              color='#cfcfcf'
              threshold={18}
              ref={(value) => {
                const mat = value?.material as { opacity: number; transparent: boolean } | undefined;
                if (!mat) return;
                mat.transparent = true;
                mat.opacity = 0;
                registerLineMaterial(roomIndex, mat);
              }}
            />
          </mesh>

          <mesh position={[0.2, 1.35, -1.2]}>
            <boxGeometry args={[2.2, 2.5, 0.12]} />
            <meshBasicMaterial transparent opacity={0} />
            <Edges
              color='#ececec'
              threshold={16}
              ref={(value) => {
                const mat = value?.material as { opacity: number; transparent: boolean } | undefined;
                if (!mat) return;
                mat.transparent = true;
                mat.opacity = 0;
                registerLineMaterial(roomIndex, mat);
              }}
            />
          </mesh>

          {[[-2.2, 1.25, -0.8], [2.2, 1.25, -1.6], [0.4, 1.25, -2.1]].map((pos, idx) => (
            <mesh key={`bp-col-${idx}`} position={pos as [number, number, number]}>
              <cylinderGeometry args={[0.12, 0.12, 2.5, 14]} />
              <meshBasicMaterial transparent opacity={0} />
              <Edges
                color='#e5e5e5'
                threshold={10}
                ref={(value) => {
                  const mat = value?.material as { opacity: number; transparent: boolean } | undefined;
                  if (!mat) return;
                  mat.transparent = true;
                  mat.opacity = 0;
                  registerLineMaterial(roomIndex, mat);
                }}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
