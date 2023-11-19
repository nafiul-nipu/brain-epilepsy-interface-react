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

const width = (window.innerWidth / 3) - 10;
const height = window.innerHeight / 2.6 - 10

export const BrainViewer = ({
    patientInformation,
    electrodeData,
    sample,
    time,
    events,
    allnetworks,
    allnetworksWithEvent,
    eventid,
    selectedEventRange,
    eegInBrain,
    sliderObj,
    buttonValue,
    seeRoi,
    dataTOshow = 'null'
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
                    <BrainLesionLoad
                        patientInformation={patientInformation}
                        lesionArray={dataRegisty[patientInformation.id].lesionArray}
                    />
                    <ElectrodeLoad
                        electrodeData={electrodeData}
                        sampleData={sample}
                        bbox={dataRegisty[patientInformation.id].bbox}
                        eegInBrain={eegInBrain}
                        selectedEventRange={selectedEventRange}
                        timeRange={time}
                        eventData={events}
                        allnetwork={allnetworks}
                        allnetworkWithEvent={allnetworksWithEvent}
                        patientID={patientInformation.id}
                        currSample={patientInformation.sample}
                        eventid={eventid}
                        seeRoi={seeRoi}
                        buttonValue={buttonValue}
                        sliderObj={sliderObj}
                        dataTOshow={dataTOshow}
                    />
                    <OrbitControls enablePan={true} />
                </Suspense>
                <Stats />
            </Canvas>
        </Col >
    )

}