import { useEffect, useState } from "react"
import { json } from "d3";

export const useEventData = ({
    patientID,
    sample
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID && sample) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/${patientID}/${sample}/${sample}_events.json`;

            json(url).then(jData => {
                setData(jData);
            })

        }
    }, [patientID, sample])

    return data;
}