import { useRef } from "react"
import { Col } from "react-bootstrap"
import {
    subtractVectors, scaleVector, addVectors,
    perspective, length, lookAt, inverse, yRotation,
    xRotation, multiply, translate, normalize
} from '../library/m4'
import { vertexshader, fragmetnshader } from '../library/shader-srcs'
import {
    createBufferInfoFromArrays, createProgramInfo,
    resizeCanvasToDisplaySize, setUniforms,
    setBuffersAndAttributes, drawBufferInfo
} from '../library/webgl-utils-fundamental'


let gl = null;
let canvas = null;
let zFar = null;
let zNear = null;
let cameraPosition = null;
let cameraTarget = null;
let meshProgramInfo = null;
let objOffset = null;
let parts = null;

let range = null;

let angle = {
    x: 0,
    y: 0,
}

let mouse = {
    lastX: -1,
    lastY: -1,
}

let currzoom = 1;

let dragging = false



export const BrainRendering = ({
    brainMesh,
    electrodeData
}) => {
    const canvasRef = useRef(null)
    canvas = canvasRef.current;

    // console.log(brainMesh)
    // console.log(canvas)

    if (brainMesh) {
        console.log("inside brainmesh condition")
        console.log(brainMesh.geometries[0].data.color)
        canvas.width = 700;
        canvas.height = 700;
        gl = canvas.getContext("webgl2");

        if (!gl) {
            alert("Unable to initialize WebGL2. Your browser may not support it");
            return;
        }

        canvas.addEventListener('mousemove', mousemove);
        canvas.addEventListener('mousedown', mousedown);
        canvas.addEventListener('mouseup', mouseup);
        canvas.addEventListener('wheel', wheel);

        parts = brainMesh.geometries.map(({ data }) => {
            // console.log(data)
            // Because data is just named arrays like this
            //
            // {
            //   position: [...],
            //   texcoord: [...],
            //   normal: [...],
            // }
            //
            // create a buffer for each array by calling
            // gl.createBuffer, gl.bindBuffer, gl.bufferData
            const bufferInfo = createBufferInfoFromArrays(gl, data);
            return {
                material: {
                    u_diffuse: [1, 1, 1, 1],
                },
                bufferInfo,
            };
        });

        // console.log(parts)

        // compiles and links the shaders, looks up attribute and uniform locations
        meshProgramInfo = createProgramInfo(gl, [vertexshader, fragmetnshader]);

        const extents = getGeometriesExtents(brainMesh.geometries);
        range = subtractVectors(extents.max, extents.min);
        // amount to move the object so its center is at the origin
        objOffset = scaleVector(
            addVectors(
                extents.min,
                scaleVector(range, 0.5)),
            -1);
        cameraTarget = [0, 0, 0];
        // figure out how far away to move the camera so we can likely
        // see the object.
        // const radius = length(range) * 1.5;
        // cameraPosition = addVectors(cameraTarget, [
        //     0,
        //     0,
        //     radius,
        // ]);
        // // Set zNear and zFar to something hopefully appropriate
        // // for the size of this object.
        // zNear = radius / 100;
        // zFar = radius * 3;

        requestAnimationFrame(render);

    }


    return (
        <Col md='6'>
            <canvas ref={canvasRef}></canvas>
        </Col>
    )
}


function render(time) {
    // console.log("rendering")
    time *= 0.001;  // convert to seconds

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.370, 0.370, 0.370, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = perspective(fieldOfViewRadians, aspect, zNear, zFar);

    const up = [0, 1, 0];

    let radius = length(range) * currzoom * 0.75
    cameraPosition = addVectors(cameraTarget, [
        0,
        0,
        radius,
    ]);
    // Set zNear and zFar to something hopefully appropriate
    // for the size of this object.
    zNear = radius / 100;
    zFar = radius * 3;
    // Compute the camera's matrix using look at.
    const camera = lookAt(cameraPosition, cameraTarget, up);

    // // Make a view matrix from the camera matrix.
    const view = inverse(camera);

    const sharedUniforms = {
        u_lightDirection: normalize([-1, 3, 5]),
        u_view: view,
        u_projection: projection,
    };

    gl.useProgram(meshProgramInfo.program);

    // calls gl.uniform
    setUniforms(meshProgramInfo, sharedUniforms);

    // compute the world matrix once since all parts
    // are at the same space.
    let u_world = yRotation(angle.y);
    // console.log(u_world)
    let xRot = xRotation(angle.x)

    u_world = multiply(u_world, xRot)
    u_world = translate(u_world, ...objOffset);

    for (const { bufferInfo, material } of parts) {
        // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
        setBuffersAndAttributes(gl, meshProgramInfo, bufferInfo);
        // calls gl.uniform
        setUniforms(meshProgramInfo, {
            u_world,
            u_diffuse: material.u_diffuse,
        });
        // calls gl.drawArrays or gl.drawElements
        drawBufferInfo(gl, bufferInfo);
    }

    requestAnimationFrame(render);
}

function getExtents(positions) {
    const min = positions.slice(0, 3);
    const max = positions.slice(0, 3);
    for (let i = 3; i < positions.length; i += 3) {
        for (let j = 0; j < 3; ++j) {
            const v = positions[i + j];
            min[j] = Math.min(v, min[j]);
            max[j] = Math.max(v, max[j]);
        }
    }
    return { min, max };
}

function getGeometriesExtents(geometries) {
    return geometries.reduce(({ min, max }, { data }) => {
        const minMax = getExtents(data.position);
        return {
            min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
            max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
        };
    }, {
        min: Array(3).fill(Number.POSITIVE_INFINITY),
        max: Array(3).fill(Number.NEGATIVE_INFINITY),
    });
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}




function mousedown(event) {
    // console.log('here')
    let x = event.clientX;
    let y = event.clientY;
    let rect = event.target.getBoundingClientRect();
    // If we're within the rectangle, mouse is down within canvas.
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        mouse.lastX = x;
        mouse.lastY = y;
        dragging = true;
    }
}

function mouseup(event) {
    dragging = false;
}

function mousemove(event) {
    // console.log('mouse moving')
    let x = event.clientX;
    let y = event.clientY;
    if (dragging) {
        // The rotation speed factor
        // dx and dy here are how for in the x or y direction the mouse moved
        let factor = 10 / gl.canvas.height;
        let dx = factor * (x - mouse.lastX);
        let dy = factor * (y - mouse.lastY);

        // update the latest angle
        angle.x = angle.x + dy;
        angle.y = angle.y + dx;
    }
    // update the last mouse position
    mouse.lastX = x;
    mouse.lastY = y;
}

function wheel(event) {
    currzoom += event.deltaY * 0.02;
    currzoom = Math.min(Math.max(1, currzoom), 500);
}