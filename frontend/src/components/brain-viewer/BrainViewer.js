import { Row, Col } from "react-bootstrap";
import CustomOBJModel from "./ModelLoader";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stats, View } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import dataRegisty from '../../data/dataRegistry.json'
import * as THREE from "three";
import { useBBoxcenter } from "../../library/useBBoxcenter";
import { BrainLesionLoad } from "./BrainLesionLoad";
import { ElectrodeLoad } from "./ElectrodeLoad";
import { Button, Card, Slider } from "antd";

const width = (window.innerWidth / 2) - 10;
const height = window.innerHeight / 2.3 - 10

export const BrainViewer = ({
    patientInformation,
    electrodeData,
    sample,
    community,
    time,
    events,
    allnetworks,
    allnetworksWithEvent,
    eventid,
    selectedEventRange,
    eegInBrain,
    sliderObj,
    buttonValue,
    visualPanel,
    setSampleValue,
}) => {
    const [leftBrainOpacity, setLeftBrainOpacity] = useState(1);
    const [rightBrainOpacity, setRightBrainOpacity] = useState(1);
    const containerRef = useRef();
    const views = [useRef(), useRef(), useRef()];
    // console.log(sampleData)

    // console.log(electrodeData)
    const changeLeftBrainOpacity = (value) => {
        setLeftBrainOpacity(value);
    };

    const changeRightBrainOpacity = (value) => {
        setRightBrainOpacity(value);
    };

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
                        left: "49%",
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
                                            width: width / community.length,
                                            display: "inline-block",
                                            padding: "2px",
                                            border: "0.5px solid grey",
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
                                            <pointLight position={[10, 10, 10]} />
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
                                                selectedEventRange={selectedEventRange}
                                                timeRange={time}
                                                eventData={events}
                                                allnetwork={allnetworks}
                                                allnetworkWithEvent={allnetworksWithEvent}
                                                patientID={patientInformation.id}
                                                eventid={eventid}
                                                visualPanel={visualPanel}
                                                buttonValue={buttonValue}
                                                sliderObj={sliderObj}
                                                setSampleValue={setSampleValue}
                                            />
                                            <OrbitControls enablePan={true} />
                                        </View>
                                    ))
                                }
                            </Canvas>
                        </div>

                        :
                        <Canvas>
                            <Suspense fallback={null}>
                                <PerspectiveCamera
                                    makeDefault
                                    position={[-250, -10, 0]}
                                    up={[0, 0, 1]}
                                    aspect={width / height}
                                    near={1}
                                    far={2000}
                                    fov={40}
                                />
                                {/* <color attach="background" args={['#000']} /> */}
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} />
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
                                <directionalLight position={[-250, -10, 0]} />
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
                                    selectedEventRange={selectedEventRange}
                                    timeRange={time}
                                    eventData={events}
                                    allnetwork={allnetworks}
                                    allnetworkWithEvent={allnetworksWithEvent}
                                    patientID={patientInformation.id}
                                    eventid={eventid}
                                    visualPanel={visualPanel}
                                    buttonValue={buttonValue}
                                    sliderObj={sliderObj}
                                    setSampleValue={setSampleValue}
                                />
                                <OrbitControls enablePan={true} />
                            </Suspense>
                            <Stats />
                        </Canvas>
                }
            </Col >
        </>
    )

}