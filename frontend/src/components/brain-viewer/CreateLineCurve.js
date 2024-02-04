import { useLayoutEffect, useRef } from "react"
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import * as d3 from 'd3'
import * as ss from 'simple-statistics'

import { BufferGeometry, BufferAttribute, InstancedBufferAttribute, MeshBasicMaterial, Matrix4, LineSegments, Vector3, MeshPhongMaterial } from 'three';

export const CreateLineCurve = ({
    electrodeData,
    networkData,
    topPercent,
    bbox,
    selectedRoi,
}) => {
    // console.log(item, index, selectedRoi)
    const linesRef = useRef();
    const linesSegmentRef = useRef();

    useLayoutEffect(() => {
        // console.log("create line is being called")
        // console.log(electrodeData)
        // console.log(networkData)
        const electrodeLabels = {};
        electrodeData.forEach(electrode => {
            electrodeLabels[electrode.electrode_number] = electrode.label;
        })
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

        const percentileVal = ss.quantileSorted(sortedValues, topPercent / 100);

        // console.log(percentileVal)

        const topEdges = sortedEdges.filter(edge => edge[1] >= percentileVal);

        // console.log(topEdges)
        let edges = 0;
        let positions = []
        if (selectedRoi == null) {
            for (const edge of topEdges) {
                const source = parseInt(edge[0].split('_')[0]);
                const target = parseInt(edge[0].split('_')[1]);

                edges += 1;

                const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                if (sourcePos !== undefined) positions.push(...sourcePos.position)

                const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)
                if (targetPos !== undefined) positions.push(...targetPos.position)
            }
        } else {
            for (const edge of topEdges) {
                const source = parseInt(edge[0].split('_')[0]);
                const target = parseInt(edge[0].split('_')[1]);

                if (selectedRoi === electrodeLabels[source] && selectedRoi === electrodeLabels[target]) {
                    edges += 1;
                    const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
                    if (sourcePos !== undefined) positions.push(...sourcePos.position)

                    const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)
                    if (targetPos !== undefined) positions.push(...targetPos.position)
                }
            }
        }

        const lineWidth = d3.scaleLinear()
            .domain([topEdges[topEdges.length - 1][1], topEdges[0][1]])
            .range([1, 5])

        const lines = linesRef.current;

        // const numLines = edges.length;
        const numLines = edges;

        // Create line geometry and attributes
        const geometry = new BufferGeometry();
        const positionAttribute = new BufferAttribute(new Float32Array(positions), 3);
        geometry.setAttribute('position', positionAttribute);

        // Create instance matrix attribute
        const numInstances = numLines;
        const instanceMatrix = new InstancedBufferAttribute(new Float32Array(numInstances * 16), 16);
        geometry.setAttribute('instanceMatrix', instanceMatrix);

        // Create instance matrix for each line segment
        const matrix = new Matrix4();
        for (let i = 0; i < numInstances; i++) {
            // translation of the matrix based on the start position of the line segment.
            matrix.makeTranslation(
                positions[i * 6],
                positions[i * 6 + 1],
                positions[i * 6 + 2]
            );
            //  calculating the rotation of the matrix based on the start and end positions of the line segment
            matrix.lookAt(
                new Vector3(positions[i * 6], positions[i * 6 + 1], positions[i * 6 + 2]), //start
                new Vector3(positions[i * 6 + 3], positions[i * 6 + 4], positions[i * 6 + 5]), //end
                new Vector3(0, 1, 0) //up
            );
            matrix.toArray(instanceMatrix.array, i * 16); // copy the matrix data to the array
        }

        // Update instance matrix attribute
        instanceMatrix.needsUpdate = true;

        // removing old line segments from the scene
        // TODO: different approach? 
        if (linesSegmentRef.current) {
            lines.remove(linesSegmentRef.current);
        }

        // Create line segments
        const material = new MeshBasicMaterial({
            color: 0xFF0000,

        });
        const linesSegments = new LineSegments(geometry, material);
        // linesSegments.frustumCulled = true;
        linesSegments.position.set(bbox.x, bbox.y, bbox.z);


        // Add line segments to the scene
        lines.add(linesSegments);
        linesSegmentRef.current = linesSegments;

        console.log("lines created")


    }, [electrodeData, networkData, topPercent, selectedRoi])
    return (
        <group ref={linesRef} />
    )
}