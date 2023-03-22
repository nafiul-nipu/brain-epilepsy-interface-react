// component renders the brain, tumors, electrodes, electrode network
import React from 'react';
import { useRef, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import * as d3 from 'd3';
import circle from '../models/disc.png'
import {
    createRenderer,
    createScene,
    createCamera,
    createTrackballControls,
    setOnWindowResize,
    render,
    getbbox,
    objMaterialManipulation
} from '../library/CommonUtilities'

import dataRegistry from '../data/dataRegistry.json'

import { vertexShader, fragmentShader } from '../library/shadersrc'

let canvas = null;
// let renderer, scene, scene2, camera, controls, centerBrain, centerOther;

// const colorD3 = d3.scaleOrdinal()
//     .domain([101, 301, 300, 100, 400, 401, 201, 501])
//     .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'])

export const ElectrodeNetworkTumor = ({
    brain,
    electrodeData,
    sampleData,
    bboxCenter,
    sliderObj,
    timeRange,
    lesions,
    eventData
}) => {
    // creating canvas reference
    const canvasRef = useRef(null);
    canvas = canvasRef.current;


    useEffect(() => {
        // clearInterval(inter)
        let inter;
        // brain center - for brain and lesions will calculate later
        // for others take the center from parent
        let centerBrain;
        let centerOther = bboxCenter;
        // console.log(canvasRef.current);
        console.log("working brain with network")

        // size scale for brain network
        let sizeScale = d3.scaleLinear()
            .domain([0, dataRegistry.maxSize]) //this is now customly added
            .range([6, 10])

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

            for (let lesion of lesions) {
                // console.log(lesion);
                //load lesion
                await OBJLoaderThreeJS({
                    scene: scene,
                    obj: lesion,
                    color: 0Xf7680f,
                    opacity: 1,
                    transparency: false,
                    center: false
                });

            }

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
            console.log("load electrode")

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
            const color = new THREE.Color();
            let firstColor = []
            let firstSize = []
            let pointGeometry = new THREE.BufferGeometry();
            // add the vertices, need to loop once as positio will be same 
            for (let top = 0; top < electrodeData.length; top++) {
                vertices.push(electrodeData[top].position[0], electrodeData[top].position[1], electrodeData[top].position[2])
                // let c = colorD3(electrodeData[top].label)
                // let d = new THREE.Color(c)
                color.setRGB(10 / 255, 10 / 255, 10 / 255);
                // color.setRGB(253 / 255, 180 / 255, 98 / 255);
                // firstColor.push(color.r, color.g, color.b);
                // firstColor.push(d.r, d.g, d.b);
                firstSize.push(6);

            }
            colors.push(firstColor)
            sizes.push(firstSize)
            // 10 * (1 + Math.sin(0.1 * top + 1))

            // 55,126,184
            sampleData.forEach(data => {
                // do nothing
                let sortedData = structuredClone(data) //
                sortedData.sort((a, b) => b.frequency - a.frequency);

                // console.log(Math.round(sortedData.length * percent))
                let startElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length)).map(item => item.start))]
                
                // loop through the data 
                let eachColor = []
                let eachSize = []

                for (let top = 0; top < electrodeData.length; top++) {
                    if (startElec.includes(electrodeData[top].electrode_number)) {
                        // start electrode
                        // console.log('start')
                        color.setRGB(3 / 255, 218 / 255, 197 / 255);
                        eachColor.push(color.r, color.g, color.b)

                        const arr = sortedData.find(p => p.start === electrodeData[top].electrode_number);
                        eachSize.push(sizeScale(arr.frequency))

                    } else {
                        // rest electrode
                        // color.setRGB(253 / 255, 180 / 255, 98 / 255);
                        color.setRGB(10 / 255, 10 / 255, 10 / 255);
                        eachColor.push(color.r, color.g, color.b);
                        eachSize.push(6);
                    }
                }
                colors.push(eachColor)
                sizes.push(eachSize)

            })


            // console.log(sizes)
            pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(firstColor, 3));
            pointGeometry.setAttribute('size', new THREE.Float32BufferAttribute(firstSize, 1).setUsage(THREE.DynamicDrawUsage));

            let points = new THREE.Points(pointGeometry, shaderMaterial);
            points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

            scene[1].add(points);


            // console.log(points)
            // change the colours, one a second
            inter = setInterval(function () {

                let value = d3.select('#play-pause-btn').property('value')

                if (value === 'pause') {
                    scene[1].remove(points)
                    // console.log("inter")
                    colIdx = (colIdx + 1) % colors.length;

                    d3.selectAll('.highlightRect').style('opacity', '0')
                    if (colIdx !== 0) {
                        d3.selectAll(`#high${colIdx}`).style('opacity', '0.5')
                    }

                    if (colIdx === 0) {
                        sliderObj.value([0, 0]);
                    } else {
                        sliderObj.value([(colIdx - 1) * timeRange, colIdx * timeRange]);
                    }


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

                } else if (value === 'play' && document.getElementsByClassName('referenceCircle')[0].id !== 'null') {
                    const element = document.getElementsByClassName('referenceCircle')
                    // console.log(element[0].id)
                    let i = +element[0].id;
                    scene[1].remove(points)

                    // console.log(electrodeData)
                    // console.log(eventData)

                    let EEachColor = []
                    let EEachSize = []
                    for (let top = 0; top < electrodeData.length; top++) {
                        if (eventData[i].electrode.includes(electrodeData[top].electrode_number)) {
                            // start electrode
                            // console.log('start')
                            color.setRGB(3 / 255, 218 / 255, 197 / 255);
                            EEachColor.push(color.r, color.g, color.b)
                            EEachSize.push(6)

                        } else {
                            // rest electrode
                            color.setRGB(10 / 255, 10 / 255, 10 / 255);
                            EEachColor.push(color.r, color.g, color.b);
                            EEachSize.push(6);
                        }
                    }



                    // console.log(sizes[colIdx])
                    // console.log(EEachColor)
                    // console.log(colors)
                    let geometry = new THREE.BufferGeometry();
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    geometry.setAttribute('color', new THREE.Float32BufferAttribute(EEachColor, 3));
                    // points.geometry.colors.set(new THREE.Float32BufferAttribute(colors[colIdx]));
                    geometry.setAttribute('size', new THREE.Float32BufferAttribute(EEachSize, 1).setUsage(THREE.DynamicDrawUsage));

                    points = new THREE.Points(geometry, shaderMaterial);
                    points.geometry.colorsNeedUpdate = true;
                    points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

                    scene[1].add(points);

                    render(renderer, [scene[0], scene[1]], camera)

                    // console.log(eventData[i])
                    sliderObj.value([eventData[i].time[0], eventData[i].time[eventData[i].time.length - 1]]);

                    element[0].id = 'null';
                }
            }, 2500);

        }

        return () => {
            console.log('cleaning tumor')
            clearInterval(inter)
        }


    }, [bboxCenter, brain, canvasRef, electrodeData, eventData, lesions, sampleData, sliderObj, timeRange]);

    return (
        <Col md='12'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
};
