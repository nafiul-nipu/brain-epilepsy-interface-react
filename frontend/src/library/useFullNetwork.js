import { useEffect, useState } from "react"
import { json } from "d3";

export const useFullNetwork = ({
    patientID,
    sample
}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('before', patientID, sample)
        if (patientID && sample) {
            // console.log('after', patientID, sample)
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/${patientID}/${sample}/${patientID}_${sample}_full_network_new.json`;

            json(url).then(jData => {
                // console.log(jData)

                let numericData = jData.map(function (d) {
                    // Convert roi, network source and target to numeric
                    d.roi = d.roi === 'rest' ? d.roi : +d.roi;
                    d.network.forEach(function (n) {
                        n.source = +n.source;
                        n.target = +n.target;
                    });
                    // Convert matrix to numeric
                    if (d.matrix) {
                        d.matrix = d.matrix.map(function (m) {
                            return m.map(function (val) {
                                return +val;
                            });
                        });
                    }
                    // Convert roi-network source and target to numeric for roi == 'rest'
                    if (d.roi === 'rest') {
                        d['roi-network'].forEach(function (n) {
                            n.source = +n.source;
                            n.target = +n.target;
                        });
                        // Convert roiwithcount source and target to numeric for roi == 'rest'
                        d.roiWithCount.forEach(function (n) {
                            n.source = +n.source;
                            n.target = +n.target;
                            n.count = +n.count;
                        });
                    }
                    return d;
                });
                // console.log(numericData);

                setData(numericData);
            })

        }
    }, [patientID, sample])

    return data;
}