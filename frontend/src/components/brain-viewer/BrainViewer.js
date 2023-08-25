import { Col } from "react-bootstrap";
import CustomOBJModel from "./ModelLoader";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import dataRegisty from '../../data/dataRegistry.json'
import * as THREE from "three";
import { useBBoxcenter } from "../../library/useBBoxcenter";

const width = (window.innerWidth / 3) - 10;
const height = window.innerHeight / 2.6 - 10
const partURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/frontend/src/models/'

export const BrainViewer = ({
    patientInformation,
}) => {
    // getting the center of the objtects
    // const bboxCenter = useBBoxcenter({ patient: patientInformation.id, objType: 'brain.obj' });

    // console.log(bboxCenter)

    return (
        <Col md='12' style={{ height: height, width: width }}>
            <Canvas>
                <Suspense fallback={null}>
                    <PerspectiveCamera
                        makeDefault
                        position={[-250, -50, -50]}
                        up={[0, 0, 1]}
                        aspect={width / height}
                        near={1}
                        far={2000}
                        fov={40}
                    />
                    {/* <color attach="background" args={['#000']} /> */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    <group>
                        <CustomOBJModel
                            // url={`${partURL}${patientInformation.id}/${patientInformation.id}_brain.obj`}
                            url={'brain.obj'}
                            color="#505050"
                            opacity={0.15}
                            transparent={true}
                        />
                        <CustomOBJModel
                            // url={`${partURL}${patientInformation.id}/${patientInformation.id}_brain.obj`}
                            url={'lesion1.obj'}
                            color="#505050"
                            opacity={1}
                            transparent={false}
                        />
                        <CustomOBJModel
                            // url={`${partURL}${patientInformation.id}/${patientInformation.id}_brain.obj`}
                            url={'lesion2.obj'}
                            color="#505050"
                            opacity={1}
                            transparent={false}
                        />
                        {/* {
                            dataRegisty[patientInformation.id].lesionArray.map((lesion, index) => {
                                return (
                                    <CustomOBJModel
                                        key={index}
                                        url={`${partURL}${patientInformation.id}/${patientInformation.id}_lesion${lesion}.obj`}
                                        color="#505050"
                                        opacity={1}
                                        transparent={false}
                                    // center={bboxCenter}
                                    />
                                )
                            })
                        } */}
                    </group>
                    <OrbitControls enablePan={false} />
                </Suspense>
            </Canvas>
        </Col >
    )

}