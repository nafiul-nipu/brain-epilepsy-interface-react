import { useEffect, useState } from "react"
import { json } from "d3";

export const useFullNetworkPerEvent = ({
    patientID,
    sample
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', patientID, sample)
        if (patientID && sample) {
            // console.log('after', patientID, sample)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/${patientID}/${sample}/${patientID}_${sample}_full_network_event.json`;

            json(url).then(jData => {
                // const filteredData = jData.filter((item) => item.count > 1)
                // setData(filteredData);
                setData(jData);
            })

        }
    }, [patientID, sample])

    return data;
}

