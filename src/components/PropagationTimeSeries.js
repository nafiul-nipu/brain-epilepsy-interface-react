import * as d3 from 'd3'
import { AxisBottom } from './AxisBottom'
import { AxisLeft } from './AxisLeft'
import { LinePlot } from './LinePlot'

const margin = { top: 20, right: 30, bottom: 65, left: 40 }
const scaleOffset = 5
export const PropagationTimeSeries = ({
    sample1,
    sample2,
    sample3
}) => {

    const width = window.innerWidth / 5.2
    const height = window.innerHeight / 2

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    if (sample1 && sample2 && sample3) {

        let electrodeList = [...new Set(sample1.map((item) => item.start))]
        let electrodeList2 = [...new Set(sample2.map((item) => item.start))]
        let electrodeList3 = [...new Set(sample3.map((item) => item.start))]

        let domain1 = [...new Set(sample1.map((item) => item.frequency))]
        console.log(domain1)
        const uniques = [...new Set(electrodeList.concat(electrodeList2, electrodeList3))]
        // console.log(electrodeList)
        // console.log(sample1)

        const half = Math.ceil(uniques.length / 4);
        const firstHalf = uniques.slice(0, half)
        const secondHalf = uniques.slice(half)

        const xAxisScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, innerWidth])


        const yAxisScale = d3.scaleBand()
            .domain(firstHalf)
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
                        firstHalf.map((each, i) => {
                            // console.log(each, i);
                            var result = sample1.filter(obj => {
                                return obj.start === each;
                            });
                            if (result[0].start === 58) {
                                console.log(result)
                            }
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
                                />
                            )
                        })
                    }
                    {/* <LinePlot
                    /> */}
                </g>
            </svg>
        )
    } else {
        return (
            <div>loading</div>
        )
    }
}