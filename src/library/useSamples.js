import { useState, useEffect } from "react";
import { json } from "d3";

export const useSamples = ({
    patientID,
    sampleName,
    range
}) => {
    // console.log(sampleName)
    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID && sampleName) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/${patientID}/${sampleName}/${sampleName}_${range}.json`
            // console.log(url)
            json(url).then(jdata => {
                setData(jdata)
            });
        }

    }, [patientID, range, sampleName])

    return data

}