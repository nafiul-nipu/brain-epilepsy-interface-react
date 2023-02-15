//importing react callbacks
import { useState, useEffect } from "react";
//three js object loader
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import dataRegisty from '../data/dataRegistry.json'

export const useLesionData = ({
    patient, //patient ID
}) => {
    // configure data state
    // three OBJ for three view another for bbox
    const [data, setData] = useState(null);

    useEffect(() => {
        function loadLesions(callback) {
            return new Promise((resolve) => {
                let lesions = []
                // three js OBJ loader
                for (let i = 1; i < dataRegisty[patient].lesions + 1; i++) {
                    let loader = new OBJLoader();
                    loader.path = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/${patient}/`

                    // loading the OBJ and save as state
                    loader.load(`${patient}_lesion${i}.obj`, function (obj) {
                        lesions.push(obj.clone())
                        // console.log(obj)
                    })
                }
                callback(lesions)
                resolve();

            })
        }

        async function waitForLoasLesions() {
            await loadLesions(async (lesions) => {
                // console.log(lesions)
                setData(lesions)
            })
        }

        waitForLoasLesions();

    }, [patient])

    return data;

}