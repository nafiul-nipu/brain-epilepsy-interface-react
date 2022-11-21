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
let renderer, scene, scene2, camera, controls, centerBrain, centerOther;
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
        // console.log(canvasRef.current);
        canvas = canvasRef.current

        centerOther = bboxCenter;

        renderer = createRenderer(canvas, true)

        scene = createScene();
        scene2 = createScene();

        // camera
        // camera
        camera = createCamera()
        scene.add(camera);


        // scene.add( new THREE.AxesHelper( 1000 ) )

        // controls
        controls = createTrackballControls(camera, renderer)

        // ambient
        scene.add(new THREE.AmbientLight(0xffffff, .2));

        // light
        const light = new THREE.PointLight(0xffffff, 1.5);
        camera.add(light);


        async function loadBrain() {
            await OBJLoaderThreeJS({
                scene: scene,
                obj: brain,
                color: 0Xf4a582,
                opacity: 0.3,
                transparency: true,
                center: true
            });
            //load lesion1
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion1,
                color: 0XFF0000,
                opacity: 1,
                transparency: false,
                center: false
            });
            //load lesion2
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion2,
                color: 0XFF0000,
                opacity: 1,
                transparency: false,
                center: false
            });
            //load lesion3
            await OBJLoaderThreeJS({
                scene: scene,
                obj: lesion3,
                color: 0XFF0000,
                opacity: 1,
                transparency: false,
                center: false
            });

            await loadElectrode(scene2, electrodeData, sampleData);
        }
        if (brain && electrodeData && bboxCenter) {
            loadBrain();
        }



        // OBJMTLLoaders(scene, test, testmtl)


        window.addEventListener('resize', onWindowResize);

    }, [bboxCenter, brain, canvasRef, electrodeData, lesion1, lesion2, lesion3, sampleData]);
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
    center
}) {
    // console.log(obj)
    if (center === true) {
        // console.log('true')
        // [bboxCenter, objBbox] = getbbox(obj)
        centerBrain = getbbox(obj)

        obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);
        // objBbox.setFromObject(obj);

    } else {
        // console.log("false")

        obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);

    }
    scene.add(obj);

    animate()
}

function loadElectrode(scene, electrodeData, sampleData) {
    // console.log(electrodeData)

    const points = populateElectrodes(electrodeData, centerOther);
    scene.add(points);

    const group = createBrainPropagation(sampleData, centerOther)
    scene.add(group);
}