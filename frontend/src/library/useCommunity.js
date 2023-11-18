import { useState, useEffect } from "react";
import { json } from "d3";

export const useCommunity = ({
    patientID,
    sampleName,
    range
}) => {
    // console.log(sampleName)
    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('useSample', patientID, sampleName, range)
        if (patientID && sampleName && range) {
            // console.log("inside", patientID, sampleName, range)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/dynamic_community/frontend/src/data/communities/${patientID}_${sampleName}_communities.json`
            // console.log(url)
            json(url).then(jdata => {
                // console.log(jdata)
                // let numericData = jdata.map(function (item) {
                //     return item.map(function (d) {
                //         d.start = +d.start;
                //         d.startPosition = d.startPosition.map(function (val) {
                //             return +val;
                //         });
                //         d.frequency = +d.frequency;

                //         return d;
                //     });
                // });

                setData(jdata)
            });
        }

    }, [patientID, range, sampleName])

    return data

}