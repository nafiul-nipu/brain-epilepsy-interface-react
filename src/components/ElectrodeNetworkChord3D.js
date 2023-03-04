// component renders the brain, tumors, electrodes, electrode network

import { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import {
    createRenderer,
    createScene,
    createCamera,
    createTrackballControls,
    setOnWindowResize,
    render,
    getbbox,
    objMaterialManipulation,
    MultipleChordContainer
} from '../library/CommonUtilities'

// import dataRegistry from '../data/dataRegistry.json'

let width = (window.innerWidth / 3) - 10;
let height = window.innerHeight / 2 - 10;
let angle = 40;
let aspect = width / height;
let near = 1;
let far = 2000;

let canvas = null;
// let renderer, scene, scene2, camera, controls, centerBrain, centerOther;

export const ElectrodeNetworkChord3D = ({
    brain,
    electrodeData,
    sampleData,
    bboxCenter,
    sliderObj,
    timeRange,
    // lesions,
    eventData
}) => {
    // creating canvas reference
    const canvasRef = useRef(null);
    canvas = canvasRef.current;


    useEffect(() => {
        // clearInterval(inter)
        let inter;
        // brain center - for brain and lesions will calculate later
        // for others take the center from parent
        let centerBrain;
        // let centerOther = bboxCenter;
        // console.log(canvasRef.current);
        console.log("working brain with network")

        // size scale for brain network
        // let sizeScale = d3.scaleLinear()
        //     .domain([0, dataRegistry.maxSize]) //this is now customly added
        //     .range([6, 10])

        // getting the canvas reference
        canvas = canvasRef.current

        // creating renderer
        let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0Xfafbfc, 1);
        renderer.autoClear = false;
        renderer.outputEncoding = THREE.sRGBEncoding;

        // scenes - two to map the electordes onto the brain and can be viewed from any angle
        let scene = new THREE.Scene();
        let scene2 = new THREE.Scene();

        // camera
        let camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
        camera.position.set(-250, -50, -50);
        camera.up.set(0, 0, 1);

        scene.add(camera);

        // scene.add( new THREE.AxesHelper( 1000 ) )

        // controls
        let controls = new TrackballControls(camera, renderer.domElement);
        // controls.addEventListener( 'change', render );

        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        // const axesHelper = new THREE.AxesHelper( 100 );
        // scene2.add( axesHelper );

        // ambient
        scene.add(new THREE.AmbientLight(0xffffff, .2));

        // light
        const light = new THREE.PointLight(0xffffff, .2);
        camera.add(light);


        // console.log(electrodeData)
        async function loadBrain() {
            // load brain
            await OBJLoaderThreeJS({
                scene: scene,
                obj: brain,
                color: 0X111111,
                opacity: 0.5,
                transparency: true
            });

            // for (let lesion of lesions) {
            //     // console.log(lesion);
            //     //load lesion
            //     await OBJLoaderThreeJS({
            //         scene: scene,
            //         obj: lesion,
            //         color: 0Xf7680f,
            //         opacity: 1,
            //         transparency: false,
            //         center: false
            //     });

            // }

            // load electrode and electrode network
            await loadElectrode([scene, scene2], electrodeData, sampleData);
        }

        // console.log(brain)
        if (brain && electrodeData) {
            // if data is found load everything
            loadBrain()

        }
        // console.log(mixer)
        // window resize handler
        window.addEventListener('resize', onWindowResize);


        function onWindowResize() {

            renderer.setSize((window.innerWidth / 2) - 10, window.innerHeight / 2);

            camera.aspect = ((window.innerWidth / 2) - 10) / (window.innerHeight / 2);
            camera.updateProjectionMatrix();

            controls.handleResize();

            render();
        }

        // animation and mouse movement 
        function animate() {
            // console.log(mixer)
            requestAnimationFrame(animate)


            // trackball controls needs to be updated in the animation loop before it will work
            controls.update()


            render()


        }

        function render() {
            renderer.clear();
            renderer.render(scene, camera);
            renderer.clearDepth();
            renderer.render(scene2, camera);
        }

        // loading threeD objects
        function OBJLoaderThreeJS({
            scene,
            obj,
            color,
            opacity,
            transparency
        }) {


            // material manipulation
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

            // objBbox.setFromObject(obj);
            scene.add(obj);

            console.log("brain loaded");
            animate()
        }

        // load electrode
        function loadElectrode(scene, electrodeData, sampleData) {
            console.log("load electrode")

            // svgload

            console.log("loading svg")

            let svgDataController = {
                currentURL: ReactDOMServer.renderToString(<MultipleChordContainer />), //convert the react element to SVG
                drawFillShapes: true,
                drawStrokes: true,
                fillShapesWireframe: false,
                strokesWireframe: false

            }

            const addSVG = new SVGLoader()
            const svgData = addSVG.parse(svgDataController.currentURL)

            // console.log(svgData)
            const paths = svgData.paths;

            const group = new THREE.Group();
            group.scale.multiplyScalar(0.25);
            group.position.x = -40;
            group.position.y = 90;
            group.position.z = 70
            group.scale.y *= - 1
            group.rotation.y = 20

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];

                const fillColor = path.userData.style.fill;
                if (
                    svgDataController.drawFillShapes &&
                    fillColor !== undefined &&
                    fillColor !== "none"
                ) {
                    const material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color()
                            .setStyle(fillColor)
                            .convertSRGBToLinear(),
                        opacity: path.userData.style.fillOpacity,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: svgDataController.fillShapesWireframe,
                    });

                    const shapes = SVGLoader.createShapes(path);

                    for (let j = 0; j < shapes.length; j++) {
                        const shape = shapes[j];

                        const geometry = new THREE.ShapeGeometry(shape);
                        const mesh = new THREE.Mesh(geometry, material);

                        group.add(mesh);
                    }
                }

                const strokeColor = path.userData.style.stroke;

                if (
                    svgDataController.drawStrokes &&
                    strokeColor !== undefined &&
                    strokeColor !== "none"
                ) {
                    const material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color()
                            .setStyle(strokeColor)
                            .convertSRGBToLinear(),
                        opacity: path.userData.style.strokeOpacity,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: svgDataController.strokesWireframe,
                    });

                    for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
                        const subPath = path.subPaths[j];

                        const geometry = SVGLoader.pointsToStroke(
                            subPath.getPoints(),
                            path.userData.style
                        );

                        if (geometry) {
                            const mesh = new THREE.Mesh(geometry, material);

                            group.add(mesh);
                        }
                    }
                }
            }

            const box = new THREE.Box3().setFromObject(group);
            const boxSize = new THREE.Vector3();
            box.getSize(boxSize);

            const yOffset = boxSize.y / -2;
            const xOffset = boxSize.x / -2;

            // Offset all of group's elements, to center them
            group.children.forEach(item => {
                item.position.x = xOffset;
                item.position.y = yOffset;
            });

            scene[1].add(group)

            // render(renderer, [scene[0], scene[1]], camera)


            // console.log(points)
            // change the colours, one a second
            // inter = setInterval(function () {


            // }, 2500);

        }

        return () => {
            console.log('cleaning')
            clearInterval(inter)
        }


    }, [brain, canvasRef, electrodeData, eventData, sampleData, sliderObj, timeRange]);

    return (
        <Col md='12'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


