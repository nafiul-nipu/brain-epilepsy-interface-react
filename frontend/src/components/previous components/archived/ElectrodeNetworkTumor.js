// component renders the brain, tumors, electrodes, electrode network
import React from 'react';
import { useRef, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import * as THREE from 'three';
import * as d3 from 'd3';
import circle from '../../models/disc.png'

import {
    createRenderer,
    createScene,
    createCamera,
    createTrackballControls,
    setOnWindowResize,
    render,
    getbbox,
    objMaterialManipulation,
} from '../../../library/CommonUtilities'

import dataRegistry from '../../../data/dataRegistry.json'

import { vertexShader, fragmentShader } from '../../../library/shadersrc'

let canvas = null;
// let renderer, scene, scene2, camera, controls, centerBrain, centerOther;

// const colorD3 = d3.scaleOrdinal()
//     .domain([101, 301, 300, 100, 400, 401, 201, 501])
//     .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'])

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3'];

export const ElectrodeNetworkTumor = ({
    brain,
    electrodeData,
    sampleData,
    bboxCenter,
    sliderObj,
    timeRange,
    lesions,
    eventData,
    allnetwork,
    allnetworkWithEvent,
    patientID,
    view,
    buttonValue,
    eventid,
    selectedEventRange,
    eegInBrain,
    seeRoi,
    eventRange
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
        // console.log("centerOther", centerOther)
        // console.log(canvasRef.current);
        // console.log("brain three D view render starts")

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
        scene.add(light);


        // console.log(electrodeData)
        async function loadBrain() {
            // load brain
            await OBJLoaderThreeJS({
                scene: scene,
                obj: brain,
                color: 0X111111,
                opacity: 0.15,
                transparency: true
            });

            for (let lesion of lesions) {
                // console.log(lesion);
                //load lesion
                await OBJLoaderThreeJS({
                    scene: scene,
                    obj: lesion,
                    color: 0X808080, //0Xf7680f,
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
                // console.log("centerBrain undefined", obj)
                // [bboxCenter, objBbox] = getbbox(obj)
                // get bboxcenter
                centerBrain = getbbox(obj)
            }

            // console.log(obj)
            // material manipulation
            obj = objMaterialManipulation(obj, color, opacity, transparency, centerBrain);

            // objBbox.setFromObject(obj);
            scene.add(obj);

            // console.log("brain loaded");
            animate()
        }

        // load electrode
        function loadElectrode(scene, electrodeData, sampleData) {
            // console.log("load electrode")
            // console.log("rendering electrodes")

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
                firstSize.push(4);

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
                        // color.setRGB(3 / 255, 218 / 255, 197 / 255);
                        color.setRGB(255 / 255, 165 / 255, 0 / 255);
                        eachColor.push(color.r, color.g, color.b)

                        const arr = sortedData.find(p => p.start === electrodeData[top].electrode_number);
                        eachSize.push(sizeScale(arr.frequency))

                    } else {
                        // rest electrode
                        // color.setRGB(253 / 255, 180 / 255, 98 / 255);
                        color.setRGB(10 / 255, 10 / 255, 10 / 255);
                        eachColor.push(color.r, color.g, color.b);
                        eachSize.push(4);
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

            if (seeRoi) {
                let roiElectrodes = []
                // console.log("eventdata", eventData)
                // console.log("allnetwork", allnetwork)
                // console.log('allnetworkWithEvent', allnetworkWithEvent)
                for (let i = 0; i < allnetwork.length - 1; i++) {
                    roiElectrodes.push(allnetwork[i].electrodes)
                }

                if (points) scene[1].remove(points)
                let elecColors = []
                let elecSize = []
                for (let top = 0; top < electrodeData.length; top++) {
                    for (let i = 0; i < roiElectrodes.length; i++) {
                        if (roiElectrodes[i].includes(electrodeData[top].electrode_number)) {
                            const rgb = parseInt(colorslist[i].replace(/^#/, ''), 16);
                            const r = (rgb >> 16) & 0xff;
                            const g = (rgb >> 8) & 0xff;
                            const b = (rgb >> 0) & 0xff;
                            const threeJsColor = new THREE.Color(r / 255, g / 255, b / 255);
                            color.setRGB(threeJsColor.r, threeJsColor.g, threeJsColor.b);
                            elecColors.push(color.r, color.g, color.b)
                            elecSize.push(4)
                        }
                    }
                }

                let geom = new THREE.BufferGeometry();
                geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                // console.log('position')
                geom.setAttribute('color', new THREE.Float32BufferAttribute(elecColors, 3));
                // points.geom.colors.set(new THREE.Float32BufferAttribute(colors[colIdx]));
                geom.setAttribute('size', new THREE.Float32BufferAttribute(elecSize, 1).setUsage(THREE.DynamicDrawUsage));

                points = new THREE.Points(geom, shaderMaterial);
                points.geometry.colorsNeedUpdate = true;
                points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

                scene[1].add(points);

            } else {
                if (selectedEventRange) {
                    // console.log(selectedEventRange)
                    // console.log(eventData)
                    const filteredData = eventData
                        .filter((el) => el.time.some(t => t >= selectedEventRange[0] && t <= selectedEventRange[selectedEventRange.length - 1]))

                    const freqData = [];
                    let freqDomain = [];
                    for (let i = 0; i < allnetwork.length - 1; i++) {
                        const arr = allnetwork[i].electrodes;
                        const result = arr.reduce((acc, curr) => {
                            const frequency = filteredData.reduce((freq, obj) => {
                                if (obj.electrode.includes(curr)) {
                                    freq++;
                                }
                                return freq;
                            }, 0);

                            acc.activeElectrode.push(curr);
                            acc.frequency.push(frequency);
                            return acc;
                        }, { activeElectrode: [], frequency: [] });

                        freqData.push(result);
                        freqDomain.push(...d3.extent(result.frequency))
                    }

                    const circleRadius = d3.scaleLinear()
                        .domain([0, d3.max(freqDomain) === 0 ? 1 : d3.max(freqDomain)])
                        .range([4, 8])

                    if (points) scene[1].remove(points)
                    let elecColors = []
                    let elecSize = []
                    for (let top = 0; top < electrodeData.length; top++) {
                        if (electrodeData[top].electrode_number === eegInBrain) {
                            color.setRGB(10 / 255, 245 / 255, 33 / 255);
                            // color.setRGB(1, 0.435, 0.38);
                            elecColors.push(color.r, color.g, color.b)
                            elecSize.push(4)

                        } else {
                            let inside = false;
                            for (let r = 0; r < freqData.length; r++) {
                                if (freqData[r].frequency[freqData[r].activeElectrode.indexOf(electrodeData[top].electrode_number)] > 0) {
                                    const rgb = parseInt(colorslist[r].replace(/^#/, ''), 16);
                                    const red = (rgb >> 16) & 0xff;
                                    const green = (rgb >> 8) & 0xff;
                                    const blue = (rgb >> 0) & 0xff;
                                    const threeJsColor = new THREE.Color(red / 255, green / 255, blue / 255);
                                    color.setRGB(threeJsColor.r, threeJsColor.g, threeJsColor.b);
                                    elecColors.push(color.r, color.g, color.b)
                                    elecSize.push(circleRadius(freqData[r].frequency[freqData[r].activeElectrode.indexOf(electrodeData[top].electrode_number)]))
                                    inside = true;
                                    break;
                                }
                            }
                            if (!inside) {
                                // rest electrode
                                color.setRGB(10 / 255, 10 / 255, 10 / 255);
                                elecColors.push(color.r, color.g, color.b);
                                elecSize.push(4);
                            }
                        }
                    }

                    let geom = new THREE.BufferGeometry();
                    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    // console.log('position')
                    geom.setAttribute('color', new THREE.Float32BufferAttribute(elecColors, 3));
                    // points.geom.colors.set(new THREE.Float32BufferAttribute(colors[colIdx]));
                    geom.setAttribute('size', new THREE.Float32BufferAttribute(elecSize, 1).setUsage(THREE.DynamicDrawUsage));

                    points = new THREE.Points(geom, shaderMaterial);
                    points.geometry.colorsNeedUpdate = true;
                    points.geometry.translate(centerOther.x, centerOther.y, centerOther.z);

                    scene[1].add(points);

                    sliderObj([selectedEventRange[0], selectedEventRange[selectedEventRange.length - 1]])


                }


            }

            // render(renderer, [scene[0], scene[1]], camera)

            // console.log(points)
            // change the colours, one a second
            inter = setInterval(function () {
                // console.log(d3.select(`#play-pause-btn${view}`))
                // console.log(buttonValue)
                // let value = d3.select(`#play-pause-btn${view}`).property('value')
                let value = buttonValue;

                if (value === 'Pause') {
                    // console.log('play animation')
                    scene[1].remove(points)
                    // console.log("inter")
                    colIdx = (colIdx + 1) % colors.length;

                    if (colIdx === 0) {
                        sliderObj([0, 0]);
                    } else {
                        sliderObj([(colIdx - 1) * timeRange, colIdx * timeRange]);
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

                    // render(renderer, [scene[0], scene[1]], camera)

                }
            }, 2500);

        }

        return () => {
            // console.log('cleaning tumor')
            clearInterval(inter)
        }


    }, [canvasRef,
        brain,
        sampleData,
        timeRange,
        patientID,
        sliderObj,
        bboxCenter,
        electrodeData,
        lesions,
        allnetworkWithEvent,
        allnetwork,
        eventData,
        buttonValue,
        eventid,
        selectedEventRange,
        eegInBrain,
        seeRoi
    ]);

    //[canvasRef, drawSVG, electrodeData, patientID, sliderObj,
    //  timeRange, buttonValue, bboxCenter, brain, sampleData,
    //lesions, allnetworkWithEvent, allnetwork, eventData]);
    // 



    return (
        <Col md='12'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
};
