import { Col } from "react-bootstrap";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Hud, OrbitControls, PerspectiveCamera, Stats, View, Text } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import dataRegisty from '../../data/dataRegistry.json'
import { BrainLesionLoad } from "./BrainLesionLoad";
import { ElectrodeLoad } from "./ElectrodeLoad";
import { Card, Slider, Button } from "antd";
import * as THREE from 'three';
import { CreateLineCurve } from "./CreateLineCurve";
import { NetworkView } from "./NetworkView";

const width = (window.innerWidth / 2) - 10;
const height = window.innerHeight / 2.3 - 10

const CustomAxesHelper = () => {
    const { camera, scene } = useThree();
    const axesHelperRef = useRef();

    useEffect(() => {
        const axesHelper = new THREE.AxesHelper(5);
        axesHelperRef.current = axesHelper;

        let colors = axesHelper.geometry.attributes.color;

        colors.setXYZ(0, 1, 0, 0);
        colors.setXYZ(1, 1, 0, 0); // x-axis red

        colors.setXYZ(2, 0.290, 0.365, 0.137);
        colors.setXYZ(3, 0.290, 0.365, 0.137); // y-axis green

        colors.setXYZ(4, 0, 0, 1)
        colors.setXYZ(5, 0, 0, 1); // z-axis blue
        scene.add(axesHelper);

        return () => scene.remove(axesHelper);
    }, [scene]);


    useFrame(() => {
        if (!axesHelperRef.current) return;

        const desiredPosition = new THREE.Vector3(0.9, 0.5, 0.5);
        const position = desiredPosition.unproject(camera);
        axesHelperRef.current.position.copy(position);
        axesHelperRef.current.scale.set(0.1, 0.1, 0.1);
    });

    return null;
};

export const BrainViewer = ({
    patientInformation,
    electrodeData,
    sample,
    community,
    time,
    events,
    allnetworks,
    eegInBrain,
    sliderObj,
    buttonValue,
    visualPanel,
    topPercent,
    selectedRoi,
    eegList,
    sampleDomain,
    setEegInBrain,
    patchRegionToggle,
    network_per_minute,
    propagatoinButtonValue,
    setPropagationSlider
}) => {

    // console.log(topPercent)

    // console.log(Object.keys(allnetworks))
    // console.log(Object.keys(community))

    const [leftBrainOpacity, setLeftBrainOpacity] = useState(1);
    const [rightBrainOpacity, setRightBrainOpacity] = useState(1);
    const containerRef = useRef();
    const electrodeOrbitControlsRef = useRef(null);
    const brainOrbitControlsRef = useRef(null);
    const orbitControlsRefs = useRef([]);
    const views = [useRef(), useRef(), useRef()];
    // console.log(sampleData)

    // console.log(electrodeData)
    const changeLeftBrainOpacity = (value) => {
        setLeftBrainOpacity(value);
    };

    const changeRightBrainOpacity = (value) => {
        setRightBrainOpacity(value);
    };

    // reset orbit controls for brain and electrode when visual panel is patches or frequency
    const brainandElectrodeResetOrbitControls = () => {
        if (electrodeOrbitControlsRef.current && brainOrbitControlsRef.current) {
            electrodeOrbitControlsRef.current.reset();
            brainOrbitControlsRef.current.reset();
        }
    };

    // reset orbit controls for all views when visual panel is community, patch-com-net, or region-com-net
    const resetAllOrbitControls = () => {
        orbitControlsRefs.current.forEach(controlsRef => {
            controlsRef.reset();
        });
    };

    // add orbitcontrol ref to the orbitControlsRefs
    const attachRef = (index, ref) => {
        orbitControlsRefs.current[index] = ref;
    };

    // reset orbit controls for all views
    const reset = () => {
        if (visualPanel !== 'Community' && visualPanel !== 'Patch-Com-Net' && visualPanel !== 'Region-Com-Net') {
            brainandElectrodeResetOrbitControls();
        } else {
            resetAllOrbitControls();
        }

        setEegInBrain(null);
    }

    const Lighting = () => {
        return (
            <>
                <ambientLight intensity={0.5} />
                <directionalLight
                    castShadow
                    position={[0, 10, 55]}
                    intensity={1}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                />
            </>
        )
    };

    // console.log(allnetworks)
    // console.log(Object.keys(allnetworks))

    return (
        <>
            <Col md='4'>
                <Card
                    className="brainViewerCard"
                    style={{
                        width: width * 0.2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "10%",
                        left: "48%",
                        zIndex: 100,
                    }}
                >
                    {/* left brain control */}
                    <Card
                        className="leftBrainControlCard"
                        size="small"
                        title="Left Brain"
                        style={{ width: "98%", margin: 5 }}
                    >
                        <p style={{ marginLeft: 15 }}>Opacity:</p>
                        <Slider
                            style={{ width: "100%" }}
                            defaultValue={1}
                            step={0.1}
                            max={1}
                            onChange={changeLeftBrainOpacity}
                        />
                    </Card>
                    {/* right brain control */}
                    <Card
                        className="rightBrainControlCard"
                        size="small"
                        title="Right Brain"
                        style={{ width: "98%", margin: 5 }}
                    >
                        <p style={{ marginLeft: 15 }}>Opacity:</p>
                        <Slider
                            style={{ width: "100%" }}
                            defaultValue={1}
                            step={0.1}
                            max={1}
                            onChange={changeRightBrainOpacity}
                        />
                    </Card>
                    {/* <Button onClick={handleButtonClick} style={{marginTop: 20, marginBottom: 20}}>Update Projection</Button> */}
                    <Button onClick={reset}>Reset Brain</Button>
                </Card>
            </Col>
            <Col md='8' style={{ height: height, width: width }}>
                {
                    visualPanel === 'Community' ?
                        <div ref={containerRef} style={{ height: height, width: width, overflow: 'hidden' }}>
                            {
                                community.map((item, index) => (
                                    <div
                                        key={index}
                                        ref={views[index]}
                                        style={{
                                            height: height,
                                            width: (width - 15) / community.length,
                                            display: "inline-block",
                                            padding: "2px",
                                            margin: "2px",
                                            // border: "0.5px solid grey",
                                            // backgroundColor: "yellowgreen"
                                        }}
                                    ></div>
                                ))
                            }
                            <Canvas eventSource={containerRef} className="canvas">
                                {
                                    community.map((item, index) => (
                                        <View
                                            index={index}
                                            key={index}
                                            track={views[index]}
                                        >
                                            <CustomAxesHelper />
                                            <Text
                                                position={[105, -1, 0]}
                                                color="#d90429"
                                                anchorX="center"
                                                anchorY="middle"
                                                fontSize={10}
                                            >
                                                X
                                            </Text>
                                            <Text
                                                position={[0, 105, 0]}
                                                color="#588157"
                                                anchorX="center"
                                                anchorY="middle"
                                                fontSize={10}
                                            >
                                                Y
                                            </Text>
                                            <Text
                                                position={[0, 0, 105]}
                                                color="#023e8a"
                                                anchorX="center"
                                                anchorY="middle"
                                                fontSize={10}
                                            >
                                                Z
                                            </Text>
                                            <PerspectiveCamera
                                                makeDefault
                                                position={[-250, -10, 0]}
                                                up={[0, 0, 1]}
                                                aspect={width / height}
                                                near={1}
                                                far={2000}
                                                fov={40}
                                            />
                                            <ambientLight intensity={0.5} />
                                            <directionalLight
                                                castShadow
                                                position={[0, 5, 5]}
                                                intensity={1}
                                                shadow-mapSize-width={2048}
                                                shadow-mapSize-height={2048}
                                                shadow-camera-near={0.5}
                                                shadow-camera-far={500}
                                                shadow-camera-left={-5}
                                                shadow-camera-right={5}
                                                shadow-camera-top={5}
                                                shadow-camera-bottom={-5}
                                            />
                                            <BrainLesionLoad
                                                patientInformation={patientInformation}
                                                lesionArray={dataRegisty[patientInformation.id].lesionArray}
                                                brainPartition={dataRegisty[patientInformation.id].brainPartition}
                                                leftBrainOpacity={leftBrainOpacity}
                                                rightBrainOpacity={rightBrainOpacity}
                                            />
                                            <ElectrodeLoad
                                                electrodeData={electrodeData}
                                                sampleData={sample}
                                                community={item}
                                                bbox={dataRegisty[patientInformation.id].bbox}
                                                eegInBrain={eegInBrain}
                                                timeRange={time}
                                                eventData={events}
                                                allnetwork={allnetworks}
                                                visualPanel={visualPanel}
                                                buttonValue={buttonValue}
                                                sliderObj={sliderObj}
                                                eegList={eegList}
                                                sampleDomain={sampleDomain}
                                            />
                                            <NetworkView
                                                electrodeData={electrodeData}
                                                networkData={allnetworks[`sample${index + 1}`]}
                                                topPercent={topPercent}
                                                bbox={dataRegisty[patientInformation.id].bbox}
                                                selectedRoi={selectedRoi}
                                                eegInBrain={eegInBrain}
                                                propagatoinButtonValue={propagatoinButtonValue}
                                                setPropagationSlider={setPropagationSlider}
                                                visualPanel={visualPanel}
                                                endTime={dataRegisty[patientInformation.id].time}
                                            />
                                            <OrbitControls ref={ref => attachRef(index, ref)} enablePan={true} />
                                        </View>
                                    ))
                                }
                                <Stats />
                            </Canvas>
                        </div>

                        : (visualPanel === 'Patch-Com-Net' ?
                            <div ref={containerRef} style={{ height: height, width: width, overflow: 'hidden' }}>
                                {
                                    Object.keys(allnetworks).map((item, index) => (
                                        <div
                                            key={index}
                                            ref={views[index]}
                                            style={{
                                                height: height,
                                                width: (width - 15) / community.length,
                                                display: "inline-block",
                                                padding: "2px",
                                                margin: "2px",
                                                // border: "0.5px solid grey",
                                                // backgroundColor: "yellowgreen"
                                            }}
                                        ></div>
                                    ))
                                }
                                <Canvas eventSource={containerRef} className="canvas">
                                    {
                                        Object.keys(allnetworks).map((item, index) => (
                                            <View
                                                index={index}
                                                key={index}
                                                track={views[index]}
                                            >
                                                <CustomAxesHelper />
                                                <Text
                                                    position={[105, -1, 0]}
                                                    color="#d90429"
                                                    anchorX="center"
                                                    anchorY="middle"
                                                    fontSize={10}
                                                >
                                                    X
                                                </Text>
                                                <Text
                                                    position={[0, 105, 0]}
                                                    color="#588157"
                                                    anchorX="center"
                                                    anchorY="middle"
                                                    fontSize={10}
                                                >
                                                    Y
                                                </Text>
                                                <Text
                                                    position={[0, 0, 105]}
                                                    color="#023e8a"
                                                    anchorX="center"
                                                    anchorY="middle"
                                                    fontSize={10}
                                                >
                                                    Z
                                                </Text>
                                                <PerspectiveCamera
                                                    makeDefault
                                                    position={[-250, -10, 0]}
                                                    up={[0, 0, 1]}
                                                    aspect={width / height}
                                                    near={1}
                                                    far={2000}
                                                    fov={40}
                                                />
                                                <ambientLight intensity={0.5} />
                                                <directionalLight
                                                    castShadow
                                                    position={[0, 5, 5]}
                                                    intensity={1}
                                                    shadow-mapSize-width={2048}
                                                    shadow-mapSize-height={2048}
                                                    shadow-camera-near={0.5}
                                                    shadow-camera-far={500}
                                                    shadow-camera-left={-5}
                                                    shadow-camera-right={5}
                                                    shadow-camera-top={5}
                                                    shadow-camera-bottom={-5}
                                                />
                                                <BrainLesionLoad
                                                    patientInformation={patientInformation}
                                                    lesionArray={dataRegisty[patientInformation.id].lesionArray}
                                                    brainPartition={dataRegisty[patientInformation.id].brainPartition}
                                                    leftBrainOpacity={leftBrainOpacity}
                                                    rightBrainOpacity={rightBrainOpacity}
                                                />
                                                <ElectrodeLoad
                                                    electrodeData={electrodeData}
                                                    sampleData={sample}
                                                    community={community}
                                                    bbox={dataRegisty[patientInformation.id].bbox}
                                                    eegInBrain={eegInBrain}
                                                    timeRange={time}
                                                    eventData={events}
                                                    allnetwork={allnetworks[item]}
                                                    visualPanel={visualPanel}
                                                    buttonValue={buttonValue}
                                                    sliderObj={sliderObj}
                                                    eegList={eegList}
                                                    sampleDomain={sampleDomain}
                                                />

                                                <NetworkView
                                                    electrodeData={electrodeData}
                                                    networkData={allnetworks[item]}
                                                    topPercent={topPercent}
                                                    bbox={dataRegisty[patientInformation.id].bbox}
                                                    selectedRoi={selectedRoi}
                                                    eegInBrain={eegInBrain}
                                                    propagatoinButtonValue={propagatoinButtonValue}
                                                    setPropagationSlider={setPropagationSlider}
                                                    visualPanel={visualPanel}
                                                />
                                                <OrbitControls ref={ref => attachRef(index, ref)} enablePan={true} />
                                            </View>
                                        ))
                                    }
                                    <Stats />
                                </Canvas>
                            </div>
                            :
                            (visualPanel === 'Region-Com-Net' ?
                                <div ref={containerRef} style={{ height: height, width: width, overflow: 'hidden' }}>
                                    {
                                        Object.keys(allnetworks).map((item, index) => (
                                            <div
                                                key={index}
                                                ref={views[index]}
                                                style={{
                                                    height: height,
                                                    width: (width - 15) / community.length,
                                                    display: "inline-block",
                                                    padding: "2px",
                                                    margin: "2px",
                                                    // border: "0.5px solid grey",
                                                    // backgroundColor: "yellowgreen"
                                                }}
                                            ></div>
                                        ))
                                    }
                                    <Canvas eventSource={containerRef} className="canvas">
                                        {
                                            Object.keys(allnetworks).map((item, index) => (
                                                <View
                                                    index={index}
                                                    key={index}
                                                    track={views[index]}
                                                >
                                                    <CustomAxesHelper />
                                                    <Text
                                                        position={[105, -1, 0]}
                                                        color="#d90429"
                                                        anchorX="center"
                                                        anchorY="middle"
                                                        fontSize={10}
                                                    >
                                                        X
                                                    </Text>
                                                    <Text
                                                        position={[0, 105, 0]}
                                                        color="#588157"
                                                        anchorX="center"
                                                        anchorY="middle"
                                                        fontSize={10}
                                                    >
                                                        Y
                                                    </Text>
                                                    <Text
                                                        position={[0, 0, 105]}
                                                        color="#023e8a"
                                                        anchorX="center"
                                                        anchorY="middle"
                                                        fontSize={10}
                                                    >
                                                        Z
                                                    </Text>
                                                    <PerspectiveCamera
                                                        makeDefault
                                                        position={[-250, -10, 0]}
                                                        up={[0, 0, 1]}
                                                        aspect={width / height}
                                                        near={1}
                                                        far={2000}
                                                        fov={40}
                                                    />
                                                    <ambientLight intensity={0.5} />
                                                    <directionalLight
                                                        castShadow
                                                        position={[0, 5, 5]}
                                                        intensity={1}
                                                        shadow-mapSize-width={2048}
                                                        shadow-mapSize-height={2048}
                                                        shadow-camera-near={0.5}
                                                        shadow-camera-far={500}
                                                        shadow-camera-left={-5}
                                                        shadow-camera-right={5}
                                                        shadow-camera-top={5}
                                                        shadow-camera-bottom={-5}
                                                    />
                                                    <BrainLesionLoad
                                                        patientInformation={patientInformation}
                                                        lesionArray={dataRegisty[patientInformation.id].lesionArray}
                                                        brainPartition={dataRegisty[patientInformation.id].brainPartition}
                                                        leftBrainOpacity={leftBrainOpacity}
                                                        rightBrainOpacity={rightBrainOpacity}
                                                    />
                                                    <ElectrodeLoad
                                                        electrodeData={electrodeData}
                                                        sampleData={sample}
                                                        community={community}
                                                        bbox={dataRegisty[patientInformation.id].bbox}
                                                        eegInBrain={eegInBrain}
                                                        timeRange={time}
                                                        eventData={events}
                                                        allnetwork={allnetworks[item]}
                                                        visualPanel={visualPanel}
                                                        buttonValue={buttonValue}
                                                        sliderObj={sliderObj}
                                                        eegList={eegList}
                                                        sampleDomain={sampleDomain}
                                                    />

                                                    <NetworkView
                                                        electrodeData={electrodeData}
                                                        networkData={allnetworks[item]}
                                                        topPercent={topPercent}
                                                        bbox={dataRegisty[patientInformation.id].bbox}
                                                        selectedRoi={selectedRoi}
                                                        eegInBrain={eegInBrain}
                                                        propagatoinButtonValue={propagatoinButtonValue}
                                                        setPropagationSlider={setPropagationSlider}
                                                        visualPanel={visualPanel}
                                                    />
                                                    <OrbitControls ref={ref => attachRef(index, ref)} enablePan={true} />
                                                </View>
                                            ))
                                        }
                                        <Stats />
                                    </Canvas>
                                </div>
                                :
                                <Canvas>
                                    <Suspense fallback={null}>
                                        <Hud renderPriority={1}>
                                            <CustomAxesHelper />
                                            <Text
                                                position={[105, -1, 0]}
                                                color="#d90429"
                                                anchorX="center"
                                                anchorY="middle"
                                                fontSize={10}
                                            >
                                                X
                                            </Text>
                                            <Text
                                                position={[0, 105, 0]}
                                                color="#588157"
                                                anchorX="center"
                                                anchorY="middle"
                                                fontSize={10}
                                            >
                                                Y
                                            </Text>
                                            <Text
                                                position={[0, 0, 105]}
                                                color="#023e8a"
                                                anchorX="center"
                                                anchorY="middle"
                                                fontSize={10}
                                            >
                                                Z
                                            </Text>
                                            <PerspectiveCamera
                                                makeDefault
                                                position={[-250, -10, 0]}
                                                up={[0, 0, 1]}
                                                aspect={width / height}
                                                near={1}
                                                far={2000}
                                                fov={40}
                                            />
                                            <Lighting />
                                            <BrainLesionLoad
                                                patientInformation={patientInformation}
                                                lesionArray={dataRegisty[patientInformation.id].lesionArray}
                                                brainPartition={dataRegisty[patientInformation.id].brainPartition}
                                                leftBrainOpacity={leftBrainOpacity}
                                                rightBrainOpacity={rightBrainOpacity}
                                            />
                                            <OrbitControls ref={brainOrbitControlsRef} enablePan={true} />
                                        </Hud>
                                        <Hud renderPriority={2}>
                                            <PerspectiveCamera
                                                makeDefault
                                                position={[-250, -10, 0]}
                                                up={[0, 0, 1]}
                                                aspect={width / height}
                                                near={1}
                                                far={2000}
                                                fov={40}
                                            />
                                            <Lighting />
                                            <ElectrodeLoad
                                                electrodeData={electrodeData}
                                                sampleData={sample}
                                                community={community}
                                                bbox={dataRegisty[patientInformation.id].bbox}
                                                eegInBrain={eegInBrain}
                                                timeRange={time}
                                                eventData={events}
                                                allnetwork={allnetworks}
                                                visualPanel={visualPanel}
                                                buttonValue={buttonValue}
                                                sliderObj={sliderObj}
                                                eegList={eegList}
                                                sampleDomain={sampleDomain}
                                                patchRegionToggle={patchRegionToggle}
                                            />
                                            {
                                                visualPanel === 'Propagation' ? (
                                                    <NetworkView
                                                        electrodeData={electrodeData}
                                                        networkData={allnetworks[patientInformation.sample]}
                                                        topPercent={topPercent}
                                                        bbox={dataRegisty[patientInformation.id].bbox}
                                                        selectedRoi={selectedRoi}
                                                        eegInBrain={eegInBrain}
                                                        network_per_minute={network_per_minute}
                                                        visualPanel={visualPanel}
                                                        propagatoinButtonValue={propagatoinButtonValue}
                                                        setPropagationSlider={setPropagationSlider}
                                                    />
                                                ) : null
                                            }
                                            <OrbitControls ref={electrodeOrbitControlsRef} enablePan={true} />
                                        </Hud>
                                    </Suspense>
                                    <Stats />
                                </Canvas>
                            )
                        )
                }
            </Col >
        </>
    )

}