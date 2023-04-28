import { Row, Col } from 'react-bootstrap'
import { AdjacencyMatrix } from '../../CommonComponents/AdjacencyMatrix'
import './SimilarRegion.css'

export const SimilarRegion = ({
    data,
    similarRegionEvent,
    selectedRoi,
    sessionNetwork,
    eventNet,
    eventData
}) => {
    // console.log(similarRegionEvent)
    // console.log(eventData)
    const neighbors = data.find(obj => obj.eventID === similarRegionEvent)?.neighbors
    // console.log(neighbors)
    const timeArray = eventData.filter(obj => neighbors.includes(obj.index)).map(obj => obj.time);
    // console.log(timeArray)
    return (
        <>
            <Row>
                <Col md='6' style={{ height: '21vh' }}>
                    <div className='firstSimilar'>
                        {`EventID: ${neighbors[0]} 
                        Time: ${timeArray[0].length > 1 ?
                                `${timeArray[0][0]}ms - ${timeArray[0][timeArray[0].length - 1]}ms`
                                : `${timeArray[0]}`}`}
                    </div>
                    <AdjacencyMatrix
                        data={eventNet[neighbors[0]][selectedRoi].matrix}
                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                        labels={sessionNetwork[selectedRoi].electrodes}
                    />
                </Col>
                <Col md='6' style={{ height: '21vh' }}>
                    <div className='secondSimilar'>
                        {`EventID: ${neighbors[1]} 
                        Time: ${timeArray[1].length > 1 ?
                                `${timeArray[1][0]}ms - ${timeArray[1][timeArray[1].length - 1]}ms`
                                : `${timeArray[1]}`}`}
                    </div>
                    <AdjacencyMatrix
                        data={eventNet[neighbors[1]][selectedRoi].matrix}
                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                        labels={sessionNetwork[selectedRoi].electrodes}
                    />
                </Col>
            </Row>
            <Row>
                <Col md='6' style={{ height: '21vh' }}>
                    <div className='thirdSimilar'>
                        {`EventID: ${neighbors[2]} 
                        Time: ${timeArray[2].length > 1 ?
                                `${timeArray[2][0]}ms - ${timeArray[2][timeArray[2].length - 1]}ms`
                                : `${timeArray[2]}`}`}
                    </div>
                    <AdjacencyMatrix
                        data={eventNet[neighbors[2]][selectedRoi].matrix}
                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                        labels={sessionNetwork[selectedRoi].electrodes}
                    />

                </Col>
                <Col md='6' style={{ height: '21vh' }}>
                    <div className='fourthSimilar'>
                        {`EventID: ${neighbors[3]} 
                        Time: ${timeArray[3].length > 1 ?
                                `${timeArray[3][0]}ms - ${timeArray[3][timeArray[3].length - 1]}ms`
                                : `${timeArray[3]}`}`}
                    </div>
                    <AdjacencyMatrix
                        data={eventNet[neighbors[3]][selectedRoi].matrix}
                        columns={Array.from({ length: sessionNetwork[selectedRoi].electrodes.length }, (_, i) => i)}
                        labels={sessionNetwork[selectedRoi].electrodes}
                    />

                </Col>
            </Row>
        </>
    )
}