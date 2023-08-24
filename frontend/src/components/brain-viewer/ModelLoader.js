import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const CustomOBJModel = ({
  url,
  color,
  opacity,
  transparent,
  center,
}) => {
  const objRef = useRef();

  const obj = useLoader(OBJLoader, url);

  // console.log(obj)
  // console.log(center)
  // If you want to manipulate the material properties of the loaded model
  obj.traverse((child) => {

    if (child instanceof THREE.Mesh) {
      child.material.color = new THREE.Color(color);
      child.material.opacity = opacity;
      child.material.transparent = transparent;
      // child.geometry.translate(center.x, center.y, center.z);
    }
  });

  return (
    <primitive object={obj} />
  );
};

export default CustomOBJModel;
