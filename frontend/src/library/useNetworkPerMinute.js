import { useEffect, useState } from "react"
import { json } from "d3";

export const useNetworkPerMinute = ({
    patientID
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', patientID, sample)
        if (patientID) {
            // console.log('after', patientID, sample)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/electrodes/${patientID}/${patientID}_network_per_minute.json`;

            json(url).then(jData => {
                setData(jData);
            }).catch(err => {
                console.log("error", err)
                setData(null)
            })

        }
    }, [patientID])

    return data;
}