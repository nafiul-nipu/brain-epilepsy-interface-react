import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetchEEG = ({ patientid, sample, start, num_records, electrodes, setIsLoading }) => {
    const [spikeData, setSpikeData] = useState(null)

    useEffect(() => {
        // console.log(patientid, sample, start, num_records, electrodes)
        // if (patientid && sample && start && num_records && electrodes) {
        console.log("fetching")
        console.log(electrodes)
        const url = `http://127.0.0.1:5000//patient/${patientid}/eeg/${sample}/${start}/${num_records}/${electrodes}`
        console.log(url)
        axios.get(
            url)
            .then((response) => {
                // console.log(response)
                setSpikeData(response.data)

            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                setIsLoading(true)
            });
        // }

    }, [electrodes, num_records, patientid, sample, start])

    return spikeData;

}
