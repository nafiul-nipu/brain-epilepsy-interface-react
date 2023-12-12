import React from "react";
import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const CustomOBJModel = ({
  url,
  color,
  opacity,
  transparent,
  type,
  renderOrer,
}) => {

  const obj = useLoader(OBJLoader, url);

  // useEffect(() => {
  //   if (type === "left") {
  //     obj.position.x -= 28;
  //     obj.position.z += 10;
  //   } else if (type === "right") {
  //     obj.position.x += 0;
  //     obj.position.z += 10;
  //   }
  //   obj.renderOrer = renderOrer;
  // }, [type, renderOrer]);

  // If you want to manipulate the material properties of the loaded model
  obj.traverse((child) => {

    if (child instanceof THREE.Mesh) {
      child.material.color = new THREE.Color(color);
      child.material.opacity = opacity;
      child.material.transparent = transparent;
    }

  });
  // console.log(type, obj.position.x, obj.position.y, obj.position.z)

  return (
    <group>
      <primitive object={obj.clone()} />
    </group>
  );
};

export default CustomOBJModel;
