import { Row, Col } from 'react-bootstrap'
import { AdjacencyMatrix } from '../../CommonComponents/AdjacencyMatrix'
import './SimilarRegion.css'
import { useEffect, useState } from 'react'
import { fetchSimilarRegions } from '../../api'

const rowSize = 3;

export const SimilarRegion = ({
    similarRegionEvent,
    selectedRoi,
    sessionNetwork,
    eventNet,
    eventData,
    patient,
    numComponents,
    colorRange
}) => {
    // console.log(similarRegionEvent)
    // const neighbors = data.find(obj => obj.eventID === similarRegionEvent)?.neighbors
    const [neigborData, setNeighbors] = useState(null)
    const [rows, setrows] = useState(null)

    useEffect(() => {

        async function fetchData() {
            const { data, error } = await fetchSimilarRegions(
                patient.id,
                patient.sample,
                similarRegionEvent,
                numComponents
            );

            // TODO: if error do something
            setNeighbors(data);
            // console.log(data)
            let numRows = Math.ceil((data.length) / rowSize)
            // console.log(numRows)
            setrows([...Array(numRows)]);
        }
        fetchData();
    }, [eventData, numComponents, patient, similarRegionEvent])

    const timeArray = neigborData ? neigborData.map((el) => eventData[el].time) : null




    return (
        <>
            {
                (neigborData && timeArray && rows) ? (
                    rows.map((_, rowIndex) => {
                        const el = sessionNetwork[selectedRoi].electrodes;
                        const rowStartIndex = rowIndex * rowSize;
                        const rowObjects = neigborData.slice(rowStartIndex, rowStartIndex + rowSize);
                        const rowKey = `row-${rowIndex}`;
                        // console.log(rowObjects)
                        return (
                            <Row key={rowKey}>
                                {
                                    rowObjects.map((object, i) => (
                                        <Col md='4'
                                            style={{ height: '20vh' }}
                                        >
                                            <div className='similar-text'>
                                                {`E: ${object}
                                                T: ${timeArray[i].length > 1 ?
                                                        `${timeArray[i][0]}-${timeArray[i][timeArray[i].length - 1]}ms`
                                                        : `${timeArray[i]}`}`}
                                            </div>
                                            <div style={{ width: '18vh', height: '18vh' }}>
                                                <AdjacencyMatrix
                                                    data={eventNet[object][selectedRoi].matrix}
                                                    columns={Array.from({ length: el.length }, (_, i) => i)}
                                                    labels={[el[0], ...Array(el.length - 2).fill(0), el[el.length - 1]]}
                                                    containerProps={{ useZoom: false, ml: 10, mr: 5, mb: 5, mt: 7 }}
                                                    colorRange={colorRange}
                                                />
                                            </div>
                                        </Col>
                                    ))
                                }

                            </Row>
                        )
                    })

                ) : (
                    <div>Loading...</div>
                )

            }
        </>
    )
}