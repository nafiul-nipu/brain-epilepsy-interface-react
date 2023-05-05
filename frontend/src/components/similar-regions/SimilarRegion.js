import { Row, Col } from 'react-bootstrap'
import { AdjacencyMatrix } from '../../CommonComponents/AdjacencyMatrix'
import './SimilarRegion.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const SimilarRegion = ({
    similarRegionEvent,
    selectedRoi,
    sessionNetwork,
    eventNet,
    eventData,
    patient
}) => {
    console.log(similarRegionEvent)
    // const neighbors = data.find(obj => obj.eventID === similarRegionEvent)?.neighbors
    const [neigborData, setNeighbors] = useState(null)

    useEffect(() => {
        const url = `http://127.0.0.1:5000//patient/${patient.id}/similar/${patient.sample}/${similarRegionEvent}/${4}`;

        async function fetchData() {
            try {
                const response = await axios.get(url);
                console.log("response", response)
                setNeighbors(response.data);

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [eventData, patient, similarRegionEvent])

    const timeArray = neigborData ? neigborData.neighbhors.map((el) => eventData[el].time) : null

    // console.log(timeArray)
    // if (neigborData) {
    //     console.log(neigborData.neighbhors)
    //     console.log(selectedRoi)
    //     console.log(eventNet)
    //     console.log(eventNet[neigborData.neighbhors[1]])
    //     console.log(eventNet[neigborData.neighbhors[1]][selectedRoi].matrix)
    // }


    return (
        <>
            {
                (neigborData && timeArray) ? (
                    <>
                        <Row>
                            <Col md='4' style={{ height: '21vh' }}>
                                <div className='firstSimilar'>
                                    {`EventID: ${neigborData.neighbhors[0]} 
                                Time: ${timeArray[0].length > 1 ?
                                            `${timeArray[0][0]}ms - ${timeArray[0][timeArray[0].length - 1]}ms`
                                            : `${timeArray[0]}`}`}
                                </div>
                                <div style={{ width: '21vh', height: '21vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData.neighbhors[0]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>
                            </Col>
                            <Col md='4' style={{ height: '21vh' }}>
                                <div className='secondSimilar'>
                                    {`EventID: ${neigborData.neighbhors[1]} 
                                Time: ${timeArray[1].length > 1 ?
                                            `${timeArray[1][0]}ms - ${timeArray[1][timeArray[1].length - 1]}ms`
                                            : `${timeArray[1]}`}`}
                                </div>
                                <div style={{ width: '21vh', height: '21vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData.neighbhors[1]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='4' style={{ height: '21vh' }}>
                                <div className='thirdSimilar'>
                                    {`EventID: ${neigborData.neighbhors[2]} 
                                Time: ${timeArray[2].length > 1 ?
                                            `${timeArray[2][0]}ms - ${timeArray[2][timeArray[2].length - 1]}ms`
                                            : `${timeArray[2]}`}`}
                                </div>
                                <div style={{ width: '21vh', height: '21vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData.neighbhors[2]][selectedRoi].matrix}
                                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                                        labels={sessionNetwork[selectedRoi].electrodes}
                                    />
                                </div>


                            </Col>
                            <Col md='4' style={{ height: '21vh' }}>
                                <div className='fourthSimilar'>
                                    {`EventID: ${neigborData.neighbhors[3]} 
                                Time: ${timeArray[3].length > 1 ?
                                            `${timeArray[3][0]}ms - ${timeArray[3][timeArray[3].length - 1]}ms`
                                            : `${timeArray[3]}`}`}
                                </div>
                                <div style={{ width: '21vh', height: '21vh' }}>
                                    <AdjacencyMatrix
                                        data={eventNet[neigborData.neighbhors[3]][selectedRoi].matrix}
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