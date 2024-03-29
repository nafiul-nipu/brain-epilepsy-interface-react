import { CatmullRomLine, Line, QuadraticBezierLine, Cone } from "@react-three/drei"
import { useLayoutEffect, useState, useEffect } from "react"
import { Vector3, Euler, Quaternion, QuadraticBezierCurve3 } from "three"
import React from 'react'
import * as d3 from 'd3'
import * as ss from 'simple-statistics'

let currentIndex = 0;

export const NetworkView = ({
    electrodeData,
    networkData,
    topPercent,
    bbox,
    selectedRoi,
    eegInBrain,
    network_per_minute,
    visualPanel,
    propagatoinButtonValue,
    setPropagationSlider,
    endTime
}) => {
    const [edgeData, setEdgeData] = useState(null)
    const lineWidth = d3.scaleLinear()
        .range([2, 5])
    useLayoutEffect(() => {
        // console.log("create line is being called")
        // console.log(electrodeData)
        // console.log(networkData)
        if (propagatoinButtonValue === 'Pause') return;
        let positions = []
        if (visualPanel !== 'Propagation') {
            // console.log(visualPanel)

            const electrodeLabels = {};
            electrodeData.forEach(electrode => {
                if (typeof selectedRoi === 'string') {
                    electrodeLabels[electrode.electrode_number] = electrode.region;
                } else {
                    electrodeLabels[electrode.electrode_number] = electrode.label;
                }
            })
            // console.log(typeof selectedRoi)
            // console.log(electrodeLabels)
            const edgeCounter = {}
            for (const connection of networkData) {
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
            // console.log(edgeCounter)

            const sortedEdges = Object.entries(edgeCounter)
                .filter(([key, value]) => value > 1) // Filter values not greater than 1
                .sort((a, b) => a[1] - b[1]);      // Sort based on values in ascending order

            // console.log(sortedEdges)

            const sortedValues = sortedEdges.map(edge => edge[1])
            // console.log(sortedValues)

            let percentileVal = ss.quantileSorted(sortedValues, topPercent / 100);

            // for ep165 python code generated percentile value of 99
            // but for this code it is generating 100 TODO: check why
            console.log(percentileVal)
            percentileVal = percentileVal === 100 ? 99 : percentileVal;

            const topEdges = sortedEdges.filter(edge => edge[1] >= percentileVal);

            console.log(topEdges.length)

            lineWidth.domain([topEdges[topEdges.length - 1][1], topEdges[0][1]]);


            if (eegInBrain !== null && eegInBrain !== undefined) {
                // console.log('eeg in Brain Selected')
                for (const edge of topEdges) {
                    const source = parseInt(edge[0].split('_')[0]);
                    const target = parseInt(edge[0].split('_')[1]);

                    if (eegInBrain === source || eegInBrain === target) {
                        const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                        const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)

                        if ((sourcePos !== undefined) && (targetPos !== undefined)) {
                            positions.push({
                                'source': new Vector3(sourcePos.position[0], sourcePos.position[1], sourcePos.position[2]),
                                'sourceLabel': electrodeLabels[source],
                                'target': new Vector3(targetPos.position[0], targetPos.position[1], targetPos.position[2]),
                                'targetLabel': electrodeLabels[target],
                                'frequency': lineWidth(edge[1]),
                            })
                        }
                    }
                }
            } else if (selectedRoi == null) {
                // console.log("selectedRoi is null")
                for (const edge of topEdges) {
                    // console.log(edge)
                    const source = parseInt(edge[0].split('_')[0]);
                    const target = parseInt(edge[0].split('_')[1]);

                    const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                    const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)

                    if ((sourcePos !== undefined) && (targetPos !== undefined)) {
                        positions.push({
                            'source': new Vector3(sourcePos.position[0], sourcePos.position[1], sourcePos.position[2]),
                            'sourceLabel': electrodeLabels[source],
                            'target': new Vector3(targetPos.position[0], targetPos.position[1], targetPos.position[2]),
                            'targetLabel': electrodeLabels[target],
                            'frequency': lineWidth(edge[1]),
                        })
                    }
                }
            } else {
                for (const edge of topEdges) {
                    // console.log("roi selected")
                    const source = parseInt(edge[0].split('_')[0]);
                    const target = parseInt(edge[0].split('_')[1]);

                    if (selectedRoi === electrodeLabels[source] && selectedRoi === electrodeLabels[target]) {
                        const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                        const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)

                        if ((sourcePos !== undefined) && (targetPos !== undefined)) {
                            positions.push({
                                'source': new Vector3(sourcePos.position[0], sourcePos.position[1], sourcePos.position[2]),
                                'sourceLabel': electrodeLabels[source],
                                'target': new Vector3(targetPos.position[0], targetPos.position[1], targetPos.position[2]),
                                'targetLabel': electrodeLabels[target],
                                'frequency': lineWidth(edge[1]),
                            })
                        }
                    }
                }
            }
        } else {
            // console.log(network_per_minute)
            const electrodeLabels = {};
            electrodeData.forEach(electrode => {
                if (typeof selectedRoi === 'string') {
                    electrodeLabels[electrode.electrode_number] = electrode.region;
                } else {
                    electrodeLabels[electrode.electrode_number] = electrode.label;
                }
            })
            // console.log('paused ', currentIndex)
            // console.log(network_per_minute)
            let network_per_minute_keys = Object.keys(network_per_minute)
            const currentSample = network_per_minute[network_per_minute_keys[currentIndex]];

            if (currentSample.length === 0) {
                positions = [];
            } else {
                const edgeCounter = {}
                for (const network of currentSample) {
                    const source = parseInt(network.source);
                    const target = parseInt(network.target);
                    const key = `${source}_${target}`

                    if (key in edgeCounter) {
                        edgeCounter[key] += 1;
                    } else {
                        edgeCounter[key] = 1;
                    }
                }
                const sortedEdges = Object.entries(edgeCounter)
                    .filter(([key, value]) => value > 1) // Filter values not greater than 1
                    .sort((a, b) => a[1] - b[1]);      // Sort based on values in ascending order

                const sortedValues = sortedEdges.map(edge => edge[1])
                // console.log(sortedValues)
                const percentileVal = sortedValues.length === 0 ? 0 :
                    ss.quantileSorted(sortedValues, topPercent / 100);

                const topEdges = sortedEdges.filter(edge => edge[1] >= percentileVal);

                lineWidth.domain([topEdges[topEdges.length - 1][1], topEdges[0][1]]);

                for (const edge of topEdges) {
                    const source = parseInt(edge[0].split('_')[0]);
                    const target = parseInt(edge[0].split('_')[1]);

                    const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                    const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)

                    if ((sourcePos !== undefined) && (targetPos !== undefined)) {
                        positions.push({
                            'source': new Vector3(sourcePos.position[0], sourcePos.position[1], sourcePos.position[2]),
                            'sourceLabel': electrodeLabels[source],
                            'target': new Vector3(targetPos.position[0], targetPos.position[1], targetPos.position[2]),
                            'targetLabel': electrodeLabels[target],
                            'frequency': lineWidth(edge[1]),
                        })
                    }
                }
            };

        }

        setEdgeData(positions)

    }, [electrodeData,
        networkData,
        topPercent,
        selectedRoi,
        eegInBrain,
        visualPanel,
        network_per_minute,
        propagatoinButtonValue
    ])

    useEffect(() => {
        if (network_per_minute === null || network_per_minute === undefined) return;
        // console.log("interval")

        let keys = Object.keys(network_per_minute)
        let interval;
        if (propagatoinButtonValue === 'Pause') {

            const electrodeLabels = {};
            electrodeData.forEach(electrode => {
                if (typeof selectedRoi === 'string') {
                    electrodeLabels[electrode.electrode_number] = electrode.region;
                } else {
                    electrodeLabels[electrode.electrode_number] = electrode.label;
                }
            })

            const sortedNetwokrPerMinute = {}
            for (const minute in network_per_minute) {
                const edgeCounter = {}
                for (const network of network_per_minute[minute]) {
                    const source = parseInt(network.source);
                    const target = parseInt(network.target);
                    const key = `${source}_${target}`

                    if (key in edgeCounter) {
                        edgeCounter[key] += 1;
                    } else {
                        edgeCounter[key] = 1;
                    }
                }
                const sortedEdges = Object.entries(edgeCounter)
                    .filter(([key, value]) => value > 1) // Filter values not greater than 1
                    .sort((a, b) => a[1] - b[1]);      // Sort based on values in ascending order

                const sortedValues = sortedEdges.map(edge => edge[1])
                // console.log(sortedValues)

                const percentileVal = sortedValues.length === 0 ? 0 :
                    ss.quantileSorted(sortedValues, topPercent / 100);

                // console.log(percentileVal)

                const topEdges = sortedEdges.filter(edge => edge[1] >= percentileVal);

                sortedNetwokrPerMinute[minute] = topEdges

            }
            // console.log(sortedNetwokrPerMinute)
            // console.log(currentIndex)

            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % keys.length;
                // console.log(currentIndex, keys[currentIndex])
                // console.log()
                const currentSample = sortedNetwokrPerMinute[keys[currentIndex]]
                // console.log(currentSample)
                let positions = []
                if (currentSample.length === 0) {
                    positions = [];

                } else {
                    lineWidth.domain([currentSample[currentSample.length - 1][1], currentSample[0][1]]);
                    for (const edge of currentSample) {
                        const source = parseInt(edge[0].split('_')[0]);
                        const target = parseInt(edge[0].split('_')[1]);

                        const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                        const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)

                        if ((sourcePos !== undefined) && (targetPos !== undefined)) {
                            positions.push({
                                'source': new Vector3(sourcePos.position[0], sourcePos.position[1], sourcePos.position[2]),
                                'sourceLabel': electrodeLabels[source],
                                'target': new Vector3(targetPos.position[0], targetPos.position[1], targetPos.position[2]),
                                'targetLabel': electrodeLabels[target],
                                'frequency': lineWidth(edge[1]),
                            })
                        }
                    }
                }
                // console.log(positions)
                setEdgeData(positions)
                const start = currentIndex * 60000;
                const end = (currentIndex + 1) * 60000 > endTime ? endTime : (currentIndex + 1) * 60000;
                setPropagationSlider([start, end])

            }, 2000)

        }
        return () => clearInterval(interval)
    }, [electrodeData, network_per_minute, propagatoinButtonValue, selectedRoi, setPropagationSlider])
    const calculateRadialOffset = (sourcePos, targetPos, radian, radialDistance) => {
        // Calculate midpoint
        const midPoint = new Vector3(
            (sourcePos.x + targetPos.x) / 2,
            (sourcePos.y + targetPos.y) / 2 + 20,
            (sourcePos.z + targetPos.z) / 2 + 20
        );

        // Calculate radial offset
        const direction = new Vector3().subVectors(targetPos, sourcePos).normalize();
        const perpendicular = new Vector3(-direction.z, 0, direction.x).normalize();

        // Offset midpoint
        midPoint.addScaledVector(perpendicular, Math.cos(radian) * radialDistance);
        midPoint.y += Math.sin(radian) * radialDistance; // Adjust Y to create a 3D curve effect

        const curve = new QuadraticBezierCurve3(sourcePos, midPoint, targetPos);
        const points = curve.getPoints(5);
        // console.log(points)

        return { "curve": midPoint, "cone": points[3] };
    };

    const calculateConeOrientation = (sourcePos, targetPos) => {
        const direction = new Vector3().subVectors(targetPos, sourcePos).normalize();
        const orientation = new Euler().setFromQuaternion(
            new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction)
        );
        return orientation;
    };

    function generateBasicGradientColor(sourcePosition, targetPosition, sourceColor, targetColor, stepSize) {
        let distance = Math.sqrt(
            Math.pow(targetPosition.x - sourcePosition.x, 2) +
            Math.pow(targetPosition.y - sourcePosition.y, 2) +
            Math.pow(targetPosition.z - sourcePosition.z, 2)
        );

        // Determine the number of steps based on the distance and a given step size
        let steps = Math.max(1, Math.floor(distance / stepSize));

        let gradientColors = [];
        for (let i = 0; i <= steps; i++) {
            let t = i / steps; // Normalized position between source and target
            let linearColor = [
                sourceColor[0] + (targetColor[0] - sourceColor[0]) * t, // R
                sourceColor[1] + (targetColor[1] - sourceColor[1]) * t, // G
                sourceColor[2] + (targetColor[2] - sourceColor[2]) * t, // B
            ].map(c => c / 255); // Normalize to [0, 1]

            gradientColors.push(linearColor);
        }

        return gradientColors;
    }


    return (
        <group position={[bbox.x, bbox.y, bbox.z]}>
            {
                edgeData ? edgeData.map((edge, index) => {
                    const midpoint = edge.sourceLabel === edge.targetLabel ?
                        new Vector3().addVectors(edge.source, edge.target).multiplyScalar(0.5)
                        : calculateRadialOffset(edge.source, edge.target, 1, 20);


                    const orientation = calculateConeOrientation(edge.source, edge.target);

                    return (
                        <React.Fragment key={index}>
                            {edge.sourceLabel === edge.targetLabel ?
                                <>
                                    <Line
                                        key={`line-${index}`}
                                        points={[edge.source, edge.target]}
                                        color='white'
                                        lineWidth={edge.frequency}
                                        vertexColors={generateBasicGradientColor(edge.source, edge.target, [128, 0, 0], [255, 255, 204], 5)}
                                    />
                                    <Cone
                                        key={`cone-${index}`}
                                        position={[midpoint.x, midpoint.y, midpoint.z]}
                                        rotation={orientation}
                                        args={[0.5, 2, 32]}
                                        material-color="#333"
                                    />
                                </>
                                :
                                <>
                                    <QuadraticBezierLine
                                        key={`quadratic-${index}`}
                                        start={edge.source}
                                        end={edge.target}
                                        mid={[midpoint.curve.x, midpoint.curve.y, midpoint.curve.z]}
                                        color='white'
                                        lineWidth={edge.frequency}
                                        vertexColors={generateBasicGradientColor(edge.source, edge.target, [128, 0, 0], [255, 255, 204], 1)}
                                    />
                                    <Cone
                                        key={`cone-${index}`}
                                        position={[midpoint.cone.x, midpoint.cone.y, midpoint.cone.z]}
                                        rotation={orientation}
                                        args={[0.7, 2.5, 32]}
                                        material-color="#333"
                                    />
                                </>
                            }
                            {/* <Line
                                key={`line-${index}`}
                                points={[edge.source, edge.target]}
                                color='white'
                                lineWidth={edge.frequency}
                                vertexColors={generateBasicGradientColor(edge.source, edge.target, [128, 0, 0], [255, 255, 204], 5)}
                            />
                            <Cone
                                key={`cone-${index}`}
                                position={[midpoint.x, midpoint.y, midpoint.z]}
                                rotation={orientation}
                                args={[0.5, 2, 32]}
                                material-color="#333"
                            /> */}
                        </React.Fragment>
                    )
                }) : null
            }
        </group>
    )
}