//importing react callbacks
import { useState, useEffect } from "react";
//three js object loader
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const useOBJThreeStates = ({
    objType //type of object (e.g., brain, lesions)
}) => {
    // configure data state
    // three OBJ for three view another for bbox
    const [data, setData] = useState({
        obj1: null,
        obj2: null,
        obj3: null,
        obj4: null
    });

    useEffect(() => {
        // three js OBJ loader
        let loader = new OBJLoader();
        loader.path = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/'

        // loading the OBJ and save as state
        loader.load(`${objType}`, function (obj) {
            setData({
                obj1: obj.clone(),
                // obj2: obj.clone(),
                // obj3: obj.clone(),
                // obj4: obj.clone()
            });
        })
    }, [objType])

    return data;

}