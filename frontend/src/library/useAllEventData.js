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
            const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/data/electrodes/${patientID}/${patientID}_all_events.json`;

            json(url).then(jData => {
                // console.log(jData)
                const formattedData = {};
                for (const key in jData) {
                    const item = jData[key];

                    formattedData[key] = item.map(function (d) {
                        return {
                            index: +d.index,
                            count: +d.count,
                            electrode: d.electrode.map(function (e) {
                                return +e;
                            }),
                            time: d.time.map(function (t) {
                                return +t;
                            })
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