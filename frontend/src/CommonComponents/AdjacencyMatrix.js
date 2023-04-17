import * as d3 from "d3";
export const AdjacencyMatrix = ({
    data,
    columns,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    height = 350,
    width = 350,
    colorRange = ["#fcbba1", "#a50f15"]
}) => {

    let xScale = d3.scaleBand()
        .domain(columns)
        .range([margin.left, width - margin.right])

    let yScale = d3.scaleBand()
        .domain([...columns].reverse())
        .range([height - margin.bottom, margin.top])

    let max_val = d3.max(data, d => d3.max(d))

    let color = d3.scaleLinear()
        .domain([0, max_val])
        .range(colorRange)

    return (
        <svg width={width} height={height}>
            {
                <g>
                    {
                        columns.map((col, i) => {
                            return (
                                <g key={i}>
                                    <text
                                        key={`top_${i}`}
                                        x={xScale(col) + xScale.bandwidth() / 2}
                                        y={margin.top / 2}
                                        textAnchor="middle"
                                        fontSize="1em"
                                    >
                                        {col}
                                    </text>
                                    <text
                                        key={`left_${i}`}
                                        x={margin.left / 2}
                                        y={yScale(col) + yScale.bandwidth() / 2}
                                        textAnchor="middle"
                                        fontSize="1em"
                                    >
                                        {col}
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
                                                            rx={4}
                                                            ry={4}
                                                        /><title>{col}</title>
                                                    </g>

                                                )
                                            })
                                        }
                                    </g>
                                )
                            })
                        }
                    </g>
                </g>
            }

        </svg>
    )
};