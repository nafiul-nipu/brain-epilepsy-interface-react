import * as d3 from 'd3'
import React from "react";

export const EEGDataViewer = ({ eegEL }) => {
    if (!eegEL) {
        return (<div>EEG Data Loading</div>)
    }

    return (
        <div>loaded</div>
    )
}