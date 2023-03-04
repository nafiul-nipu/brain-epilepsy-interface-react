import * as d3 from 'd3'
import { AxisBottom } from '../CommonComponents/AxisBottom'
import { AxisLeft } from '../CommonComponents/AxisLeft'
import React from "react";
import { LinePlot } from '../CommonComponents/LinePlot';
// margin for SVG
const margin = { top: 0, right: 30, bottom: 100, left: 40 }
// offset variable to placement
const scaleOffset = 5

export const EEGDataViewer = ({ eegdata, eegEL }) => {
    if (!eegdata) {
        return (<div>EEG Data Loading</div>)
    }
    console.log(eegdata)
    // defining width, height, innerwidth and inner height
    const width = window.innerWidth / 3
    const height = window.innerHeight / 2

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    const flattenedData = eegdata.flat();

    // const domains = Array.from({ length: eegdata.length }, (_, i) => i + 1);

    // scale for xAxis and yAxis
    const xAxisScale = d3.scaleLinear()
        .domain([0, eegdata[0].length])
        .range([0, innerWidth]).nice()

    const yAxisScale = d3.scaleBand()
        .domain(eegEL)
        .range([0, innerHeight])

    // line Y scale - rande is bandwidth as each Y position is a line chart
    let yLineScale = d3.scaleLinear()
        .domain(d3.extent(flattenedData))
        .range([(yAxisScale.bandwidth() / 2), 0])


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
                </g>
                {/* axisLeft */}
                <g>
                    {yAxisScale.domain().map(tickeValue => (
                        <g className='tick' key={tickeValue}>
                            <text
                                key={tickeValue}
                                // y={yScale(tickeValue) + yScale.bandwidth() / 2}
                                style={{ textAnchor: 'end' }}
                                // x={-3}
                                dy={'0.32em'}
                                transform={`translate(-3, ${yAxisScale(tickeValue) + yAxisScale.bandwidth() / 2})`}
                            >{`E${tickeValue}`}</text>
                        </g>
                    ))}
                </g>
                <g>
                    {eegdata.map((each, i) => {
                        return (
                            <g>
                                <path
                                    fill='none'
                                    stroke='#137B80'
                                    strokeWidth={"2px"}
                                    d={d3.line()
                                        .x((d, i) => {
                                            return xAxisScale(i)
                                        })
                                        .y((d, i) => {
                                            return yLineScale(d)
                                        })
                                        .curve(d3.curveBasis)
                                        (each)

                                    }
                                />
                            </g>
                        )
                    })}
                </g>

            </g>
        </svg>
    )
}