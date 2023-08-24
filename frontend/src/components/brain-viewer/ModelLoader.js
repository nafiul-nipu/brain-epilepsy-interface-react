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

      if (boxURL === null) { //load brain
        let objBbox = new THREE.Box3().setFromObject(obj);
        let boundingBoxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
        boundingBoxCenter.multiplyScalar(-1);
        child.geometry.translate(boundingBoxCenter.x, boundingBoxCenter.y, boundingBoxCenter.z);
      } else {
        let loader = new OBJLoader();
        // load the OBJ
        loader.load(boxURL, function (bobj) {
          // create box
          let objBbox = new THREE.Box3().setFromObject(bobj);
          // get the center of the box and set it
          let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
          bboxCenter.multiplyScalar(-1);
          console.log(bboxCenter)
          child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
        })

      }
    }

  });

  return (
    <primitive object={obj} />
  );
};

export default CustomOBJModel;
