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

            let vertices = []
            let colors = []
            const color = new THREE.Color();
            let pointGeometry = new THREE.BufferGeometry();
            // 55,126,184
            if (electrodeNetworkValue[0] === 'TopPercentile') {
                // do nothing
                let sortedData = structuredClone(sampleData) //
                sortedData.sort((a, b) => b.frequency - a.frequency);
                let percent = +electrodeNetworkValue[1] / 100;

                console.log(Math.round(sortedData.length * percent))
                let percentileData = sortedData.slice(0, Math.round(sortedData.length * percent))
                console.log(percentileData)

                // add the vertices, need to loop once as positio will be same 
                for (let top = 0; top < electrodeData.length; top++) {
                    vertices.push(electrodeData[top].position[0], electrodeData[top].position[1], electrodeData[top].position[2])
                }

                // list of 
                let startElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.start))]

                let endElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.end))]

                for (let eachPercent = 0; eachPercent < percentileData.length; eachPercent++) {
                    // loop through the data 
                    let eachColor = []
                    for (let top = 0; top < electrodeData.length; top++) {
                        if (percentileData[eachPercent].start === electrodeData[top]) {
                            // start electrode
                            eachColor.push(217 / 255, 95 / 255, 2 / 255)
                        } else if (percentileData[eachPercent].end === electrodeData[top]) {
                            // end electrode
                            eachColor.push(27 / 255, 158 / 255, 119 / 255);
                        } else {
                            // rest electrode
                            eachColor.push(160 / 255, 160 / 255, 160 / 255);
                        }
                    }
                }
                // console.log(sortedData)
                for (let top = 0; top < electrodeData.length; top++) {
                    // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
                    // console.log(top)
                    vertices.push(electrodeData[top].position[0], electrodeData[top].position[1], electrodeData[top].position[2])
                    if (startElec.includes(electrodeData[top].electrode_number) && endElec.includes(electrodeData[top].electrode_number)) {
                        // both start and end 
                        // console.log('both')
                        color.setRGB(255 / 255, 255 / 255, 51 / 255);
                        colors.push(color.r, color.g, color.b);
                    }
                    else if (startElec.includes(electrodeData[top].electrode_number)) {
                        // start electrodes
                        // console.log("start")
                        color.setRGB(217 / 255, 95 / 255, 2 / 255);
                        // console.log(color.r, color.g, color.b)
                        colors.push(color.r, color.g, color.b);
                    } else if (endElec.includes(electrodeData[top].electrode_number)) {
                        //  end electrodes
                        // console.log('ends')
                        color.setRGB(27 / 255, 158 / 255, 119 / 255);
                        colors.push(color.r, color.g, color.b);
                    } else {
                        // rest electrodes
                        color.setRGB(160 / 255, 160 / 255, 160 / 255);
                        colors.push(color.r, color.g, color.b);
                    }
                }

                pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            }
            else {
                var result = sampleData.filter(obj => {
                    return obj.start === +electrodeNetworkValue[1];
                });
                // console.log(result)
                let electrodeList = [...new Set(result.map((item) => item.end))]
                // console.log(electrodeList)
                for (let i = 0; i < electrodeData.length; i++) {
                    // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
                    vertices.push(electrodeData[i].position[0], electrodeData[i].position[1], electrodeData[i].position[2]);
                    if (electrodeData[i].electrode_number === +electrodeNetworkValue[1]) {
                        // console.log("start")
                        color.setRGB(217 / 255, 95 / 255, 2 / 255);
                        // console.log(color.r, color.g, color.b)
                        colors.push(color.r, color.g, color.b);
                    } else if (electrodeList.includes(electrodeData[i].electrode_number)) {
                        // console.log('ends')
                        color.setRGB(27 / 255, 158 / 255, 119 / 255);
                        colors.push(color.r, color.g, color.b);
                    } else {
                        color.setRGB(215 / 255, 25 / 255, 28 / 255);
                        colors.push(color.r, color.g, color.b);
                    }
                }

                // let pointGeometry = new THREE.BufferGeometry()
                // pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            }


            const sprite = new THREE.TextureLoader().load(circle);
            const material = new THREE.PointsMaterial({
                size: 10,
                sizeAttenuation: true,
                map: sprite,
                alphaTest: 0.5,
                transparent: true,
                side: THREE.DoubleSide,
                vertexColors: true
            });
            // material.color.setHSL(0.0, 1.0, 0.5);
            const points = new THREE.Points(pointGeometry, material);
            points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

            scene[1].add(points);
        }


    }, [bboxCenter, brain, canvasRef, electrodeData, lesion1, lesion2, lesion3, sampleData, electrodeNetworkValue]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


