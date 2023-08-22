import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const CustomOBJModel = ({ url, color, opacity, transparent }) => {
  const objRef = useRef();
  
  const obj = useLoader(OBJLoader, url);

  console.log(obj)
  // If you want to manipulate the material properties of the loaded model
  obj.traverse((child) => {
    let objBbox = new THREE.Box3().setFromObject(obj);
    let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
    bboxCenter.multiplyScalar(-1);
    if (child instanceof THREE.Mesh) {
      child.material.color = new THREE.Color(color);
      child.material.opacity = opacity;
      child.material.transparent = transparent;

      child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
    }
  });

  return (
    <group ref={objRef} position={[0,0,0]}>
      <primitive object={obj} />
    </group>
  );
};

export default CustomOBJModel;
