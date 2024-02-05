import React from 'react';
import * as d3 from 'd3';
import * as ss from 'simple-statistics'
import ChartContainer, { useChartContext } from '../components/chart-container/chart-container';

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3', '#00A5E3', '#8DD7BF', '#FF96C5'];

const catColor = {
    1: "#00A5E3",
    2: "#8DD7BF",
    3: "#FF96C5",
    4: "#FF5768",
    5: "#FFBF65",
    6: "#9467bd",
    7: "#fdbf6f",
    8: "#ff7f0e",
    9: "#fb9a99",
    10: "#8c564b",
    12: "#9467bd",
    14: "#ff7f0e",
}

const containerProps = {
    useZoom: false,
    ml: 2,
    mr: 2,
    mb: 0,
    mt: 10,
};
export const Create2DNetwork = ({
    sample,
    data,
    patchOrder,
    electrodes,
    topPercent,
    colorTheLine,
    show,
    labels,
    communityObj
}) => {

    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper
                data={data}
                patchOrder={patchOrder}
                electrodes={electrodes}
                sample={sample}
                topPercent={topPercent}
                colorTheLine={colorTheLine}
                show={show}
                labels={labels}
                communityObj={communityObj}
            />
        </ChartContainer>
    );
};

const RegionWrapper = ({
    data,
    patchOrder,
    electrodes,
    sample,
    topPercent,
    colorTheLine,
    show,
    labels,
    communityObj
}) => {

    const dimensions = useChartContext();

    const electrode_positions = {};
    const rows = [];

    if (patchOrder === null) {
        const circlesPerRow = 8;
        const count = electrodes.length;
        const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);
        const numRows = Math.ceil(count / circlesPerRow);

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
                                fill={show === 'patch' ? colorslist[labels[circleIndex]]
                                    : show === 'communities' ? catColor[communityObj[electrodes[circleIndex]]]
                                        : `#1f77b4`}
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
    } else {

        let circlesPerRow = patchOrder?.reduce((max, arr) => Math.max(max, arr.length), 0);
        const numRows = patchOrder ? patchOrder.length : 0;

        let patchMatrix = []
        if (circlesPerRow === 1) {
            patchMatrix.push([].concat(...patchOrder));
            circlesPerRow = patchMatrix[0].length;
        } else {
            patchMatrix = patchOrder
        }

        for (let i = 0; i < patchMatrix.length; i++) {
            const circles = [];
            const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);

            for (let j = 0; j < patchMatrix[i].length; j++) {
                const temp = circlesPerRow - patchMatrix[i].length;

                const currElectrode = patchMatrix[i][j];
                electrode_positions[currElectrode] = {
                    "x": 10 + j * (circleSpacing + 2 * 10) + temp * (circleSpacing + 2 * 10),
                    "y": (i + 0.5) * (dimensions.boundedHeight / numRows)
                }
                circles.push(
                    <g key={`${sample}_${i}_${j}`}>
                        <circle
                            key={currElectrode}
                            cx={10 + j * (circleSpacing + 2 * 10) + temp * (circleSpacing + 2 * 10)}
                            cy={(i + 0.5) * (dimensions.boundedHeight / numRows)}
                            r={5}
                            fill={show === 'patch' ? colorslist[sample]
                                : show === 'communities' ? catColor[communityObj[currElectrode]]
                                    : `#1f77b4`}
                        />
                        <title>{`
                            Electrode : E${currElectrode}
                        `}</title>
                    </g>
                );
                // }
            }
            rows.push(<g key={i}>{circles}</g>);
        }

    }



    const edgeCounter = {}
    for (const connection of data) {
        if (connection.network.length === 0) {
            continue;
        }
        for (const network of connection.network) {
            const source = network.source;
            const target = network.target;
            const key = `${source}_${target}`
            if (key in edgeCounter) {
                edgeCounter[key] += 1;
            } else {
                edgeCounter[key] = 1;
            }
        }
    }

    const sortedEdges = Object.entries(edgeCounter)
        .filter(([key, value]) => value > 1) // Filter values not greater than 1
        .sort((a, b) => a[1] - b[1]);      // Sort based on values in ascending order

    const sortedValues = sortedEdges.map(edge => edge[1])

    const percentileVal = ss.quantileSorted(sortedValues, topPercent / 100);

    const topEdges = sortedEdges.filter(edge => edge[1] >= percentileVal);


    const lineGenerator = d3.link(d3.curveBumpY)
        .x(d => electrode_positions[d] ? electrode_positions[d].x : 0)
        .y(d => electrode_positions[d] ? electrode_positions[d].y : 0)

    const lineColor = d3.scaleSequential(d3.interpolateReds)
        .domain([data[0].index, data[data.length - 1].index])

    const lineWidth = d3.scaleLinear()
        .domain([topEdges[0][1], topEdges[topEdges.length - 1][1]])
        .range([0.25, 3.5])

    // test gradient line color
    const gradients = topEdges.map(edge => {
        const source = parseInt(edge[0].split('_')[0]);
        const target = parseInt(edge[0].split('_')[1]);
        const id = `gradient-${source}-${target}`;
    
        return (
            <linearGradient id={id} x1={electrode_positions[source].x} y1={electrode_positions[source].y} x2={electrode_positions[target].x} y2={electrode_positions[target].y} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fdbb84" /> {/* Lighter color at the source */}
                <stop offset="100%" stopColor="#bd0026" /> {/* Darker color at the target */}
            </linearGradient>
        );
    });

    let lines = []
    if (colorTheLine === 'width') {
        for (const edge of topEdges) {
            const source = parseInt(edge[0].split('_')[0]);
            const target = parseInt(edge[0].split('_')[1]);
            // test gradient color
            const gradientId = `url(#gradient-${source}-${target})`;
            if (electrodes.includes(source) && electrodes.includes(target)) {
                const linePath = lineGenerator({ source, target });
                const midX = (electrode_positions[source].x + electrode_positions[target].x) / 2;
                const midY = (electrode_positions[source].y + electrode_positions[target].y) / 2;
                const overlayLinePath = `M${midX},${midY} L${midX},${midY}`;
                lines.push(
                    <>
                        <path
                            key={`${sample}_${source}_${target}`}
                            d={linePath}
                            // stroke={'red'}
                            stroke={gradientId} 
                            strokeWidth={lineWidth(edge[1])}
                            fill="none"
                        />
                        <path
                            d={overlayLinePath}
                            stroke="red"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                            fill="none"
                        />
                    </>
                );

            }
        }
    } else {
        const edgeLists = topEdges.map(edge => edge[0])
        // console.log(edgeLists)
        lines = data.map((connection, i) => {
            if (connection.network.length === 0) {
                return null;
            }
            let allLines = []
            for (const network of connection.network) {
                const source = parseInt(network.source);
                const target = parseInt(network.target);
                const key = `${source}_${target}`
                if (edgeLists.includes(key) && electrodes.includes(source) && electrodes.includes(target)) {
                    const linePath = lineGenerator({ source, target });
                    allLines.push(
                        <path
                            key={`${sample}_${i}_${source}_${target}`}
                            d={linePath}
                            stroke={lineColor(connection.index)}
                            strokeWidth={0.1}
                            fill="none"
                        />
                    );
                }
            }
            return allLines;

        })
    }

    return (
        <g>
            <defs>
                {gradients}
                <marker id="arrow" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill="black" />
                </marker>
            </defs>
            <text x={0} y={-1} fontSize={12} fill="black" textAnchor="start">
                {patchOrder === null ? `Sample: ${sample}` : `Patch: ${sample}`}
            </text>
            <rect
                x={0}
                y={0}
                width={dimensions.boundedWidth}
                height={dimensions.boundedHeight}
                fill={`#dddddd`}
                opacity={0.2}
            // stroke="black"
            />
            {lines}
            {rows}
        </g>
    );
};
