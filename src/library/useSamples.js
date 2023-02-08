import { useState, useEffect } from "react";
import { csv } from "d3";

export const useSamples = ({ sampleName }) => {
    // console.log(sampleName)
    const [data, setData] = useState(null);
    let promises = []
    sampleName.forEach(element => {
        promises.push(csv(element))
    });

    useEffect(() => {
        console.log(promises)
        Promise.all(promises).then(function (values) {
            // console.log(values)
            setData(values)
        });
    }, [promises.length])

    return data

}