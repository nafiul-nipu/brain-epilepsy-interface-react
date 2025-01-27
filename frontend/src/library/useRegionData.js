import { useEffect, useState } from "react"
import { json } from "d3";

export const useRegionData = ({
    patientID,
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/syUpdateBranch/frontend/src/data/electrodes/${patientID}/${patientID}_region_summary.json`
            json(url).then(jData => {
                setData(jData)
            }).catch(err => {
                console.log("error", err)
                setData(null)
            })
        }
    }, [patientID])

    return data;
}