import { curveNatural, line } from "d3";

export const LinePlot = ({
    data,
    xScale,
    yLineScale,
    yAxisScale,
    each,
    scaleOffset
}) => {
    // console.log("in line plot")
    // console.log(data)
    // console.log(yAxisScale)
    return (
        <g transform={`translate(0, ${yAxisScale(each) + scaleOffset})`}>
            <path
                id="line-plot"
                fill="none"
                stroke='#137B80'
                strokeWidth={"2px"}
                d={line()
                    .x((d, i) => {
                        // console.log("line plot d")
                        // console.log(i)
                        return xScale(i)
                    })
                    .y((d, i) => {
                        // console.log("line plot i")
                        // console.log(time[i])
                        return yLineScale(d.frequency)
                    })
                    // .curve(curveNatural)
                    (data)}
            />
        </g>
    )
};