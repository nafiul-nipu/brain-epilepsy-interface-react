import { AdjacencyMatrix } from "../../CommonComponents/AdjacencyMatrix";

export const NetworkViewer = ({
    sessionNetwork,
    eventData,
    eventRange,
    eventNet,
    selectedRoi
}) => {
    // console.log(eventNet)

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

    // console.log(eventNet['1'])
    // console.log(eventNet[filteredEventIds[0]])
    // console.log(filteredata)
    // console.log(Object.keys(eventNet)
    //     .filter(key => filteredEventIds.includes(parseInt(key))))

    // console.log(eventNet[filteredata[0]])

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

    console.log(totalMatrix);


    return (
        <>
            {
                totalMatrix ? (<AdjacencyMatrix
                    data={totalMatrix[selectedRoi].matrix}
                    columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                    labels={sessionNetwork[selectedRoi].electrodes}
                />) : <div>No Network</div>
            }
        </>

    )
}


// {
//     adjaData ? (
//       adjaData.map((data, index) => {
//         if (index === 2) {
//           return (
//             <AdjacencyMatrix
//               data={data.matrix}
//               columns={Array.from({ length: data.electrodes.length }, (_, i) => i)}
//               labels={data.electrodes}
//             />
//           )
//         }
//       })

//     ) : null
//   }

// const adjaData = useMergedRois({
//     network: fullNetwork,
//     networkWithEvent: fullEventNetwork,
//     eventid: 10
//   })