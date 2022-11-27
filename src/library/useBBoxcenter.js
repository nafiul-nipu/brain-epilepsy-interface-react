import { useState, useEffect } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const useBBoxcenter = ({
    objType
}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        let loader = new OBJLoader();

        loader.load(`${objType}`, function (obj) {
            let objBbox = new THREE.Box3().setFromObject(obj);
            let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
            bboxCenter.multiplyScalar(-1);
            setData(bboxCenter);
        })
    }, [objType])

    return data;

}