import { AdjacencyMatrix } from "../../CommonComponents/AdjacencyMatrix";
import "./NetworkViewer.css";
import * as d3 from "d3";

import dataRegistry from "../../data/dataRegistry.json"

export const NetworkViewer = ({
    sessionNetwork,
    eventData,
    eventRange,
    eventNet,
    selectedRoi,
    colorRange
}) => {
    // console.log(selectedRoi)

    const filteredEventIds = eventData
        .filter((el) => el.time.some(t => t >= eventRange[0] && t <= eventRange[1]))
        .map((el) => el.index)

    // console.log(filteredEventIds)
    // console.log(Object.keys(eventNet))
    const filteredata = Object.keys(eventNet)
        .filter(key => filteredEventIds.includes(parseInt(key)))
        .reduce((result, key) => {
            // using json parse and stringify to deep clone the array
            const filteredArray = JSON.parse(JSON.stringify(eventNet[key].slice(0, -1))); // remove last element from array
            result[key] = filteredArray;
            return result;
        }, {});


    let totalMatrix = null;

    for (let i = 0; i < Object.keys(filteredata).length; i++) {
        const key = Object.keys(filteredata)[i];
        // console.log(key)
        const matrices = filteredata[key];
        // console.log(matrices)

        if (!totalMatrix) {
            totalMatrix = matrices.map(matrixObj => ({ roi: matrixObj.roi, matrix: [...matrixObj.matrix] }));
        } else {
            for (let j = 0; j < matrices.length; j++) {
                const matrixObj = matrices[j];
                const matrix = matrixObj.matrix;
                const totalMatrixRow = totalMatrix[j].matrix;

                for (let k = 0; k < matrix.length; k++) {
                    for (let l = 0; l < matrix[k].length; l++) {
                        totalMatrixRow[k][l] += matrix[k][l];
                    }
                }
            }
        }
    }

    // console.log(totalMatrix);
    let maxValue = totalMatrix ? d3.max(totalMatrix[selectedRoi].matrix, d => d3.max(d)) : 0;


    return (
        <>
            {
                totalMatrix ? (
                    <>
                        <div className="networkEvents">
                            {`Network View - Event Id: ${filteredEventIds} Roi: ${selectedRoi}`}
                        </div>
                        <div className="legendNetwork">
                            <div style={{ fontSize: 'small' }}>Count</div>
                            <svg width="100" height="10">
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={colorRange[0]} />
                                    <stop offset="100%" stopColor={colorRange[1]} />
                                </linearGradient>
                                <rect x="10" y="0" width="80" height="10" fill="url(#gradient)" />
                                <text x="0" y="10" fill="black" fontSize="10px">0</text>
                                <text x="92" y="10" fill="black" fontSize="10px">{maxValue === 0 ? 1 : maxValue}</text>
                            </svg>
                        </div>
                        <AdjacencyMatrix
                            data={totalMatrix[selectedRoi].matrix}
                            columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                            labels={sessionNetwork[selectedRoi].electrodes}
                            colorRange={colorRange}
                        />
                    </>
                ) : <div>No Network</div>
            }
        </>

    )
}
