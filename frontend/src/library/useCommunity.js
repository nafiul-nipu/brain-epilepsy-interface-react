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
            // const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/communities/${patientID}_communities.json`
            // const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/communities/${patientID}_static_communities.json`
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/communities/${patientID}_quantile_communities.json`
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
            }).catch(err => {
                console.log("error", err)
                setData(null)
            });
        }

    }, [patientID, range, sampleName])

    return data

}