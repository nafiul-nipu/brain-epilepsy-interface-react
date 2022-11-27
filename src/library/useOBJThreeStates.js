import { useState, useEffect } from "react";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
export const useOBJThreeStates = ({
    objType
}) => {
    const [data, setData] = useState({
        obj1: null,
        obj2: null,
        obj3: null,
        obj4: null
    });

    useEffect(() => {
        let loader = new OBJLoader();

        loader.load(`${objType}`, function (obj) {
            setData({
                obj1: obj.clone(),
                obj2: obj.clone(),
                obj3: obj.clone(),
                obj4: obj.clone()
            });
        })
    }, [objType])

    return data;

}