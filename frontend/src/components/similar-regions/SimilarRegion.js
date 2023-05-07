import { Row, Col } from 'react-bootstrap'
import { AdjacencyMatrix } from '../../CommonComponents/AdjacencyMatrix'
import './SimilarRegion.css'
import { useEffect, useState } from 'react'
import { fetchSimilarRegions } from '../../api'

export const SimilarRegion = ({
    similarRegionEvent,
    selectedRoi,
    sessionNetwork,
    eventNet,
    eventData,
    patient
}) => {
    // console.log(similarRegionEvent)
    // const neighbors = data.find(obj => obj.eventID === similarRegionEvent)?.neighbors
    const [neigborData, setNeighbors] = useState(null)

    useEffect(() => {

        async function fetchData() {
            const { data, error } = await fetchSimilarRegions(
                patient.id,
                patient.sample,
                similarRegionEvent,
                6
            );

            // TODO: if error do something
            setNeighbors(data);
            // console.log(data)
        }
        fetchData();
    }, [eventData, patient, similarRegionEvent])

    const timeArray = neigborData ? neigborData.map((el) => eventData[el].time) : null

    // console.log(timeArray)
    // if (neigborData) {
    //     console.log(neigborData)
    //     console.log(selectedRoi)
    //     console.log(eventNet)
    //     console.log(eventNet[neigborData[1]])
    //     console.log(eventNet[neigborData[1]][selectedRoi].matrix)
    // }


    return (
        <>
            {
                (neigborData && timeArray) ? (
                    <>
                        <Row>
                            <Col md='4' style={{ height: '20vh' }}>
                                <div className='firstSimilar'>
                                    {`EventID: ${neigborData[0]} 
                                Time: ${timeArray[0].length > 1 ?
                                            `${timeArray[0][0]}ms - ${timeArray[0][timeArray[0].length - 1]}ms`
                                            : `${timeArray[0]}`}`}
                                </div>
                                <div style={{ width: '20vh', height: '20vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData[0]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>
                            </Col>
                            <Col md='4' style={{ height: '20vh' }}>
                                <div className='secondSimilar'>
                                    {`EventID: ${neigborData[1]} 
                                Time: ${timeArray[1].length > 1 ?
                                            `${timeArray[1][0]}ms - ${timeArray[1][timeArray[1].length - 1]}ms`
                                            : `${timeArray[1]}`}`}
                                </div>
                                <div style={{ width: '20vh', height: '20vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData[1]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='4' style={{ height: '20vh' }}>
                                <div className='thirdSimilar'>
                                    {`EventID: ${neigborData[2]} 
                                Time: ${timeArray[2].length > 1 ?
                                            `${timeArray[2][0]}ms - ${timeArray[2][timeArray[2].length - 1]}ms`
                                            : `${timeArray[2]}`}`}
                                </div>
                                <div style={{ width: '20vh', height: '20vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData[2]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>


                            </Col>
                            <Col md='4' style={{ height: '20vh' }}>
                                <div className='fourthSimilar'>
                                    {`EventID: ${neigborData[3]} 
                                Time: ${timeArray[3].length > 1 ?
                                            `${timeArray[3][0]}ms - ${timeArray[3][timeArray[3].length - 1]}ms`
                                            : `${timeArray[3]}`}`}
                                </div>
                                <div style={{ width: '20vh', height: '20vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData[3]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>

                            </Col>
                        </Row>
                    </>
                ) : (
                    <div>Loading...</div>
                )

            }
        </>
    )
}