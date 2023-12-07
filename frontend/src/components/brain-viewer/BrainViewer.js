import { Col } from "react-bootstrap";
import CustomOBJModel from "./ModelLoader";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import dataRegisty from '../../data/dataRegistry.json'
import * as THREE from "three";
import { useBBoxcenter } from "../../library/useBBoxcenter";
import { BrainLesionLoad } from "./BrainLesionLoad";
import { ElectrodeLoad } from "./ElectrodeLoad";

const width = (window.innerWidth / 2.2) - 10;
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
    setSampleValue
}) => {
    // console.log(sampleData)

    // console.log(electrodeData)

    return (
        <Col md='12' style={{ height: height, width: width }}>
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
        </Col >
    )

}