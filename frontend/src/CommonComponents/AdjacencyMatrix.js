import * as d3 from "d3";
import ChartContainer, {
    useChartContext,
} from "../components/chart-container/chart-container";

const containerProps = {
    useZoom: false,
    ml: 20,
    mr: 20,
    mb: 20,
    mt: 20,
};

export const AdjacencyMatrix = ({
    data,
    columns,
    colorRange = ["#fcbba1", "#a50f15"],
    fontSize = "0.45em",
    labels
}) => {

    // const containerProps = {
    //     useZoom: false,
    //     ml: margin.left,
    //     mr: margin.right,
    //     mb: margin.bottom,
    //     mt: margin.top,
    // };
    return (
        <ChartContainer {...containerProps}>
            <Wrapper data={data} columns={columns} colorRange={colorRange} fontSize={fontSize} labels={labels} />
        </ChartContainer>
    )
};

const Wrapper = ({ data, columns, colorRange, fontSize, labels }) => {
    // console.log(data)
    // console.log(columns)
    const dimensions = useChartContext();

    let xScale = d3.scaleBand()
        .domain(columns)
        .range([containerProps.ml, dimensions.boundedWidth])

    let yScale = d3.scaleBand()
        .domain([...columns].reverse())
        .range([dimensions.boundedHeight, containerProps.mt])

    let max_val = d3.max(data, d => d3.max(d))

    let color = d3.scaleLinear()
        .domain([0, max_val === 0 ? 1 : max_val])
        .range(colorRange)

    return (
        <>
            {
                columns.map((col, i) => {
                    return (
                        <g key={i}>
                            <text
                                key={`top_${i}`}
                                x={xScale(col) + xScale.bandwidth() / 2}
                                y={containerProps.ml / 2}
                                textAnchor="middle"
                                fontSize={fontSize}
                            >
                                {labels[i]}
                            </text>
                            <text
                                key={`left_${i}`}
                                x={containerProps.ml / 2}
                                y={yScale(col) + yScale.bandwidth() / 2}
                                textAnchor="middle"
                                fontSize={fontSize}
                            >
                                {labels[i]}
                            </text>
                        </g>

                    )
                })
            }
            <g>
                {
                    data.map((row, i) => {
                        return (
                            <g key={i}>
                                {
                                    row.map((col, j) => {
                                        return (
                                            <g key={i + "-" + j}>
                                                <rect
                                                    key={i + "-" + j}
                                                    x={xScale(i)}
                                                    y={yScale(j)}
                                                    width={xScale.bandwidth()}
                                                    height={yScale.bandwidth()}
                                                    fill={color(col)}
                                                    rx={2}
                                                    ry={2}
                                                /><title>{`
                                                Source: ${labels[i]}\nTarget : ${labels[j]} \nFrequency : ${col}
                                                `}</title>
                                            </g>

                                        )
                                    })
                                }
                            </g>
                        )
                    })
                }
            </g>
        </>

    )
}