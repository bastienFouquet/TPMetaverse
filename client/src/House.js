import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function House({ color }) {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  return (
    <mesh position={[0, 0, 0]} ref={mesh}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default House;
