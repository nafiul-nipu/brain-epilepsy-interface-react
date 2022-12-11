// component renders the brain, tumors, electrodes, electrode network

import { useRef, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import circle from '../models/disc.png'
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

import { vertexShader, fragmentShader } from '../library/shadersrc'

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

            let uniforms = {

                pointTexture: { value: new THREE.TextureLoader().load(circle) }

            };

            const shaderMaterial = new THREE.ShaderMaterial({

                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                // blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                vertexColors: true,
                alphaTest: 0.5,
                side: THREE.DoubleSide,

            });


            let vertices = []
            let colors = []
            let sizes = []
            let colIdx = 0;
            let sizeIdx = 0;
            const color = new THREE.Color();
            let firstColor = []
            let firstSize = []
            let pointGeometry = new THREE.BufferGeometry();
            // add the vertices, need to loop once as positio will be same 
            for (let top = 0; top < electrodeData.length; top++) {
                vertices.push(electrodeData[top].position[0], electrodeData[top].position[1], electrodeData[top].position[2])
                color.setRGB(10 / 255, 10 / 255, 10 / 255);
                // color.setRGB(253 / 255, 180 / 255, 98 / 255);
                firstColor.push(color.r, color.g, color.b);
                firstSize.push(5);

            }
            colors.push(firstColor)
            sizes.push(firstSize)
            // 10 * (1 + Math.sin(0.1 * top + 1))

            // 55,126,184
            if (electrodeNetworkValue[0] === 'TopPercentile') {
                sampleData.forEach(data => {
                    // do nothing
                    let sortedData = structuredClone(data) //
                    sortedData.sort((a, b) => b.frequency - a.frequency);
                    let percent = +electrodeNetworkValue[1] / 100;

                    // console.log(Math.round(sortedData.length * percent))
                    let startElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.start))]

                    let endElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.end))]

                    // loop through the data 
                    let eachColor = []
                    let eachSize = []
                    for (let top = 0; top < electrodeData.length; top++) {
                        if (startElec.includes(electrodeData[top].electrode_number)) {
                            // start electrode
                            // console.log('start')
                            color.setRGB(3 / 255, 218 / 255, 197 / 255);
                            eachColor.push(color.r, color.g, color.b)
                            eachSize.push(10 * (1 + Math.sin(0.1 * top + 1)))
                        } else if (endElec.includes(electrodeData[top].electrode_number)) {
                            // end electrode
                            // color.setRGB(10 / 255, 166 / 255, 2 / 255);
                            color.setRGB(3 / 255, 218 / 255, 197 / 255);
                            eachColor.push(color.r, color.g, color.b);
                            eachSize.push(10 * (1 + Math.sin(0.1 * top + 1)))
                        } else {
                            // rest electrode
                            // color.setRGB(253 / 255, 180 / 255, 98 / 255);
                            color.setRGB(10 / 255, 10 / 255, 10 / 255);
                            eachColor.push(color.r, color.g, color.b);
                            eachSize.push(5);
                        }
                    }
                    colors.push(eachColor)
                    sizes.push(eachSize)

                })
            }
            else {

                sampleData.forEach(data => {
                    var pairData = data.filter(obj => {
                        return obj.start === +electrodeNetworkValue[1];
                    });
                    let electrodeList = [...new Set(pairData.map((item) => item.end))]

                    let eachColor = []
                    let eachSize = []
                    for (let i = 0; i < electrodeData.length; i++) {
                        if (electrodeData[i].electrode_number === +electrodeNetworkValue[1]) {
                            // console.log("start")
                            color.setRGB(255 / 255, 111 / 255, 97 / 255);
                            // console.log(color.r, color.g, color.b)
                            eachColor.push(color.r, color.g, color.b);
                            eachSize.push(10 * (1 + Math.sin(0.1 * i + 1)))
                        } else if (electrodeList.includes(electrodeData[i].electrode_number)) {
                            // console.log('ends')
                            // color.setRGB(249 / 255, 251 / 255, 178 / 255);
                            color.setRGB(3 / 255, 218 / 255, 197 / 255);
                            // color.setRGB(2 / 255, 65 / 255, 166 / 255);
                            eachColor.push(color.r, color.g, color.b);
                            eachSize.push(10 * (1 + Math.sin(0.1 * i + 1)))
                        } else {
                            color.setRGB(10 / 255, 10 / 255, 10 / 255);
                            eachColor.push(color.r, color.g, color.b);
                            eachSize.push(5);
                        }
                    }
                    colors.push(eachColor)
                    sizes.push(eachSize)

                })

            }

            pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(firstColor, 3));
            pointGeometry.setAttribute('size', new THREE.Float32BufferAttribute(firstSize, 1).setUsage(THREE.DynamicDrawUsage));


            // const sprite = new THREE.TextureLoader().load(circle);

            // const material = new THREE.PointsMaterial({
            //     size: 10,
            //     sizeAttenuation: true,
            //     map: sprite,
            //     alphaTest: 0.5,
            //     transparent: true,
            //     side: THREE.DoubleSide,
            //     vertexColors: true
            // });
            // // material.color.setHSL(0.0, 1.0, 0.5);
            // let points = new THREE.Points(pointGeometry, material);
            // points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

            let points = new THREE.Points(pointGeometry, shaderMaterial);
            points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

            scene[1].add(points);


            // console.log(points)
            // change the colours, one a second
            setInterval(function () {
                scene[1].remove(points)
                // console.log("inter")
                colIdx = (colIdx + 1) % colors.length;

                // console.log(sizes[colIdx])
                let geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors[colIdx], 3));
                // points.geometry.colors.set(new THREE.Float32BufferAttribute(colors[colIdx]));
                geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes[colIdx], 1).setUsage(THREE.DynamicDrawUsage));

                points = new THREE.Points(geometry, shaderMaterial);
                points.geometry.colorsNeedUpdate = true;
                points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

                scene[1].add(points);

                render(renderer, [scene[0], scene[1]], camera)
            }, 1000);


        }


    }, [bboxCenter, brain, canvasRef, electrodeData, lesion1, lesion2, lesion3, sampleData, electrodeNetworkValue]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


