import { useRef, useEffect } from "react";
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'


let canvas = null;
let renderer, scene, camera, controls, bboxCenter, objBbox;
export const BrainWithElectrode = ({
    brain,
    electrodeData
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
        const light = new THREE.PointLight(0xffffff, .2);
        camera.add(light);


        // console.log(electrodeData)
        async function loadBrain() {
            await OBJLoaderThreeJS(scene, brain, 0Xdae2e3, 1, false, animate, electrodeData);

        }

        loadBrain();

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
    electrodeData
) {
    // console.log(center)
    let loader = new OBJLoader()

    loader.load(`${objType}`, function (obj) {
        // console.log(obj.children.length)

        objBbox = new THREE.Box3().setFromObject(obj);
        bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
        bboxCenter.multiplyScalar(-1);

        obj.children.forEach((child) => {
            if (electrodeData) {
                let positions = child.geometry.attributes.position.array;
                // console.log(positions)
                let colors = []
                for (let i = 0; i < positions.length; i = i + 3) {
                    let match = false;
                    for (let j = 0; j < electrodeData.length; j++) {

                        // console.log(electrodeData[i])
                        if (
                            positions[i].toFixed(3) === electrodeData[j].newPosition[0].toFixed(3)
                            &&
                            positions[i + 1].toFixed(3) === electrodeData[j].newPosition[1].toFixed(3)
                            &&
                            positions[i + 2].toFixed(3) === electrodeData[j].newPosition[2].toFixed(3)
                        ) {
                            // console.log([data.position[i], data.position[i + 1], data.position[i + 2]], electrodeData[j])
                            // console.log("true")
                            // data.color.data.push(1.0, 0.0, 0.0)
                            let tempcolor = new THREE.Color(0XFF0000);
                            colors.push(tempcolor.r, tempcolor.g, tempcolor.b);
                            match = true;
                            // console.log("match is true")
                            break;
                        }
                    }
                    if (match === false) {
                        let tempcolor = new THREE.Color(0XFFFFFF)
                        colors.push(tempcolor.r, tempcolor.g, tempcolor.b);
                        // console.log("match is false now")
                    }

                }
                // console.log(colors)
                child.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

            }

            if (child instanceof THREE.Mesh) {
                child.material.color.setHex(color);
                child.material.opacity = opacity;
                // child.material.transparent = transparency;
                child.material.vertexColors = true;
                // child.geometry.center();

                // child.material.side = THREE.DoubleSide;

                child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);

            }
        });
        objBbox.setFromObject(obj);
        // obj.position.set(0, 0, 0)
        scene.add(obj);

        animate()
    })
}
