import { useEffect, useState } from "react"
import { json } from "d3";

export const usePatchData = ({
    patientID,
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/electrodes/${patientID}/${patientID}_patch_summary.json`
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