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
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/newPrototypeDesign/frontend/src/data/electrodes/${patientID}/${sample}/${patientID}_${sample}_full_network_event_new.json`;

            // console.log(url);
            json(url).then(jData => {
                // Convert roi, network source and target, and matrix to numeric values
                const formattedData = Object.values(jData).map(function (item) {
                    return item.map(function (d) {
                        // console.log(d)
                        return {
                            roi: d.roi === 'rest' ? d.roi : +d.roi,
                            network: d.network.map(function (n) {
                                return {
                                    source: +n.source,
                                    target: +n.target
                                };
                            }),
                            matrix: d.matrix ? d.matrix.map(function (row) {
                                // console.log(row)
                                return row.map(function (value) {
                                    return +value;
                                });
                            }) : null
                        };
                    });
                });

                setData(formattedData);
            })

        }
    }, [patientID, sample])

    return data;
}

