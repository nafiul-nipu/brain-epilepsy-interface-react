import React from 'react';
import * as d3 from 'd3';
import ChartContainer, { useChartContext } from '../components/chart-container/chart-container';

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3'];

const containerProps = {
    useZoom: false,
    ml: 2,
    mr: 2,
    mb: 0,
    mt: 10,
};
export const RegionCircles = ({
    colorIndex,
    data,
    electrodes,
    sample,
    sampleCount,
    currsample

}) => {
    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper
                colorIndex={colorIndex}
                data={data}
                electrodes={electrodes}
                sample={sample}
                sampleCount={sampleCount}
                currsample={currsample}
            />
        </ChartContainer>
    );
};

const RegionWrapper = ({ colorIndex, data, electrodes, sample, sampleCount, currsample }) => {
    // console.log(data)
    // console.log(electrodes)

    // console.log(filteredObjects)

    const dimensions = useChartContext();

    const circlesPerRow = 8;
    const count = electrodes.length;
    const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);
    const numRows = Math.ceil(count / circlesPerRow);

    const electrode_positions = {}
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const circles = [];
        for (let j = 0; j < circlesPerRow; j++) {
            const circleIndex = i * circlesPerRow + j;
            if (circleIndex < count) {
                electrode_positions[electrodes[circleIndex]] = {
                    "x": 10 + j * (circleSpacing + 2 * 10),
                    "y": (i + 0.5) * (dimensions.boundedHeight / numRows)
                }
                circles.push(
                    <g key={`${sample}_${i}_${j}`}>
                        <circle
                            key={circleIndex}
                            cx={10 + j * (circleSpacing + 2 * 10)}
                            cy={(i + 0.5) * (dimensions.boundedHeight / numRows)}
                            r={5}
                            fill={`${colorslist[colorIndex]}`}
                        />
                        <title>{`
                        Electrode : E${electrodes[circleIndex]}
                    `}</title>
                    </g>
                );
            }
        }
        rows.push(<g key={i}>{circles}</g>);
    }

    // console.log(Object.keys(electrode_positions).length)

    const lineGenerator = d3.line()
        .x(d => electrode_positions[d].x)
        .y(d => electrode_positions[d].y)
        .curve(d3.curveLinear);

    const lineColor = d3.scaleSequential(d3.interpolateReds)
        .domain([data[0].index, data[data.length - 1].index])


    // console.log(data)
    const lines = data.map((connection, i) => {
        if (connection.network.length === 0) {
            return null;
        }
        let lines = []
        for (const network of connection.network) {
            const source = network.source;
            const target = network.target;
            const linePath = lineGenerator([source, target]);
            lines.push(
                <path
                    key={`${sample}_${i}_${source}_${target}`}
                    d={linePath}
                    stroke={lineColor(connection.index)}
                    strokeWidth={0.1}
                    fill="none"
                />
            );
        }
        return lines;
    });


    return (
        <g>
            <text x={0} y={-1} fontSize={12} fill="black" textAnchor="start">
                {`Sample: ${sample}`}
            </text>
            <rect
                x={0}
                y={0}
                width={dimensions.boundedWidth}
                height={dimensions.boundedHeight}
                fill={`${colorslist[colorIndex]}`}
                opacity={0.2}
                stroke="black"
            />
            {lines}
            {rows}
        </g>
    );
};
