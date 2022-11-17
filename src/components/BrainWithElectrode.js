import { useRef, useEffect } from "react";
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import circle from '../models/disc.png'


let canvas = null;
let renderer, scene, scene2, camera, controls, bboxCenter, objBbox;
export const BrainWithElectrode = ({
    brain,
    electrodeData
}) => {
    const canvasRef = useRef(null);
    canvas = canvasRef.current;

    useEffect(() => {
        // console.log(canvasRef.current);
        console.log("working brain with electrode")
        canvas = canvasRef.current

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize((window.innerWidth / 2) - 10, window.innerHeight / 2);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0X000000, 1);
        renderer.autoClear = false;

        renderer.outputEncoding = THREE.sRGBEncoding;

        scene = new THREE.Scene();
        scene2 = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(40, ((window.innerWidth / 2) - 10) / (window.innerHeight / 2), 1, 2000);
        camera.position.set(-250, -50, -50);
        camera.up.set(0,0,1);
        scene.add(camera);


        // scene.add( new THREE.AxesHelper( 1000 ) )

        // controls
        controls = new TrackballControls(camera, renderer.domElement);
        // controls.addEventListener( 'change', render );

        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        // controls.target.set(0, 0, 0)

        // ambient
        scene.add(new THREE.AmbientLight(0xffffff, .2));

        // light
        const light = new THREE.PointLight(0xffffff, .2);
        camera.add(light);


        // console.log(electrodeData)
        async function loadBrain() {
            await OBJLoaderThreeJS(scene, brain, 0Xffffff, 1, false, animate, electrodeData);

            await loadElectrode(scene2, electrodeData);

        }

        // console.log(brain)
        if (brain && electrodeData) {
            loadBrain()

        }


        // OBJMTLLoaders(scene, test, testmtl)


        window.addEventListener('resize', onWindowResize);

    }, [brain, canvasRef, electrodeData]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}

function onWindowResize() {

    renderer.setSize((window.innerWidth / 2) - 10, window.innerHeight / 2);

    camera.aspect = ((window.innerWidth / 2) - 10) / (window.innerHeight / 2);
    camera.updateProjectionMatrix();

    controls.handleResize();

    render();

}

function render() {

    // renderer.render(scene, camera);


    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2, camera);

}

function animate() {
    requestAnimationFrame(animate)

    // trackball controls needs to be updated in the animation loop before it will work
    controls.update()

    render()

}

function OBJLoaderThreeJS(
    scene,
    obj,
    color,
    opacity,
    transparency,
    animate,
    electrodeData
) {
    console.log(bboxCenter)
    if (bboxCenter === undefined) {
        console.log("changing box center");
        objBbox = new THREE.Box3().setFromObject(obj);
        bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
        bboxCenter.multiplyScalar(-1);
    }

    obj.children.forEach((child) => {

        if (child instanceof THREE.Mesh) {
            child.material.color.setHex(color);
            child.material.opacity = opacity;
            // child.material.transparent = transparency;
            // child.material.vertexColors = true;
            // child.geometry.center();

            // child.material.side = THREE.DoubleSide;

            child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
        }

        objBbox.setFromObject(obj);
        // obj.position.set(0, 0, 0)
        scene.add(obj);
    });

    console.log("brain loaded");
    animate()
}

function loadElectrode(scene, electrodeData) {
    // console.log(electrodeData)
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

    // console.log(bboxCenter)
    points.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
    // console.log(points.geometry)

    scene.add(points);
}