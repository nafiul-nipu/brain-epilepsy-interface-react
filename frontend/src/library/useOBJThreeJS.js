import { useState, useEffect } from "react";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
export const useOBJThreeJS = ({
    objType
}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        let loader = new OBJLoader();

        loader.load(`${objType}`, function (obj) {
            setData(obj);
        })
    }, [objType])

    return data;

}