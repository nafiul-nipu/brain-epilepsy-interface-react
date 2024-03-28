import { useEffect, useState } from "react"
import { json } from "d3";

export const useSamplePropagation = ({
    patientID,
    sampleID,
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID && sampleID) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/syUpdateBranch/frontend/src/data/electrodes/${patientID}/${sampleID}/${patientID}_${sampleID}_propagation.json`
            json(url).then(jData => {
                setData(jData)
            }).catch(err => {
                console.log("error", err)
                setData(null)
            })
        }
    }, [patientID, sampleID])

    return data;
}