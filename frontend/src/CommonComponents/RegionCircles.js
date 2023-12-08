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
    data,
    circleRadius,
    roi,
    roiCount,
    roiFilter,
    setRoiFilter,
    electrodeData,
    eventNetworkData
}) => {
    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper
                data={data}
                circleRadius={circleRadius}
                roi={roi}
                roiCount={roiCount}
                roiFilter={roiFilter}
                setRoiFilter={setRoiFilter}
                electrodeData={electrodeData}
                eventNetworkData={eventNetworkData}
            />
        </ChartContainer>
    );
};

const RegionWrapper = ({ data, eventNetworkData, circleRadius, roi, roiCount, roiFilter, electrodeData, setRoiFilter }) => {

    const filteredObjects = electrodeData.filter((obj) =>
        data.activeElectrode.includes(obj.electrode_number)
    );
    // console.log(filteredObjects)

    const dimensions = useChartContext();

    const circlesPerRow = 8;
    const count = data.activeElectrode.length;
    const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);
    const numRows = Math.ceil(count / circlesPerRow);

    const roiScale = d3.scaleLinear()
        .domain([0, d3.max(roiCount)])
        .range([0, dimensions.boundedWidth - 40]);

    const electrode_positions = {}
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const circles = [];
        for (let j = 0; j < circlesPerRow; j++) {
            const circleIndex = i * circlesPerRow + j;
            if (circleIndex < count) {
                electrode_positions[data.activeElectrode[circleIndex]] = {
                    "x": 10 + j * (circleSpacing + 2 * 10),
                    "y": (i + 0.5) * (dimensions.boundedHeight / numRows)
                }
                circles.push(
                    <g key={`${i}_${j}`}>
                        <circle
                            key={circleIndex}
                            cx={10 + j * (circleSpacing + 2 * 10)}
                            cy={(i + 0.5) * (dimensions.boundedHeight / numRows)}
                            r={5}
                            fill={`${colorslist[roi]}`}
                        />
                        <title>{`
                        Electrode : E${data.activeElectrode[circleIndex]}\nFrequency : ${data.frequency[circleIndex]}
                    `}</title>
                    </g>
                );
            }
        }
        rows.push(<g key={i}>{circles}</g>);
    }

    // console.log(electrode_positions)

    const lineGenerator = d3.line()
        .x(d => electrode_positions[d].x)
        .y(d => electrode_positions[d].y)
        .curve(d3.curveLinear);

    // console.log(eventNetworkData)
    const lines = eventNetworkData.map((connection, i) => {
        const connectionNetworkSource = connection.network.map(item => item.source);
        const connectionNetworkTarget = connection.network.map(item => item.target);

        // Flatten the arrays
        const flattenedSource = connectionNetworkSource.flat();
        const flattenedTarget = connectionNetworkTarget.flat();

        const sourceObjects = filteredObjects.filter(obj => flattenedSource.includes(obj.electrode_number));
        const targetObjects = filteredObjects.filter(obj => flattenedTarget.includes(obj.electrode_number));

        // Add these lines for debugging
        // console.log('Connection:', connection);
        // console.log('Filtered Objects:', filteredObjects);
        // console.log('Source Objects:', sourceObjects);
        // console.log('Target Objects:', targetObjects);

        // Check if source and target are not empty before proceeding
        if (sourceObjects.length > 0 && targetObjects.length > 0) {
            // Create a line for every pair of points
            const lines = [];
            for (const source of sourceObjects) {
                // console.log(source);
                for (const target of targetObjects) {
                    // console.log(target)
                    // Use the lineGenerator to create a line path
                    const linePath = lineGenerator([source.electrode_number, target.electrode_number]);
                    lines.push(
                        <path
                            key={`${source.electrode_number}_${target.electrode_number}`}
                            d={linePath}
                            stroke="gray"
                            strokeWidth={0.1}
                            fill="none"
                        />
                    );
                }
            }
            return lines;
        } else {
            return null;
        }
    });


    return (
        <g>
            <text x={0} y={-1} fontSize={12} fill="black" textAnchor="start">
                {`Roi: ${roi}`}
            </text>
            <rect
                x={0}
                y={0}
                width={dimensions.boundedWidth}
                height={dimensions.boundedHeight}
                fill={`${colorslist[roi]}`}
                opacity={0.2}
                stroke="black"
            />
            <rect
                x={35}
                y={-10}
                width={roiScale(roiCount[roi])}
                height={containerProps.mt - containerProps.ml}
                fill={roi === roiFilter ? '#FFA500' : '#2b2b2a'}
                onClick={() => setRoiFilter(roi)}
            />
            <title>{`
            Roi : ${roi}\nFrequency : ${roiCount[roi]}
        `}</title>
            {lines}
            {rows}
        </g>
    );
};
