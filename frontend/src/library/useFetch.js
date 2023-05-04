import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetchEEG = ({ patientid, sample, start, num_records, electrodes }) => {
    const [spikeData, setSpikeData] = useState(null)

    useEffect(() => {
        console.log(patientid, sample, start, num_records, electrodes)
        // if (patientid && sample && start && num_records && electrodes) {
        console.log("fetching")
        let el = '20,32,21,22,40,41,54,19,31,39,47,48,52,56,26,27,28,29,34,35,43,49,50,53,18,33,44,30,36,38,51,37,108,109,107,102,112'
        console.log(el)
        axios.get(
            `http://127.0.0.1:5000//patient/${patientid}/eeg/${sample}/${start}/${num_records}/${electrodes}`)
            .then((response) => {
                console.log(response)

            }).catch((error) => {
                console.log(error)
            });
        // }

    }, [electrodes, num_records, patientid, sample, start])

}
