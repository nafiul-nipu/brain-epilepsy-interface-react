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
  type
}) => {

  const obj = useLoader(OBJLoader, url);

  let objBbox = new THREE.Box3().setFromObject(obj);
  let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
  bboxCenter.multiplyScalar(-1);

  // console.log(type, bboxCenter)

  // const box = useLoader(OBJLoader, boxURL);

  // console.log(obj)
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
