import React from 'react';
import * as d3 from 'd3';
import * as ss from 'simple-statistics'
import ChartContainer, { useChartContext } from '../components/chart-container/chart-container';

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3', '#00A5E3', '#8DD7BF', '#FF96C5'];

const catColor = {
    1: '#1f77b4',
    2: '#ff7f0e',
    3: "#FF96C5",
    4: "#FF5768",
    5: "#FFBF65",
    6: "#9467bd",
    7: "#fdbf6f",
    8: "#ff7f0e",
    9: "#fb9a99",
    10: "#8c564b",
    12: "#9467bd",
    14: "#00A5E3",
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
    show,
    regions,
    patchLabels,
    regionLabels,
    communityObj,
    eegList,
    setEegList,
    networkType
}) => {

    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper
                data={data}
                patchOrder={patchOrder}
                electrodes={electrodes}
                sample={sample}
                topPercent={topPercent}
                show={show}
                regions={regions}
                patchLabels={patchLabels}
                regionLabels={regionLabels}
                communityObj={communityObj}
                eegList={eegList}
                setEegList={setEegList}
                networkType={networkType}
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
    show,
    regions,
    patchLabels,
    regionLabels,
    communityObj,
    eegList,
    setEegList,
    networkType
}) => {
    // console.log(show, regions)
    // console.log(patchLabels)
    // console.log(regionLabels)

    const dimensions = useChartContext();

    const electrode_positions = {};
    const rows = [];

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

    const sourceElectrodes = new Set();

    topEdges.forEach(edge => {
        const source = parseInt(edge[0].split('_')[0]);
        sourceElectrodes.add(source);
    });

    const lineGenerator = d3.link(d3.curveBumpY)
        .x(d => electrode_positions[d] ? electrode_positions[d].x : 0)
        .y(d => electrode_positions[d] ? electrode_positions[d].y : 0)

    const lineColor = d3.scaleSequential(d3.interpolateReds)
        .domain([data[0].index, data[data.length - 1].index])

    const lineWidth = d3.scaleLinear()
        .domain([topEdges[0][1], topEdges[topEdges.length - 1][1]])
        .range([1, 5])

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
                                fill={show === 'patch' ? colorslist[patchLabels[circleIndex]]
                                    : show === 'communities' ? catColor[communityObj[electrodes[circleIndex]]]
                                        : show === 'regions' ? colorslist[regions.indexOf(regionLabels[circleIndex])]
                                            : `#1f77b4`}
                            // stroke={sourceElectrodes.has(electrodes[circleIndex]) ? '#2d004b' : 'none'}
                            // strokeWidth={sourceElectrodes.has(electrodes[circleIndex]) ? 3 : 0}
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
        // console.log(circlesPerRow)
        const numRows = patchOrder ? patchOrder.length : 0;

        let patchMatrix = [];
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
                if (patchMatrix[i][j] === null) continue;

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
                            fill={show === 'patch' ? colorslist[patchLabels[currElectrode]]
                                : show === 'communities' ? catColor[communityObj[currElectrode]]
                                    : show === 'regions' ? colorslist[regions.indexOf(regionLabels[currElectrode])]
                                        : `#1f77b4`}
                        // stroke={sourceElectrodes.has(currElectrode) ? '#2d004b' : 'none'}
                        // strokeWidth={sourceElectrodes.has(currElectrode) ? 3 : 0}
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

    // console.log(electrode_positions)

    // gradient line color
    const gradients = topEdges.map(edge => {
        const source = parseInt(edge[0].split('_')[0]);
        const target = parseInt(edge[0].split('_')[1]);
        const id = `gradient-${sample}-${source}-${target}`;
        // console.log(source, target)
        // console.log(electrode_positions[source], electrode_positions[target])

        return (
            <linearGradient
                id={id}
                key={id}
                x1={electrode_positions[source]?.x}
                y1={electrode_positions[source]?.y}
                x2={electrode_positions[target]?.x}
                y2={electrode_positions[target]?.y}
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0%" stopColor="#bd0026" /> {/* Darker color at the source */}
                <stop offset="100%" stopColor="#ffffcc" /> {/* Lighter color at the target */}
            </linearGradient>
        );
    });

    let lines = []
    for (const edge of topEdges) {
        const source = parseInt(edge[0].split('_')[0]);
        const target = parseInt(edge[0].split('_')[1]);
        // gradient color
        const gradientId = `url(#gradient-${sample}-${source}-${target})`;
        if (electrodes.includes(source) && electrodes.includes(target)) {
            // console.log(source, target)
            // console.log(electrode_positions[source], electrode_positions[target])
            const linePath = lineGenerator({ source, target });
            const midX = (electrode_positions[source]?.x + electrode_positions[target]?.x) / 2;
            const midY = (electrode_positions[source]?.y + electrode_positions[target]?.y) / 2;

            // Calculate a directional vector from source to target
            const directionX = electrode_positions[target]?.x - electrode_positions[source]?.x;
            const directionY = electrode_positions[target]?.y - electrode_positions[source]?.y;
            const length = Math.sqrt(directionX * directionX + directionY * directionY);

            // Normalize this vector to a small length
            if (length !== 0) {
                const unitX = (directionX / length) * 9;
                const unitY = (directionY / length) * 5;

                // Calculate a new start point slightly offset from the midpoint towards the source
                const newStartX = midX - unitX * 0.5;
                const newStartY = midY - unitY * 0.5;
                const overlayLinePath = `M${newStartX},${newStartY} L${newStartX + unitX},${newStartY + unitY}`;

                lines.push(
                    <React.Fragment key={`${sample}_${source}_${target}-group`}>
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
                            key={`${sample}_${source}_${target}-arrow`}
                            // stroke="red"
                            strokeWidth={2}
                            markerEnd={`url(#arrow-${networkType})`}
                            fill="none"
                        />
                    </React.Fragment>
                );
            }
        }
    }

    const handleBrushEnd = (event) => {
        const selection = event.selection;
        if (selection) {
            // Find electrodes within the brushed area
            const selectedElectrodes = Object.keys(electrode_positions).filter((electrode) => {
                const posX = electrode_positions[electrode]?.x;
                const posY = electrode_positions[electrode]?.y;
                return posX >= selection[0][0] && posX <= selection[1][0] && posY >= selection[0][1] && posY <= selection[1][1];
            }).map(electrode => +electrode);

            // Update state to store the selected electrodes
            setEegList(
                eegList === null ?
                    selectedElectrodes :
                    eegList.concat(selectedElectrodes.filter(electrode => !eegList.includes(electrode)))
            );
        }
    }
    const brush = d3.brush()
        .extent([[0, 0], [dimensions.boundedWidth, dimensions.boundedHeight]])
        .on('end', handleBrushEnd)

    return (
        <g>
            <defs>
                {gradients}
                <marker id={`arrow-${networkType}`} viewBox="0 0 12 12" refX="5" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
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
            <g ref={node => d3.select(node).call(brush)}></g>
            {lines}
            {rows}
            {/* <g ref={node => d3.select(node).call(brush)}></g> */}
        </g>
    );
};
