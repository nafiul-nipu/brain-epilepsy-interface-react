// module that has common functions

import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import circle from '../models/disc.png'

let width = (window.innerWidth / 3) - 10;
let height = window.innerHeight / 2 - 10;
let angle = 40;
let aspect = width / height;
let near = 1;
let far = 2000;

// creating renderer
export function createRenderer(canvas, autoClear = false) {
    let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0Xfafbfc, 1);
    renderer.autoClear = autoClear;

    renderer.outputEncoding = THREE.sRGBEncoding;

    return renderer
}

// creating scene
export function createScene() {
    return new THREE.Scene();
}

// creating camera
export function createCamera() {
    let camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
    camera.position.set(-250, -50, -50);
    camera.up.set(0, 0, 1);

    return camera;
}

// create controls
export function createTrackballControls(camera, renderer) {
    let controls = new TrackballControls(camera, renderer.domElement);
    // controls.addEventListener( 'change', render );

    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    return controls;
}

// window resize handler
export function setOnWindowResize(renderer, camera, controls, scenes) {

    renderer.setSize((window.innerWidth / 2) - 10, window.innerHeight / 2);

    camera.aspect = ((window.innerWidth / 2) - 10) / (window.innerHeight / 2);
    camera.updateProjectionMatrix();

    controls.handleResize();

    render(renderer, scenes, camera);

}

// render function
export function render(renderer, scenes, camera) {

    // renderer.render(scene, camera);

    if (scenes.length === 2) {
        renderer.clear();
        renderer.render(scenes[0], camera);
        renderer.clearDepth();
        renderer.render(scenes[1], camera);

    } else {
        renderer.render(scenes[0], camera);
    }

}

// return bboxcenter
export function getbbox(obj) {
    console.log("changing box center");
    let objBbox = new THREE.Box3().setFromObject(obj);
    let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
    bboxCenter.multiplyScalar(-1);

    // return [bboxCenter, objBbox];
    // console.log(bboxCenter)
    return bboxCenter;
}

// change material's trancparency, color etc
export function objMaterialManipulation(obj, color, opacity, transparency, bboxCenter) {
    // console.log(obj)
    obj.children.forEach((child) => {

        if (child instanceof THREE.Mesh) {
            child.material.color.setHex(color);
            child.material.opacity = opacity;
            child.material.transparent = transparency;
            // child.material.vertexColors = true;
            // child.geometry.center();
            // child.material.side = THREE.DoubleSide;

            child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
        }
    });

    return obj
}

// create electrodes using point material and sprite
export function populateElectrodes(electrodeData, bboxCenter, sampleData = null, propagation) {
    // console.log(sampleData)
    // console.log(electrodeData)
    let vertices = []
    let colors = []
    const color = new THREE.Color();
    let pointGeometry = new THREE.BufferGeometry();
    // 55,126,184
    if (propagation[0] === 'TopPercentile') {
        // do nothing
        let sortedData = structuredClone(sampleData) //
        sortedData.sort((a, b) => b.frequency - a.frequency);
        let percent = +propagation[1] / 100;

        console.log(Math.round(sortedData.length * percent))
        let startElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.start))]

        let endElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.end))]
        // console.log(sortedData)
        for (let top = 0; top < electrodeData.length; top++) {
            // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
            // console.log(top)
            vertices.push(electrodeData[top].position[0], electrodeData[top].position[1], electrodeData[top].position[2])
            if (startElec.includes(electrodeData[top].electrode_number) && endElec.includes(electrodeData[top].electrode_number)) {
                // both start and end 
                // console.log('both')
                color.setRGB(255 / 255, 255 / 255, 51 / 255);
                colors.push(color.r, color.g, color.b);
            }
            else if (startElec.includes(electrodeData[top].electrode_number)) {
                // start electrodes
                // console.log("start")
                color.setRGB(217 / 255, 95 / 255, 2 / 255);
                // console.log(color.r, color.g, color.b)
                colors.push(color.r, color.g, color.b);
            } else if (endElec.includes(electrodeData[top].electrode_number)) {
                //  end electrodes
                // console.log('ends')
                color.setRGB(27 / 255, 158 / 255, 119 / 255);
                colors.push(color.r, color.g, color.b);
            } else {
                // rest electrodes
                color.setRGB(160 / 255, 160 / 255, 160 / 255);
                colors.push(color.r, color.g, color.b);
            }
        }

        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    } else {
        var result = sampleData.filter(obj => {
            return obj.start === +propagation[1];
        });
        // console.log(result)
        let electrodeList = [...new Set(result.map((item) => item.end))]
        // console.log(electrodeList)
        for (let i = 0; i < electrodeData.length; i++) {
            // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
            vertices.push(electrodeData[i].position[0], electrodeData[i].position[1], electrodeData[i].position[2]);
            if (electrodeData[i].electrode_number === +propagation[1]) {
                // console.log("start")
                color.setRGB(217 / 255, 95 / 255, 2 / 255);
                // console.log(color.r, color.g, color.b)
                colors.push(color.r, color.g, color.b);
            } else if (electrodeList.includes(electrodeData[i].electrode_number)) {
                // console.log('ends')
                color.setRGB(27 / 255, 158 / 255, 119 / 255);
                colors.push(color.r, color.g, color.b);
            } else {
                color.setRGB(215 / 255, 25 / 255, 28 / 255);
                colors.push(color.r, color.g, color.b);
            }
        }

        // let pointGeometry = new THREE.BufferGeometry()
        // pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    }


    const sprite = new THREE.TextureLoader().load(circle);
    const material = new THREE.PointsMaterial({
        size: 10,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        vertexColors: true
    });
    // material.color.setHSL(0.0, 1.0, 0.5);
    const points = new THREE.Points(pointGeometry, material);
    points.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);

    return points
}

// creating brain network using axedhelper
export function createBrainPropagation(sampleData, bboxCenter, propagation) {
    // console.log(sampleData)
    // console.log(propagation)
    const group = new THREE.Group();
    if (propagation[0] === 'TopPercentile') { //top 10%
        // reverse sort - large to small
        let sortedData = structuredClone(sampleData) //
        sortedData.sort((a, b) => b.frequency - a.frequency);
        // console.log(sortedData)
        // plotting top %
        let percent = +propagation[1] / 100;
        // console.log(sortedData.length * percent)
        for (let top = 0; top < Math.round(sortedData.length * percent); top++) {
            let vertices = []
            vertices.push(new THREE.Vector3(sortedData[top].startPosition[0], sortedData[top].startPosition[1], sortedData[top].startPosition[2])); //x, y, z
            vertices.push(new THREE.Vector3(sortedData[top].endPosition[0], sortedData[top].endPosition[1], sortedData[top].endPosition[2]));

            const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

            let material = new THREE.LineBasicMaterial({ color: 0X004D40 });
            let line = new THREE.Line(geometry, material);
            group.add(line);

        }

    } else { // electrode wise
        sampleData.forEach(sample => {
            if (sample.start === +propagation[1]) {
                let vertices = []
                vertices.push(new THREE.Vector3(sample.startPosition[0], sample.startPosition[1], sample.startPosition[2])); //x, y, z
                vertices.push(new THREE.Vector3(sample.endPosition[0], sample.endPosition[1], sample.endPosition[2]));

                const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

                let material = new THREE.LineBasicMaterial({ color: 0X004D40 });
                let line = new THREE.Line(geometry, material);
                group.add(line);

            }
        })

    }

    // console.log(group)
    group.position.set(bboxCenter.x, bboxCenter.y, bboxCenter.z);

    return group;
}