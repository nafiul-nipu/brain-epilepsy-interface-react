import { useRef, useEffect, useMemo } from "react";
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
    populateElectrodes
} from '../library/CommonUtilities'


let canvas = null;
let renderer, scene, scene2, camera, controls, centerBrain, centerOther;

export const BrainWithElectrode = ({
    brain,
    electrodeData,
    bboxCenter
}) => {
    centerOther = bboxCenter;
    const canvasRef = useRef(null);
    canvas = canvasRef.current;

    useEffect(() => {
        // console.log(canvasRef.current);
        console.log("working brain with electrode")
        canvas = canvasRef.current

        renderer = createRenderer(canvas)

        scene = createScene();
        scene2 = createScene();

        // camera
        camera = createCamera()
        scene.add(camera);

        // scene.add( new THREE.AxesHelper( 1000 ) )
        // controls
        controls = createTrackballControls(camera, renderer)


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
                color: 0Xffffff,
                opacity: 1,
                transparency: false,
                electrodeData: electrodeData
            });

            await loadElectrode(scene2, electrodeData);

        }

        // console.log(brain)
        if (brain && electrodeData && bboxCenter) {
            loadBrain();

        }

        window.addEventListener('resize', onWindowResize);

    }, [bboxCenter, brain, canvasRef, electrodeData]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}

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
    transparency,
    electrodeData
}) {
    if (centerBrain === undefined) {
        centerBrain = getbbox(obj)
    }
    console.log(centerBrain);

    obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);

    // objBbox.setFromObject(obj);
    scene.add(obj);

    console.log("brain loaded");
    animate()
}

function loadElectrode(scene, electrodeData) {
    // console.log(electrodeData)
    const points = populateElectrodes(electrodeData, centerOther);
    // console.log(bboxCenter)


    scene.add(points);
}