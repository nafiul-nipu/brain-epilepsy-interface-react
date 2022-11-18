import { useState, useEffect } from "react";
import * as THREE from 'three';

export const useBBoxcenter = ({
    obj
}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (obj !== null) {
            console.log(obj)
            let objBbox = new THREE.Box3().setFromObject(obj);
            let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
            bboxCenter.multiplyScalar(-1);
            setData(bboxCenter);
        }

    }, [obj])

    return data;

}