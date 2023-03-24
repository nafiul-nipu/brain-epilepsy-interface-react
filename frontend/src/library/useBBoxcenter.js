import { useState, useEffect } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// getting the bboxcenter
export const useBBoxcenter = ({
    patient,
    objType
}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log(patient, objType)
        let loader = new OBJLoader();
        loader.path = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/${patient}/`

        // load the OBJ
        loader.load(`${patient}_${objType}`, function (obj) {
            // create box
            let objBbox = new THREE.Box3().setFromObject(obj);
            // get the center of the box and set it
            let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
            bboxCenter.multiplyScalar(-1);
            setData(bboxCenter);
        })
    }, [objType, patient])

    return data;

}