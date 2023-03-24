import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetch = ((patientID, sample, method) => {
    const [spikeData, setSpikeData] = useState(null)

    useEffect(() => {
        axios.post(
            `http://127.0.0.1:5000/${method}`,
            { data: { patientID: patientID, sample: sample } }
        ).then((response) => {

            console.log(response)

        }).catch((error) => {
            console.log(error)
        });
    }, [])
})