import { Col } from "react-bootstrap"
import * as d3 from 'd3';

import { AxisLeft } from "../CommonComponents/AxisLeft";
import { AxisBottom } from "../CommonComponents/AxisBottom";

// margin for SVG
const margin = { top: 0, right: 30, bottom: 100, left: 40 }
// offset variable to placement
const scaleOffset = 5

export const EventViewer = ({
    data
}) => {
    if (!data) {
        return (
            <div>loading</div>
        )
    }
    // console.log(data)
    const yMax = Math.max(...data.map(item => item.count))
    console.log(yMax)

    // defining width, height, innerwidth and inner height
    const width = window.innerWidth / 2
    const height = window.innerHeight / 2 - 10

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    // scale for xAxis and yAxis
    const xAxisScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, innerWidth])

    const yAxisScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([innerHeight, 0])

    return (
        <Col md='12' style={{ height: '50vh' }}>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* creating bottom axis */}
                    <AxisBottom
                        xScale={xAxisScale}
                        yScale={yAxisScale}
                        scaleOffset={scaleOffset}
                        innerHeight={innerHeight}
                    />
                    {/* creating left axis */}
                    <AxisLeft
                        xScale={xAxisScale}
                        yScale={yAxisScale}
                        scaleOffset={scaleOffset}
                    />

                </g>
            </svg>
        </Col>
    )
}