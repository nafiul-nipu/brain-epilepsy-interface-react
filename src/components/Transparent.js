import { useRef, useEffect } from "react";
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

let canvas = null;
let renderer, scene, camera, controls;

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

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(700, 400);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0X000000, 1);

        renderer.outputEncoding = THREE.sRGBEncoding;

        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(-50, -50, -50);
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
        const light = new THREE.PointLight(0xffffff, 1.5);
        camera.add(light);


        // model
        // console.log(brain)
        //load brain
        OBJLoaderThreeJS(scene, brain, 0X111111, 0.3, true, animate, true)
        //load lesion1
        OBJLoaderThreeJS(scene, lesion1, 0XFF0000, 1, false, animate, false)
        //load lesion2
        OBJLoaderThreeJS(scene, lesion2, 0XFF0000, 1, false, animate, false)
        //load lesion3
        OBJLoaderThreeJS(scene, lesion3, 0XFF0000, 1, false, animate, false)

        // scene.position.set(50, 0, 0)


        window.addEventListener('resize', onWindowResize);

    }, [brain, canvasRef, lesion1, lesion2, lesion3]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    controls.handleResize();

    render();

}

function render() {

    renderer.render(scene, camera);

}

function animate() {
    requestAnimationFrame(animate)

    // trackball controls needs to be updated in the animation loop before it will work
    controls.update()

    render()

}


function OBJLoaderThreeJS(
    scene,
    objType,
    color,
    opacity,
    transparency,
    animate,
    center
) {
    // console.log(objType)
    let loader = new OBJLoader()

    loader.load(`${objType}`, function (obj) {
        obj.children.forEach((child) => {
            console.log(child)
            if (child instanceof THREE.Mesh) {
                child.material.color.setHex(color);
                child.material.opacity = opacity;
                child.material.transparent = transparency;
                // if (center === true) {
                //     center = new THREE.Vector3();
                //     child.geometry.computeBoundingBox();
                //     child.geometry.boundingBox.getCenter(center);
                //     child.geometry.center();
                //     child.position.copy(center);
                // }

                child.material.side = THREE.DoubleSide;

            }
        });
        // obj.position.set(0, 0, 0)
        scene.add(obj);

        animate()
    })
}