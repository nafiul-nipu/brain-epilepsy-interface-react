import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetch = ((patientID, sample, method) => {
    const [spikeData, setSpikeData] = useState(null)

    useEffect(() => {
        axios.get(
            `http://127.0.0.1:5000/${method}`,
            {
                params: {
                    id: patientID,
                    sample: sample
                }
            }).then((response) => {

                console.log(response)

            }).catch((error) => {
                console.log(error)
            });
    }, [])
})