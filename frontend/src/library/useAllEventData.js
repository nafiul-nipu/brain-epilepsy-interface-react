import { useEffect, useState } from "react"
import { json } from "d3";

export const useAllEventData = ({
    patientID
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', patientID, sample)
        if (patientID) {
            // console.log('after', patientID, sample)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/frontend/src/data/electrodes/${patientID}/${patientID}_all_events.json`;

            json(url).then(jData => {
                // const filteredData = jData.filter((item) => item.count > 1)
                // setData(filteredData);
                setData(jData);
            })

        }
    }, [patientID])

    return data;
}