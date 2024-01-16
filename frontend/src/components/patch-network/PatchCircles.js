import React from 'react';
import * as d3 from 'd3';
import ChartContainer, { useChartContext } from '../chart-container/chart-container';

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
export const PatchCircles = ({
    sample,
    data,
    patchOrder,
    electrodes,
    topPercent,
    colorTheLine,
    show,
    communityObj
}) => {
    // console.log(sample)
    // // console.log(data)
    // console.log(electrodes)
    // console.log(patchOrder)
    // console.log(communityObj)

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
                communityObj={communityObj}
            />
        </ChartContainer>
    );
};

const RegionWrapper = ({ data, patchOrder, electrodes, sample, topPercent, colorTheLine, show, communityObj }) => {
    // console.log(data)
    // console.log(electrodes)

    // console.log(filteredObjects)

    const dimensions = useChartContext();

    let circlesPerRow = patchOrder?.reduce((max, arr) => Math.max(max, arr.length), 0);
    const electrode_positions = {};
    const rows = [];
    const numRows = patchOrder ? patchOrder.length : 0;

    // console.log(circlesPerRow)
    let patchMatrix = []
    if (circlesPerRow === 1) {
        patchMatrix.push([].concat(...patchOrder));
        circlesPerRow = patchMatrix[0].length;
    } else {
        patchMatrix = patchOrder
    }
    // console.log(patchMatrix)

    for (let i = 0; i < patchMatrix.length; i++) {
        const circles = [];
        // const circlesPerRow = patchOrder[i].length;
        const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);

        for (let j = 0; j < patchMatrix[i].length; j++) {
            const temp = circlesPerRow - patchMatrix[i].length;

            const currElectrode = patchMatrix[i][j];
            // if (circleIndex < count) {
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

    // console.log(electrode_positions)

    // console.log(Object.keys(electrode_positions).length)
    // console.log(data)
    const edgeCounter = {}
    let edges = 0
    for (const connection of data) {
        if (connection.network.length === 0) {
            continue;
        }
        for (const network of connection.network) {
            edges += 1;
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
    // console.log(edgeCounter)

    const sortedEdges = Object.entries(edgeCounter)
        .sort((a, b) => b[1] - a[1]);

    // console.log(sortedEdges)

    const topCount = Math.ceil(edges * topPercent);

    // Extract the top 5% edges
    const topEdges = sortedEdges.slice(0, topCount);
    // console.log("Top", topPercent, "edges:", topEdges);


    const lineGenerator = d3.line()
        .x(d => electrode_positions[d] ? electrode_positions[d].x : 0)
        .y(d => electrode_positions[d] ? electrode_positions[d].y : 0)
        .curve(d3.curveLinear);

    const lineColor = d3.scaleSequential(d3.interpolateReds)
        .domain([data[0].index, data[data.length - 1].index])

    // const lineWidth = d3.scaleLinear()
    //     .domain([sortedEdges[sortedEdges.length - 1][1], sortedEdges[0][1]])
    //     .range([0.001, 3])

    const lineWidth = d3.scaleLinear()
        .domain([topEdges[topEdges.length - 1][1], topEdges[0][1]])
        .range([0.001, 3])

    // console.log(electrodes)
    // console.log(electrode_positions)
    // console.log(topEdges)
    let lines = []
    if (colorTheLine === 'width') {
        for (const edge of topEdges) {
            const source = edge[0].split('_')[0];
            const target = edge[0].split('_')[1];
            // console.log(source, target)
            // console.log(electrode_positions[source], electrode_positions[target])
            if (electrodes.includes(parseInt(source)) && electrodes.includes(parseInt(target))) {
                const linePath = lineGenerator([source, target]);
                lines.push(
                    <path
                        key={`${sample}_${source}_${target}`}
                        d={linePath}
                        stroke={'red'}
                        strokeWidth={lineWidth(edge[1])}
                        fill="none"
                    />
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
                const source = network.source;
                const target = network.target;
                const key = `${source}_${target}`
                if (edgeLists.includes(key) && electrodes.includes(parseInt(source)) && electrodes.includes(parseInt(target))) {
                    const linePath = lineGenerator([source, target]);
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
            <text x={0} y={-1} fontSize={12} fill="black" textAnchor="start">
                {`Patch: ${sample}`}
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
