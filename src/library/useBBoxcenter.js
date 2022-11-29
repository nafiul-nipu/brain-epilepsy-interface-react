import { useState, useEffect } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// getting the bboxcenter
export const useBBoxcenter = ({
    objType
}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        let loader = new OBJLoader();

        // load the OBJ
        loader.load(`${objType}`, function (obj) {
            // create box
            let objBbox = new THREE.Box3().setFromObject(obj);
            // get the center of the box and set it
            let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
            bboxCenter.multiplyScalar(-1);
            setData(bboxCenter);
        })
    }, [objType])

    return data;

}