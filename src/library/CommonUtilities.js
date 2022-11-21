import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import circle from '../models/disc.png'

let width = (window.innerWidth / 2) - 10;
let height = window.innerHeight / 2;
let angle = 40;
let aspect = width / height;
let near = 1;
let far = 2000;

export function createRenderer(canvas, autoClear = false) {
    let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0X000000, 1);
    renderer.autoClear = autoClear;

    renderer.outputEncoding = THREE.sRGBEncoding;

    return renderer
}

export function createScene() {
    return new THREE.Scene();
}

export function createCamera() {
    let camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
    camera.position.set(-250, -50, -50);
    camera.up.set(0, 0, 1);

    return camera;
}

export function createTrackballControls(camera, renderer) {
    let controls = new TrackballControls(camera, renderer.domElement);
    // controls.addEventListener( 'change', render );

    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    return controls;
}

export function setOnWindowResize(renderer, camera, controls, scenes) {

    renderer.setSize((window.innerWidth / 2) - 10, window.innerHeight / 2);

    camera.aspect = ((window.innerWidth / 2) - 10) / (window.innerHeight / 2);
    camera.updateProjectionMatrix();

    controls.handleResize();

    render(renderer, scenes, camera);

}

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

export function getbbox(obj) {
    console.log("changing box center");
    let objBbox = new THREE.Box3().setFromObject(obj);
    let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
    bboxCenter.multiplyScalar(-1);

    // return [bboxCenter, objBbox];
    // console.log(bboxCenter)
    return bboxCenter;
}

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

export function populateElectrodes(electrodeData, bboxCenter, sampleData = null) {
    let vertices = []
    for (let i = 0; i < electrodeData.length; i++) {
        // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
        vertices.push(electrodeData[i].position[0], electrodeData[i].position[1], electrodeData[i].position[2])
    }
    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const sprite = new THREE.TextureLoader().load(circle);
    const material = new THREE.PointsMaterial({
        size: 10,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    material.color.setHSL(0.0, 1.0, 0.5);
    const points = new THREE.Points(pointGeometry, material);
    points.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);

    return points
}

export function createBrainPropagation(sampleData, bboxCenter, propagation) {
    console.log(sampleData)
    const group = new THREE.Group();
    if (propagation === 'top') { //top 10%
        // reverse sort - large to small
        sampleData.sort((a, b) => b.frequency - a.frequency);
        // console.log(sampleData[0])
        // plotting top 10%
        for (let top = 0; top < Math.round(sampleData.length * 0.1); top++) {
            var from = new THREE.Vector3(sampleData[top].startPosition[0], sampleData[top].startPosition[1], sampleData[top].startPosition[2]);
            var to = new THREE.Vector3(sampleData[top].endPosition[0], sampleData[top].endPosition[1], sampleData[top].endPosition[2]);
            var direction = to.clone().sub(from);
            var length = direction.length();
            var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0X004D40);
            group.add(arrowHelper)
        }

    } else { // electrode wise
        sampleData.forEach(sample => {
            if (sample.start === propagation) {
                var from = new THREE.Vector3(sample.startPosition[0], sample.startPosition[1], sample.startPosition[2]);
                var to = new THREE.Vector3(sample.endPosition[0], sample.endPosition[1], sample.endPosition[2]);
                var direction = to.clone().sub(from);
                var length = direction.length();
                var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0X004D40);
                group.add(arrowHelper)

            }
        })

    }

    // console.log(group)
    group.position.set(bboxCenter.x, bboxCenter.y, bboxCenter.z);

    return group;
}