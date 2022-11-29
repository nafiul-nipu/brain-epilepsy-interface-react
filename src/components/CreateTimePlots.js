import * as d3 from 'd3';
import { AxisLeft } from '../CommonComponents/AxisLeft';
import { AxisBottom } from '../CommonComponents/AxisBottom';
import { LinePlot } from '../CommonComponents/LinePlot';
export const CreateTimePlot = ({
    margin,
    scaleOffset,
    electrodeListData,
    electrodeData
}) => {
    const width = window.innerWidth / 5.2
    const height = window.innerHeight / 2

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    const xAxisScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, innerWidth])

    const yAxisScale = d3.scaleBand()
        .domain(electrodeListData)
        .range([0, innerHeight])

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <AxisBottom
                    xScale={xAxisScale}
                    yScale={yAxisScale}
                    scaleOffset={scaleOffset}
                    innerHeight={innerHeight}
                />
                <AxisLeft
                    yScale={yAxisScale}
                />
                {
                    electrodeListData.map((each, i) => {
                        // console.log(each, i);
                        var result = electrodeData.filter(obj => {
                            return obj.start === each;
                        });
                        // if (result[0].start === 58) {
                        //     console.log(result)
                        // }
                        // console.log(each, yAxisScale(each), (yAxisScale.bandwidth() + yAxisScale(each)))
                        let domain = [...new Set(result.map((item) => item.frequency))]

                        let yLineScale = d3.scaleLinear()
                            .domain([0, d3.max(domain)])
                            .range([(yAxisScale.bandwidth() / 2), 0])

                        let xLineScale = d3.scaleLinear()
                            .range([0, innerWidth])
                            .domain([0, result.length])

                        return (
                            <LinePlot
                                data={result}
                                xScale={xLineScale}
                                yLineScale={yLineScale}
                                yAxisScale={yAxisScale}
                                each={each}
                                scaleOffset={scaleOffset}
                            />
                        )
                    })
                }
                {/* <LinePlot
                /> */}
            </g>
        </svg>
    )
}