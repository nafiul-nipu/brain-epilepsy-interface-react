// component renders the brain, tumors, electrodes, electrode network

import { useRef, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import {
    createRenderer,
    createScene,
    createCamera,
    createTrackballControls,
    setOnWindowResize,
    render,
    getbbox,
    objMaterialManipulation,
    populateElectrodes,
    createBrainPropagation
} from '../library/CommonUtilities'

let canvas = null;
// let renderer, scene, scene2, camera, controls, centerBrain, centerOther;
export const ElectrodeNetworkTumor = ({
    brain,
    lesion1,
    lesion2,
    lesion3,
    electrodeData,
    sampleData,
    bboxCenter,
    electrodeNetworkValue
}) => {
    // creating canvas reference
    const canvasRef = useRef(null);
    canvas = canvasRef.current;

    useEffect(() => {
        // brain center - for brain and lesions will calculate later
        // for others take the center from parent
        let centerBrain;
        let centerOther = bboxCenter;
        // console.log(canvasRef.current);
        console.log("working brain with network")

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

            //load lesion1
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion1,
                color: 0Xf7680f,
                opacity: 1,
                transparency: false,
                center: false
            });

            //load lesion2
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion2,
                color: 0Xf7680f,
                opacity: 1,
                transparency: false,
                center: false
            });

            //load lesion3
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion3,
                color: 0Xf7680f,
                opacity: 1,
                transparency: false,
                center: false
            });

            // load electrode and electrode network
            await loadElectrode([scene, scene2], electrodeData, sampleData);
        }

        // console.log(brain)
        if (brain && electrodeData && bboxCenter) {
            // if data is found load everything
            loadBrain()

        }

        // window resize handler
        window.addEventListener('resize', onWindowResize);


        function onWindowResize() {

            setOnWindowResize(renderer, camera, controls, [scene, scene2]);
        }

        // animation and mouse movement 
        function animate() {
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
            if (centerBrain === undefined) {
                // [bboxCenter, objBbox] = getbbox(obj)
                // get bboxcenter
                centerBrain = getbbox(obj)
            }

            // material manipulation
            obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);

            // objBbox.setFromObject(obj);
            scene.add(obj);

            console.log("brain loaded");
            animate()
        }

        // load electrode
        function loadElectrode(scene, electrodeData, sampleData) {
            // console.log("CenterOther", centerOther)

            // create network
            // const group = createBrainPropagation(sampleData, centerOther, electrodeNetworkValue);
            // scene[0].add(group);

            // create points
            // const points = populateElectrodes(electrodeData, centerOther, sampleData, electrodeNetworkValue);
            // scene[1].add(points);
        }


    }, [bboxCenter, brain, canvasRef, electrodeData, lesion1, lesion2, lesion3, sampleData, electrodeNetworkValue]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


