import * as d3 from 'd3'
import { AxisBottom } from './AxisBottom'
import { AxisLeft } from './AxisLeft'

const margin = { top: 20, right: 30, bottom: 65, left: 90 }

export const PropagationTimeSeries = ({
    sample1,
    sample2,
    sample3
}) => {

    const width = window.innerWidth
    const height = window.innerHeight / 2

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    if (sample1 && sample2 && sample3) {
        let domain = d3.extent(sample1.map((item) => {
            return item.frequency
        }))
        let electrodeList = [...new Set(sample1.map((item) => item.start))]
        let electrodeList2 = [...new Set(sample2.map((item) => item.start))]
        let electrodeList3 = [...new Set(sample3.map((item) => item.start))]

        const uniques = [...new Set(electrodeList.concat(electrodeList2, electrodeList3))]
        console.log(electrodeList)
        console.log(electrodeList2)
        console.log(electrodeList3)
        console.log(uniques)

        const half = Math.ceil(uniques.length / 2);
        console.log(half)

        const firstHalf = uniques.slice(0, half)
        const secondHalf = uniques.slice(half)

        const xAxisScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0, innerWidth])

        const yScale = d3.scaleBand()
            .domain(firstHalf)
            .range([0, innerHeight])

        return (
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <AxisBottom
                        xScale={xAxisScale}
                        innerHeight={innerHeight}
                    />
                    <AxisLeft
                        yScale={yScale}
                    />
                </g>
            </svg>
        )
    } else {
        return (
            <div>loading</div>
        )
    }
}