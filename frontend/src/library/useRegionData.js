import { useEffect, useState } from "react"
import { json } from "d3";

export const useRegionData = ({
    patientID,
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/electrodes/${patientID}/${patientID}_region_summary.json`
            json(url).then(jData => {
                setData(jData)
            })
        }
    }, [patientID])

    return data;
}