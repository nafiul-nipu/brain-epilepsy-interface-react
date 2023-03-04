import * as d3 from 'd3'
import { AxisBottom } from '../CommonComponents/AxisBottom'
import { AxisLeft } from '../CommonComponents/AxisLeft'
import React from "react";
// margin for SVG
const margin = { top: 0, right: 30, bottom: 100, left: 40 }
// offset variable to placement
const scaleOffset = 5

export const EEGDataViewer = ({ eegdata }) => {
    if (!eegdata) {
        return (<div>EEG Data Loading</div>)
    }
    console.log(eegdata)
    // defining width, height, innerwidth and inner height
    const width = window.innerWidth / 3
    const height = window.innerHeight / 2

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    // const flattenedData = eegdata.flat();

    const domains = Array.from({ length: eegdata.length }, (_, i) => i + 1);

    // scale for xAxis and yAxis
    const xAxisScale = d3.scaleLinear()
        .domain([0, eegdata[0].length])
        .range([0, innerWidth])

    const yAxisScale = d3.scaleBand()
        .domain(domains)
        .range([0, innerHeight])

    const [xStart, xEnd] = xAxisScale.range();
    const [yStart, yEnd] = yAxisScale.range();
    const ticks = xAxisScale.ticks();

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* axisbottom */}
                <g>
                    <line className='axisLine' x1={xStart} x2={xEnd} y1={yEnd} y2={yEnd} />
                    <g className="ticks">
                        {ticks.map((t, i) => {
                            const x = xAxisScale(t);
                            return (
                                <React.Fragment key={i}>
                                    <line x1={x} x2={x} y1={yEnd} y2={yEnd + scaleOffset} />
                                    <text
                                        x={x}
                                        y={yEnd + scaleOffset * 5}
                                    >
                                        {t / 1000}
                                    </text>
                                </React.Fragment>
                            );
                        })}
                    </g>
                    <g>
                        <line className={'axisLine'} x1={xStart} x2={xStart} y1={yEnd} y2={yStart} />
                        <g className="ticks">
                            {yAxisScale.domain().map((t, i) => {
                                // console.log(t)
                                const y = yAxisScale(t);
                                return (
                                    <React.Fragment key={i}>
                                        <line x1={xStart} x2={xStart - scaleOffset} y1={y} y2={y} />
                                        <text
                                            x={xStart - scaleOffset * 4}
                                            y={y + scaleOffset * 1.25}
                                        >
                                            {t}
                                        </text>
                                    </React.Fragment>
                                );
                            })}
                        </g>
                    </g>
                </g>
                {/* creating bottom axis */}
                {/* <AxisBottom
                    xScale={xAxisScale}
                    yScale={yAxisScale}
                    scaleOffset={scaleOffset}
                    innerHeight={innerHeight}
                /> */}
                {/* creating left axis */}
                {/* <AxisLeft
                    yScale={yAxisScale}
                /> */}

            </g>
        </svg>
        // eegdata.map((eeg) => {
        //     return (<div>eeg</div>)
        // })
        // <div>eeg</div>

    )
}