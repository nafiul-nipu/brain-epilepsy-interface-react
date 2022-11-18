import { useRef, useEffect } from "react";
import { Col } from "react-bootstrap";
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
let renderer, scene, scene2, camera, controls, bboxCenter, objBbox;

export const BrainNetwork = ({ brain, electrodeData, sampleData }) => {

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
                color: 0Xffffff,
                opacity: 1,
                transparency: false,
                electrodeData: electrodeData
            });

            await loadElectrode(scene2, electrodeData, sampleData);

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
    console.log(bboxCenter)
    if (bboxCenter === undefined) {
        [bboxCenter, objBbox] = getbbox(obj)
    }

    obj = objMaterialManipulation(obj, color, opacity, transparency, bboxCenter);

    objBbox.setFromObject(obj);
    scene.add(obj);

    console.log("brain loaded");
    animate()
}

function loadElectrode(scene, electrodeData, sampleData) {
    // console.log(electrodeData)
    const points = populateElectrodes(electrodeData, bboxCenter);
    scene.add(points);

    const group = createBrainPropagation(sampleData, bboxCenter)
    scene.add(group);
}