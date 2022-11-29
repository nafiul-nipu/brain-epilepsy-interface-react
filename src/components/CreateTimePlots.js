// actual line plot creation module
import * as d3 from 'd3';
import { AxisLeft } from '../CommonComponents/AxisLeft';
import { AxisBottom } from '../CommonComponents/AxisBottom';
import { MultiLineCreation } from '../CommonComponents/MultiLineCreation';
export const CreateTimePlot = ({
    margin,
    scaleOffset,
    electrodeListData,
    electrodeData
}) => {
    // console.log(electrodeData)
    // defining width, height, innerwidth and inner height
    const width = window.innerWidth / 5.2
    const height = window.innerHeight / 2

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    // scale for xAxis and yAxis
    const xAxisScale = d3.scaleLinear()
        .domain([0, 30])
        .range([0, innerWidth])

    const yAxisScale = d3.scaleBand()
        .domain(electrodeListData)
        .range([0, innerHeight])

    return (
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
                    yScale={yAxisScale}
                />

                <MultiLineCreation
                    electrodeListData={electrodeListData}
                    electrodeData={electrodeData[0]}
                    yAxisScale={yAxisScale}
                    xlineRange={[0, innerWidth/3]}
                    scaleOffset={scaleOffset}
                    keyNumber={1}
                 />

                <MultiLineCreation
                    electrodeListData={electrodeListData}
                    electrodeData={electrodeData[1]}
                    yAxisScale={yAxisScale}
                    xlineRange={[innerWidth/3, innerWidth/1.5]}
                    scaleOffset={scaleOffset}
                    keyNumber={2}
                 />

                <MultiLineCreation
                    electrodeListData={electrodeListData}
                    electrodeData={electrodeData[2]}
                    yAxisScale={yAxisScale}
                    xlineRange={[innerWidth/1.5, innerWidth]}
                    scaleOffset={scaleOffset}
                    keyNumber={3}
                 />
                
            </g>
        </svg>
    )
}