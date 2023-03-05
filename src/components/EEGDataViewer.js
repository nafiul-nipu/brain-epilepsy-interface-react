import * as d3 from 'd3'
import React from "react";

export const EEGDataViewer = ({ eegEL, /*patientInfo*/ }) => {
    if (!eegEL) {
        return (<div>EEG Data Loading</div>)
    }
    // console.log(eegEL)
    return (
        <div style={{ height: '50vh', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', overflowY: 'auto' }}>
            <div style={{ position: 'fixed' }}>Event Id -{eegEL.id}</div>
            {
                eegEL.value.map((eeg) => {
                    // const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images/${patientInfo.id}/${patientInfo.sample}/E${eeg}.png`
                    const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images/ep187/sample1/E${eeg}.png`

                    return (
                        <img
                            src={url}
                            alt={`E${eeg}`}
                            style={{ objectFit: 'contain', width: '95%', margin: '10px' }}
                        />
                    )
                })
            }
        </div>
    )
}