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
        // console.log('useSample', patientID, sampleName, range)
        if (patientID && sampleName && range) {
            // console.log("inside", patientID, sampleName, range)
            // const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/dynamic_community/frontend/src/data/electrodes/${patientID}/${sampleName}/${sampleName}_${range}.json`
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/dynamic_community/frontend/src/data/electrodes//${patientID}/${sampleName}/${sampleName}_${range}_with_network.json`
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

                let numericData = jdata.map(function (item) {
                    return {
                        "time": +item.time,
                        "electrodes": item.electrodes.map(function (val) {
                            return +val;
                        }),
                        "timeList": item.timeList.map(function (val) {
                            return +val;
                        })


                    };
                });

                setData(numericData)
            });
        }

    }, [patientID, range, sampleName])

    return data

}