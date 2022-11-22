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
let HEIGTH;
export const ElectrodeNetworkTumor = ({
    brain,
    lesion1,
    lesion2,
    lesion3,
    electrodeData,
    sampleData,
    bboxCenter
}) => {
    const canvasRef = useRef(null);
    canvas = canvasRef.current;

    useEffect(() => {
        let centerBrain;
        let centerOther = bboxCenter;
        // console.log(canvasRef.current);
        console.log("working brain with network")
        canvas = canvasRef.current

        HEIGTH = canvasRef.current.parentElement.offsetHeight;
        let renderer = createRenderer(canvas)

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
                color: 0Xf4a582,
                opacity: 1,
                transparency: false,
                center: false
            });

            //load lesion2
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion2,
                color: 0Xf4a582,
                opacity: 1,
                transparency: false,
                center: false
            });

            //load lesion3
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion3,
                color: 0Xf4a582,
                opacity: 1,
                transparency: false,
                center: false
            });

            await loadElectrode(scene2, electrodeData, sampleData);
        }

        // console.log(brain)
        if (brain && electrodeData && bboxCenter) {
            loadBrain()

        }


        // OBJMTLLoaders(scene, test, testmtl)


        window.addEventListener('resize', onWindowResize);

        function onWindowResize() {

            setOnWindowResize(renderer, camera, controls, [scene, scene2]);
        }
        
        function animate() {
            requestAnimationFrame(animate)
        
            // trackball controls needs to be updated in the animation loop before it will work
            controls.update()
        
            render(renderer, [scene, scene2], camera)
        
        }
        
        function OBJLoaderThreeJS({
            scene,
            obj,
            color,
            opacity,
            transparency
        }) {
            if (centerBrain === undefined) {
                // [bboxCenter, objBbox] = getbbox(obj)
                centerBrain = getbbox(obj)
            }
        
            obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);
        
            // objBbox.setFromObject(obj);
            scene.add(obj);
        
            console.log("brain loaded");
            animate()
        }
        
        function loadElectrode(scene, electrodeData, sampleData) {
            // console.log(electrodeData)
        
            const points = populateElectrodes(electrodeData, centerOther);
            scene.add(points);
        
            const group = createBrainPropagation(sampleData, centerOther, 11)
            scene.add(group);
        }


    }, [bboxCenter, brain, canvasRef, electrodeData, lesion1, lesion2, lesion3, sampleData]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


// function onWindowResize() {

//     setOnWindowResize(renderer, camera, controls, [scene, scene2]);
// }

// function animate() {
//     requestAnimationFrame(animate)

//     // trackball controls needs to be updated in the animation loop before it will work
//     controls.update()

//     render(renderer, [scene, scene2], camera)

// }

// function OBJLoaderThreeJS({
//     scene,
//     obj,
//     color,
//     opacity,
//     transparency
// }) {
//     if (centerBrain === undefined) {
//         // [bboxCenter, objBbox] = getbbox(obj)
//         centerBrain = getbbox(obj)
//     }

//     obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);

//     // objBbox.setFromObject(obj);
//     scene.add(obj);

//     console.log("brain loaded");
//     animate()
// }

// function loadElectrode(scene, electrodeData, sampleData) {
//     // console.log(electrodeData)

//     const points = populateElectrodes(electrodeData, centerOther);
//     scene.add(points);

//     const group = createBrainPropagation(sampleData, centerOther, 11)
//     scene.add(group);
// }