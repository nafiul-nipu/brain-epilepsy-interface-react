import { useState, useEffect } from "react";
import { json } from "d3";

export const useSamples = ({
    patientID,
    sampleName
}) => {
    // console.log(sampleName)
    const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/${patientID}/${sampleName}/${sampleName}.json`
    const [data, setData] = useState(null);

    useEffect(() => {
        // const row = d => {
        //     d.start = +d.start;
        //     // d.end = +d.end;
        //     d.frequency = +d.frequency;
        //     // d.startPosition = JSON.parse(d.startPosition);
        //     // d.endPosition = JSON.parse(d.endPosition);
        //     d.startPosition = JSON.parse(d.startPosition);
        //     return d;
        // }
        json(url).then(jdata => {
            setData(jdata)
        });
    }, [url])

    return data

}