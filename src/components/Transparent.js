import { useRef, useEffect } from "react";
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
let renderer, scene, camera, controls, bboxCenter, objBbox;

export const Transparent = ({
    brain,
    lesion1,
    lesion2,
    lesion3
}) => {
    const canvasRef = useRef(null);
    canvas = canvasRef.current;

    useEffect(() => {
        // console.log(canvasRef.current);
        canvas = canvasRef.current

        renderer = createRenderer(canvas, true)

        scene = createScene();

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
                color: 0X111111,
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
        }
        if (brain) {
            loadBrain();
        }



        // OBJMTLLoaders(scene, test, testmtl)


        window.addEventListener('resize', onWindowResize);

    }, [brain, canvasRef, lesion1, lesion2, lesion3]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


function onWindowResize() {

    setOnWindowResize(renderer, camera, controls, [scene]);

}


function animate() {
    requestAnimationFrame(animate)

    // trackball controls needs to be updated in the animation loop before it will work
    controls.update()

    render(renderer, [scene], camera)

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
        [bboxCenter, objBbox] = getbbox(obj)

        obj = objMaterialManipulation(obj, color, opacity, transparency, bboxCenter);
        objBbox.setFromObject(obj);

    } else {
        // console.log("false")
        obj = objMaterialManipulation(obj, color, opacity, transparency, bboxCenter);

    }
    // obj.position.set(0, 0, 0)
    scene.add(obj);

    animate()
}