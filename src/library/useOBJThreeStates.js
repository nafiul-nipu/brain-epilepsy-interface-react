//importing react callbacks
import { useState, useEffect } from "react";
//three js object loader
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const useOBJThreeStates = ({
    patient, //patient ID
    objType //type of object (e.g., brain, lesions)
}) => {
    // configure data state
    // three OBJ for three view another for bbox
    const [data, setData] = useState({
        obj1: null,
        // obj2: null,
        // obj3: null,
        // obj4: null
    });

    useEffect(() => {
        // console.log('patient', patient, 'objtype', objType)
        // three js OBJ loader
        let loader = new OBJLoader();
        loader.path = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/${patient}/`

        // loading the OBJ and save as state
        loader.load(`${patient}_${objType}`, function (obj) {
            // console.log(obj)
            setData({
                obj1: obj.clone(),
                // obj2: obj.clone(),
                // obj3: obj.clone(),
                // obj4: obj.clone()
            });
        },
            function (error) {
                setData({
                    obj1: null,
                    // obj2: null
                })
            })
    }, [objType, patient])

    return data;

}