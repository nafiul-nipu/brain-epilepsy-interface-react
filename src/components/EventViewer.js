import { Col } from "react-bootstrap"
import * as d3 from 'd3';

import { AxisLeft } from "../CommonComponents/AxisLeft";
import { AxisBottom } from "../CommonComponents/AxisBottom";
import { LinePlot } from "../CommonComponents/LinePlot";

// margin for SVG
const margin = { top: 10, right: 40, bottom: 60, left: 40 }
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
    const width = window.innerWidth
    const height = window.innerHeight / 2 - 10

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    // scale for xAxis and yAxis
    // const xScale = d3.scaleBand()
    //     .range([0, innerWidth])
    //     .domain(xd)
    //     .padding(0.1)
    //     ;
    const xScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([0, data[data.length - 1].index])
        .nice()
        ;

    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([innerHeight, 0])
        .nice()

    const xAxisScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([0, data[data.length - 1].index]).nice();


    return (
        <Col md='12' style={{ height: '95vh' }}>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* creating bottom axis */}
                    <AxisBottom
                        xScale={xAxisScale}
                        yScale={yScale}
                        scaleOffset={scaleOffset}
                        innerHeight={innerHeight}
                    />
                    {/* creating left axis */}
                    <AxisLeft
                        xScale={xScale}
                        yScale={yScale}
                        scaleOffset={scaleOffset}
                    />

                    <g>
                        {
                            data.map((d, i) => {
                                // console.log(d)
                                return (
                                    <g>
                                        {/* <rect
                                            x={xScale(i)}
                                            y={yScale(d.count)}
                                            width={xScale.bandwidth()}
                                            height={innerHeight - yScale(d.count)}
                                            fill={'red'}
                                        >
                                            <title>{`
                                                        Event Id : ${d.index}
                                                        \nCount : ${d.count}
                                                        `}</title>
                                        </rect> */}
                                        {
                                            d.electrode.map((value, index) => {
                                                // console.log(index)
                                                return (
                                                    <circle
                                                        cx={xScale(i)}
                                                        cy={yScale(index)}
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