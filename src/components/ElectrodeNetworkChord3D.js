// component renders the brain, tumors, electrodes, electrode network

import { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import * as d3 from 'd3';
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
        let centerBrain = bboxCenter;
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
        let renderer = createRenderer(canvas)

        // scenes - two to map the electordes onto the brain and can be viewed from any angle
        let scene = createScene();
        let scene2 = createScene();

        // camera
        let camera = createCamera()
        scene.add(camera);

        // scene.add( new THREE.AxesHelper( 1000 ) )

        // controls
        let controls = createTrackballControls(camera, renderer)

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

            setOnWindowResize(renderer, camera, controls, [scene, scene2]);
        }

        // animation and mouse movement 
        function animate() {
            // console.log(mixer)
            requestAnimationFrame(animate)


            // trackball controls needs to be updated in the animation loop before it will work
            controls.update()

            render(renderer, [scene, scene2], camera)

        }

        // loading threeD objects
        function OBJLoaderThreeJS({
            scene,
            obj,
            color,
            opacity,
            transparency
        }) {
            console.log("loading the chord brain")
            // if (centerBrain === undefined) {
            //     // [bboxCenter, objBbox] = getbbox(obj)
            //     // get bboxcenter
            //     centerBrain = getbbox(obj)
            // }
            console.log("chord", centerBrain)

            // material manipulation
            obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);

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


