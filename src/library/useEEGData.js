//importing react callbacks
import { useState, useEffect } from "react";
//three js object loader
import * as d3 from 'd3'

// https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/ep129/sample1/eeg/E1.csv

export const useEEGData = ({
    patient, sample, electrodes
}) => {
    // console.log(electrodes)
    // configure data state
    // three OBJ for three view another for bbox
    const [data, setData] = useState(null);

    useEffect(() => {
        // console.log(patient)
        // console.log(sample)
        // console.log(electrodes)
        // console.log('lesion patient', patient)
        const files = electrodes.map(e => `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/electrodes/${patient}/${sample}/eeg/E${e}.csv`)
        console.log(files[0])
        const promises = files.map(url => d3.csv(url));
        Promise.all(promises)
            .then(eeg => {
                // data will be an array of arrays, each containing the loaded data from a CSV file
                // console.log(data);
                const newArr = eeg.map(subArr => subArr.columns.map(parseFloat));
                setData(newArr)
            })
            .catch(error => console.log(error));

    }, [electrodes, patient, sample])

    return data;

}