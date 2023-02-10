import { useState, useEffect } from "react";
import { json } from "d3";

export const useSamples = ({
    patientID,
    sampleName
}) => {
    // console.log(sampleName)
    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID && sampleName) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/${patientID}/${sampleName}/${sampleName}.json`
            json(url).then(jdata => {
                setData(jdata)
            });
        }

    }, [patientID, sampleName])

    return data

}