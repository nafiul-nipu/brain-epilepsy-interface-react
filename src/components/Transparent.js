import { useRef, useEffect } from "react";
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import combined_paraview from '../models/combined_paraview.obj'
import test from '../models/test.obj'
import testmtl from '../models/test.mtl'

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

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(700, 400);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0X000000, 1);

        renderer.outputEncoding = THREE.sRGBEncoding;

        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(-250, -50, -50);
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


        async function loadBrain() {
            await OBJLoaderThreeJS(scene, brain, 0X111111, 0.3, true, animate, true);
            //load lesion1
            OBJLoaderThreeJS(scene, lesion1, 0XFF0000, 1, false, animate, false)
            // //load lesion2
            OBJLoaderThreeJS(scene, lesion2, 0XFF0000, 1, false, animate, false)
            // load lesion3
            OBJLoaderThreeJS(scene, lesion3, 0XFF0000, 1, false, animate, false)
        }

        loadBrain();

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
    // console.log(center)
    let loader = new OBJLoader()

    loader.load(`${objType}`, function (obj) {
        // console.log(obj.children.length)
        if (center === true) {
            objBbox = new THREE.Box3().setFromObject(obj);
            bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
            bboxCenter.multiplyScalar(-1);

            obj.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.setHex(color);
                    child.material.opacity = opacity;
                    child.material.transparent = transparency;
                    // child.geometry.center();

                    // child.material.side = THREE.DoubleSide;

                    child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);

                }
            });
            objBbox.setFromObject(obj);

        } else {
            obj.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.setHex(color);
                    child.material.opacity = opacity;
                    child.material.transparent = transparency;
                    // child.geometry.center();

                    // child.material.side = THREE.DoubleSide;

                    child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);

                }
            });

        }
        // obj.position.set(0, 0, 0)
        scene.add(obj);

        animate()
    })
}


function OBJMTLLoaders(
    scene,
    objType,
    mtlType,
) {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(`${mtlType}`, function (materials) {
        materials.preload();

        let objloader = new OBJLoader();
        objloader.setMaterials(materials);
        objloader.load(`${objType}`, function (obj) {
            // console.log(obj)

            var objBbox = new THREE.Box3().setFromObject(obj);

            // Geometry vertices centering to world axis
            // console.log(objBbox)
            var bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
            bboxCenter.multiplyScalar(-1);

            obj.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name === 'brain_paraview') {
                        child.material.opacity = 0.2;
                        child.material.transparent = true;
                    }
                    child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
                }
                // child.geometry.center()
            });


            objBbox.setFromObject(obj); // Update the bounding box

            scene.add(obj)
            // controls.update()
        });
    });
    animate()
}