import { useState, useEffect } from "react";
import { csv } from "d3";

// loading and saving electrode data

export const useElectrodeData = ({ id }) => {
    // console.log(url)
    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', id)
        if (id) {
            // console.log('after', id)
            const electrodeURL = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/${id}/${id}_electrodes_new.csv`
            const row = d => {
                d.electrode_number = +d.electrode_number;
                d.position = JSON.parse(d.position)
                // d.newPosition = JSON.parse(d.newPosition)
                return d
            }
            csv(electrodeURL, row).then(setData)
        }

    }, [id])

    return data;
}

