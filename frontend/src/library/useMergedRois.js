import { useState, useEffect } from "react";

export const useMergedRois = ({
    network,
    networkWithEvent,
    eventid
}) => {
    // console.log(sampleName)
    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log('useSample', patientID, sampleName, range)
        if (network && networkWithEvent && eventid) {
            console.log(networkWithEvent)
            const mergedROIs = networkWithEvent[eventid].map((roi1, index) => ({
                ...roi1,
                electrodes: [...network[index].electrodes],
            }));

            setData(mergedROIs)
        }

    }, [eventid, network, networkWithEvent])

    return data

}