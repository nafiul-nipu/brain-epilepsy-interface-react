import { line, curveCatmullRom } from "d3";

// creating the line
export const LinePlot = ({
    data,
    xScale,
    yLineScale
}) => {
    // console.log("in line plot")
    // console.log(data)
    // console.log(yAxisScale)
    // console.log(`${keyNumber}_${each}`)
    return (
        <g>

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
                        return yLineScale(d.count)
                    })
                    .curve(curveCatmullRom)
                    (data)}
            />

        </g>
    )
};