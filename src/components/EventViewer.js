import { Col } from "react-bootstrap"
import * as d3 from 'd3';

import { AxisLeft } from "../CommonComponents/AxisLeft";
import { AxisBottom } from "../CommonComponents/AxisBottom";
import { LinePlot } from "../CommonComponents/LinePlot";

// margin for SVG
const margin = { top: 10, right: 30, bottom: 60, left: 40 }
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
    // console.log(yMax)
    const length = data.length
    const xd = Array.from({ length }, (_, i) => i);
    // console.log(xd)

    // defining width, height, innerwidth and inner height
    const width = window.innerWidth / 3
    const height = window.innerHeight - 10

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    // scale for xAxis and yAxis
    // const xScale = d3.scaleBand()
    //     .range([0, innerWidth])
    //     .domain(xd)
    //     .padding(0.1);

    // const yAxisScale = d3.scaleLinear()
    //     .domain([0, yMax])
    //     .range([innerHeight, 0])

    // const xAxisScale = d3.scaleLinear()
    //     .range([0, innerWidth])
    //     .domain([0, data.length]);

    const xScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([0, yMax])

    const yScale = d3.scaleBand()
        .range([innerHeight, 0])
        .domain(xd)
        .padding(0.8)

    const yAxisScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([0, data.length])

    console.log(yScale.bandwidth())


    return (
        <Col md='12' style={{ height: '95vh' }}>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* creating bottom axis */}
                    <AxisBottom
                        xScale={xScale}
                        yScale={yScale}
                        scaleOffset={scaleOffset}
                        innerHeight={innerHeight}
                    />
                    {/* creating left axis */}
                    <AxisLeft
                        xScale={xScale}
                        yScale={yAxisScale}
                        scaleOffset={scaleOffset}
                    />

                    <g>
                        {
                            data.map((d, i) => {
                                // console.log(d)
                                return (
                                    <g>
                                        <rect
                                            x={xScale(0)}
                                            y={yScale(d.index)}
                                            width={xScale(d.count)}
                                            height={yScale.bandwidth()}
                                            fill={'red'}
                                        >
                                        </rect>
                                        {
                                            d.electrode.map((value, index) => {
                                                // console.log(index)
                                                return (
                                                    <circle
                                                        cx={xScale(index)}
                                                        cy={yScale(d.index)}
                                                        r={3}
                                                        fill={'green'}
                                                    >
                                                        <title>{`
                                                        Event Id : ${d.index}\nElectrode: ${value}\n Timepoint : ${d.time[index]} ms
                                                        \nCount : ${d.count}
                                                        `}</title>
                                                    </circle>
                                                )
                                            })
                                        }
                                    </g>
                                )
                            })
                        }
                    </g>

                    {/* <LinePlot
                        data={data}
                        xScale={xScale}
                        yLineScale={yAxisScale}
                    /> */}

                </g>
            </svg>
        </Col>
    )
}