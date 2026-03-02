'use client';

import { useEffect, useRef } from 'react';
import { Group, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import type { MotionRefs } from './SceneRoot';
import type { RoomConfig } from '../_data/rooms';
import { clamp01 } from '../_data/rooms';

type RoomsProps = {
  rooms: RoomConfig[];
  motionRefs: MotionRefs;
};

type RoomMaterials = {
  floor: MeshStandardMaterial | null;
  wallA: MeshStandardMaterial | null;
  wallB: MeshStandardMaterial | null;
  portal: MeshStandardMaterial | null;
  columns: MeshStandardMaterial[];
  beams: MeshStandardMaterial[];
};

const roomDepth = (index: number) => -index * 4.2;

function roomPresence(progress: number, room: RoomConfig): number {
  const mid = (room.start + room.end) * 0.5;
  const radius = 0.24;
  return clamp01(1 - Math.abs(progress - mid) / radius);
}

function RoomUnit({ index, register }: { index: number; register: (mats: RoomMaterials) => void }) {
  const local = useRef<RoomMaterials>({
    floor: null,
    wallA: null,
    wallB: null,
    portal: null,
    columns: [],
    beams: []
  });

  useEffect(() => {
    register(local.current);
  }, [register]);

  return (
    <group position={[0, 0, roomDepth(index)]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 4.8]} />
        <meshStandardMaterial ref={(value) => (local.current.floor = value)} color='#1a1a1a' roughness={0.96} metalness={0.04} transparent opacity={0.2} />
      </mesh>

      <mesh position={[0, 1.7, -2.4]}>
        <planeGeometry args={[6, 3.4]} />
        <meshStandardMaterial ref={(value) => (local.current.wallA = value)} color='#151515' roughness={0.93} metalness={0.05} transparent opacity={0.2} />
      </mesh>

      <mesh position={[-3, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.8, 3.4]} />
        <meshStandardMaterial ref={(value) => (local.current.wallB = value)} color='#131313' roughness={0.95} metalness={0.05} transparent opacity={0.2} />
      </mesh>

      <mesh position={[0.2, 1.35, -1.2]}>
        <boxGeometry args={[2.2, 2.5, 0.12]} />
        <meshStandardMaterial ref={(value) => (local.current.portal = value)} color='#282828' roughness={0.62} metalness={0.12} transparent opacity={0.2} />
      </mesh>

      {[[-2.2, 1.25, -0.8], [2.2, 1.25, -1.6], [0.4, 1.25, -2.1]].map((pos, idx) => (
        <mesh key={`col-${idx}`} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.12, 0.12, 2.5, 16]} />
          <meshStandardMaterial
            ref={(value) => {
              if (value) local.current.columns[idx] = value;
            }}
            color='#3a3a3a'
            roughness={0.66}
            metalness={0.14}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}

      {[[-1.4, 2.58, -0.4], [1.1, 2.58, -1.9], [0, 2.58, -2.9]].map((pos, idx) => (
        <mesh key={`beam-${idx}`} position={pos as [number, number, number]} rotation={[0, 0.04 * (idx - 1), 0]}>
          <boxGeometry args={[2.5, 0.08, 0.12]} />
          <meshStandardMaterial
            ref={(value) => {
              if (value) local.current.beams[idx] = value;
            }}
            color='#5a5a5a'
            roughness={0.45}
            metalness={0.15}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Rooms({ rooms, motionRefs }: RoomsProps) {
  const groupsRef = useRef<Group[]>([]);
  const materialsRef = useRef<RoomMaterials[]>([]);

  useFrame((_, delta) => {
    const progress = motionRefs.progressRef.current;
    const mix = motionRefs.mixRef.current;

    for (let i = 0; i < rooms.length; i += 1) {
      const room = rooms[i];
      const mats = materialsRef.current[i];
      const group = groupsRef.current[i];
      if (!mats || !group) continue;

      const presence = roomPresence(progress, room);
      const renderOpacity = presence * (0.12 + 0.88 * mix);

      group.position.y += (0 - group.position.y) * Math.min(1, delta * 2.2);
      group.rotation.y += (0.015 * (i % 2 === 0 ? 1 : -1) - group.rotation.y) * Math.min(1, delta * 1.6);

      const materials = [mats.floor, mats.wallA, mats.wallB, mats.portal, ...mats.columns, ...mats.beams];
      materials.forEach((material) => {
        if (!material) return;
        material.opacity += (renderOpacity - material.opacity) * Math.min(1, delta * 5.4);
      });
    }
  });

  return (
    <group>
      {rooms.map((room, index) => (
        <group
          key={room.id}
          ref={(value) => {
            if (value) groupsRef.current[index] = value;
          }}
        >
          <RoomUnit
            index={index}
            register={(mats) => {
              materialsRef.current[index] = mats;
            }}
          />
        </group>
      ))}
    </group>
  );
}
