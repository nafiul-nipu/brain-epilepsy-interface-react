import { Col } from "react-bootstrap";
import CustomOBJModel from "./ModelLoader";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import dataRegisty from '../../data/dataRegistry.json'
import * as THREE from "three";

const width = (window.innerWidth / 3) - 10;
const height = window.innerHeight / 2.6 - 10
export const BrainViewer = ({
    patientInformation,
}) => {
    const [bboxCenter, setBboxCenter] = useState(null);

    const [brainUrl, setBrainUrl] = useState(
        `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/${patientInformation.id}/${patientInformation.id}_brain.obj`
    );

    const brain = useLoader(OBJLoader, brainUrl);

    console.log(brain.uuid)

    useEffect(() => {
        let objBbox = new THREE.Box3().setFromObject(brain);
        let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
        bboxCenter.multiplyScalar(-1);
        setBboxCenter(bboxCenter)
        console.log(bboxCenter)
    }, [brainUrl])


    useLayoutEffect(() => {
        console.log("brain traversing")
        let objBbox = new THREE.Box3().setFromObject(brain);
        let center = objBbox.getCenter(new THREE.Vector3()).clone();
        center.multiplyScalar(-1);
        brain.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.color = new THREE.Color('grey');
                child.material.opacity = 0.15;
                child.material.transparent = true;
                // child.geometry.translate(0, 0, 0);
            }
        });

    }, [brainUrl])

    return (
        <Col md='12' style={{ height: height, width: width }}>
            <Suspense fallback={<div>Loading...</div>}>
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
                            <primitive object={brain} />
                            {
                                brain && bboxCenter && dataRegisty[patientInformation.id].lesionArray.map((lesion, index) => {
                                    return (
                                        <CustomOBJModel
                                            key={index}
                                            url={`https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/${patientInformation.id}/${patientInformation.id}_lesion${lesion}.obj`}
                                            color="#505050"
                                            opacity={1}
                                            transparent={false}
                                        // center={bboxCenter}
                                        />
                                    )
                                })
                            }
                        </group>
                        <OrbitControls enablePan={false} />
                    </Suspense>
                </Canvas>
            </Suspense>
        </Col>
    )

}