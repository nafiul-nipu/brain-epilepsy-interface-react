import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';
export const ExplorationSoFar = ({
    exploration,
    eventData,
    eventNet
}) => {
    // console.log(eventData)
    const maxCount = Math.max(...eventData.map(obj => obj.count));

    const maxNetCount = Math.max(
        ...Object.values(eventNet).map(attribute =>
            attribute.reduce((count, obj) => count + obj.network.length, 0)
        )
    );

    const countScale = d3.scaleLinear()
        .domain([0, maxCount])
        .range([0, 70]);

    const netScale = d3.scaleLinear()
        .domain([0, maxNetCount])
        .range([0, 70]);

    return (
        exploration.map((ex, index) => {
            let time = eventData.find(d => d.index === ex)?.time;
            let peaks = eventData.find(d => d.index === ex)?.count;
            let networks = eventNet[ex].reduce((count, obj) => count + obj.network.length, 0);
            // console.log(networks)

            return (
                <Row key={index}>
                    <Col md='2'>Id: {ex}</Col>
                    <Col md='4'>Time : {time.length > 0 ? `${time[0]}-${time[time.length - 1]} ms` : `${time[0]}ms`}</Col>
                    <Col md='6'>
                        <svg width={240} height={20}>
                            <g>
                                <text x={0} y={12} fill="black" fontSize={12} alignmentBaseline="middle">Peaks</text>
                                <rect x={35} y={0} width={countScale(maxCount)} height={20} fill="#a6cee3" />
                                <rect x={35} y={0} width={countScale(peaks)} height={20} fill="#1f78b4" />
                                <title>{`Total Peaks : ${peaks}`}</title>
                            </g>
                            <g>
                                <text x={120} y={12} fill="black" fontSize={12} alignmentBaseline="middle">Network</text>
                                <rect x={170} y={0} width={netScale(maxNetCount)} height={20} fill="#b2df8a" />
                                <rect x={170} y={0} width={netScale(networks)} height={20} fill="#33a02c" />
                                <title>{`Total Networks : ${networks}`}</title>
                            </g>
                        </svg>
                    </Col>

                </Row>
            )
        })
    )
}