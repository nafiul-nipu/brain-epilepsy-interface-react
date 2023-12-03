import { area, line, curveCatmullRom } from "d3";

// creating the line
export const LinePlot = ({
    data,
    xScale,
    yLineScale,
    colorChecker = null,
    curr = null
}) => {
    // console.log("in line plot")
    // console.log(data)
    // console.log(yAxisScale)
    // console.log(`${keyNumber}_${each}`)
    const bands = data.map((value) => [value, -value])
    return (
        <g>

            <path
                id="line-plot"
                fill={colorChecker?.includes(curr) ? '#137B80' : 'grey'}
                // stroke={colorChecker?.includes(curr) ? '#137B80' : 'grey'}
                strokeWidth={50}
                // d={line()
                //     .x((d, i) => {
                //         // console.log("line plot d")
                //         // console.log(i)
                //         return xScale(i)
                //     })
                //     .y((d, i) => {
                //         // console.log("line plot i")
                //         // console.log(time[i])
                //         return yLineScale(d)
                //     })
                //     .curve(curveCatmullRom)
                //     (data)}
                d={area()
                    .x((d, i) => xScale(i))
                    .y0((d, i) => yLineScale(d[0]))
                    .y1((d, i) => yLineScale(d[1]))
                    (bands)
                }
            />

        </g>
    )
};