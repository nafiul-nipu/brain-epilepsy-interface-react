import { useEffect, useState } from "react"
import { json } from "d3";

export const useSimilarRegion = ({
    patientID,
    sample
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', patientID, sample)
        if (patientID && sample) {
            // console.log('after', patientID, sample)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/newPrototypeDesign/frontend/src/data/electrodes/${patientID}/${sample}/${patientID}_${sample}_similarRegion.json`;

            json(url).then(jData => {
                // console.log(jData)
                let numericData = jData.map(function (item) {
                    return {
                        eventID: +item.eventID,
                        neighbors: item.neighbors.map(function (val) {
                            return +val;
                        })
                    };
                });

                setData(numericData);
            })

        }
    }, [patientID, sample])

    return data;
}

