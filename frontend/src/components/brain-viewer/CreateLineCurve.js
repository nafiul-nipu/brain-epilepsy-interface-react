import { useLayoutEffect, useRef } from "react"
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import * as d3 from 'd3'

import { BufferGeometry, BufferAttribute, InstancedBufferAttribute, MeshBasicMaterial, Matrix4, LineSegments, Vector3, MeshPhongMaterial } from 'three';

export const CreateLineCurve = ({
    electrodeData,
    networkData,
    topPercent,
    bbox
}) => {
    // console.log(electrodeData)
    console.log(networkData)
    // console.log(topPercent)
    const linesRef = useRef();
    const linesSegmentRef = useRef();

    useLayoutEffect(() => {
        const edgeCounter = {}
        let edges = 0
        for (const connection of networkData) {
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

        console.log(topEdges)
        let positions = []
        for (const edge of topEdges) {
            const source = parseInt(edge[0].split('_')[0]);
            const target = parseInt(edge[0].split('_')[1]);

            // console.log(electrodeData)
            // console.log(source, target)

            const sourcePos = electrodeData.find(electrode => electrode.electrode_number === source)
            // console.log(sourcePos)
            positions.push(...sourcePos.position)

            const targetPos = electrodeData.find(electrode => electrode.electrode_number === target)
            // console.log(targetPos)
            positions.push(...targetPos.position)
        }

        const lineWidth = d3.scaleLinear()
            .domain([topEdges[topEdges.length - 1][1], topEdges[0][1]])
            .range([1, 5])

        const lines = linesRef.current;

        const numLines = edges.length;

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


    }, [electrodeData, networkData, topPercent])
    return (
        <group ref={linesRef} />
    )
}