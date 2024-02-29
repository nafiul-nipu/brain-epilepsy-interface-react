import { useEffect, useState } from "react"
import { json } from "d3";

export const useAllNetwork = ({ patientID }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (patientID) {
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/electrodes/${patientID}/${patientID}_all_network.json`;

            json(url).then(jData => {
                const formattedData = {};
                for (const key in jData) {
                    const item = jData[key];
                    formattedData[key] = item.map(function (d) {
                        return {
                            index: +d.index,
                            electrodes: d.electrodes.map(function (e) {
                                return +e;
                            }),
                            times: d.times.map(function (t) {
                                return +t;
                            }),
                            network: d.network.length === 0 ? [] :
                                d.network?.map(function (n) {
                                    return {
                                        source: +n.source,
                                        target: +n.target
                                    }
                                }),
                        }
                    });
                }
                setData(formattedData);
            }).catch(err => {
                console.log("error", err)
                setData(null)
            })

        }
    }, [patientID])

    return data;
}