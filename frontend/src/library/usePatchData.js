import { useEffect, useState } from "react"
import { json } from "d3";

export const usePatchData = ({
    patientID,
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID) {
            let tempDir = {}
            const roi0_url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/syUpdateBranch/frontend/src/data/electrodes/${patientID}/roi0_electrodes.json`
            const roi1_url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/syUpdateBranch/frontend/src/data/electrodes/${patientID}/roi1_electrodes.json`
            const roi2_url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/syUpdateBranch/frontend/src/data/electrodes/${patientID}/roi2_electrodes.json`
            json(roi0_url).then(jData => {
                tempDir[0] = jData
            })
            json(roi1_url).then(jData => {
                tempDir[1] = jData
            })
            json(roi2_url).then(jData => {
                tempDir[2] = jData
            })
            setData(tempDir)
        }
    }, [patientID])

    return data;
}