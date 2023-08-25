import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const CustomOBJModel = ({
  url,
  color,
  opacity,
  transparent,
  boxURL = null,
  center
}) => {

  const obj = useLoader(OBJLoader, url);

  // const box = useLoader(OBJLoader, boxURL);

  console.log(obj)
  // console.log(center)
  // If you want to manipulate the material properties of the loaded model
  obj.traverse((child) => {

    if (child instanceof THREE.Mesh) {
      child.material.color = new THREE.Color(color);
      child.material.opacity = opacity;
      child.material.transparent = transparent;
    }

  });

  return (
    <group>
      <primitive object={obj} />
    </group>
  );
};

export default CustomOBJModel;
