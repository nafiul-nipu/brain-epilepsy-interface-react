import * as d3 from 'd3'
import { LinePlot } from "./LinePlot";

export const MultiLineCreation = ({
    electrodeListData, 
    electrodeData,
    yAxisScale,
    xlineRange,
    scaleOffset,
    keyNumber    
}) =>{ 
    // console.log(electrodeData)
    // for each electrode creating one line plot
    return (electrodeListData.map((each, i) => {
        // console.log(each, i);
        // filtering the data based on the electrodes
        var result = electrodeData.filter(obj => {
            return obj.start === each;
        });
        // if (result[0].start === 11) {
        //     console.log(result)
        // }
        // console.log(each, yAxisScale(each), (yAxisScale.bandwidth() + yAxisScale(each)))

        // setting domain based on the frequency
        let domain = [...new Set(result.map((item) => item.frequency))]

        // line Y scale - rande is bandwidth as each Y position is a line chart
        let yLineScale = d3.scaleLinear()
            .domain([0, d3.max(domain)])
            .range([(yAxisScale.bandwidth() / 2), 0])

        // line x scale
        let xLineScale = d3.scaleLinear()
            .range(xlineRange)
            .domain([0, result.length - 1])

        // console.log(xLineScale.domain(), xLineScale.range(), xLineScale(9))

        return (
            <LinePlot
                key={each}
                data={result}
                xScale={xLineScale}
                yLineScale={yLineScale}
                yAxisScale={yAxisScale}
                each={each}
                scaleOffset={scaleOffset}
                keyNumber={keyNumber}
            />
        )
    }))
}