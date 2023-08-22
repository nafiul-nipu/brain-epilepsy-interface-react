import { Col } from "react-bootstrap";
import CustomOBJModel from "./ModelLoader";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

const width = (window.innerWidth / 3) - 10;
const height = window.innerHeight / 2.6 - 10
export const BrainViewer = () => {

    return(
        <Col md='12' style={{height: height, width: width }}>
            <Canvas>
                <PerspectiveCamera 
                    makeDefault 
                    position={[-250, -50, -50]}
                    up={[0, 0, 1]}
                    aspect={width / height}
                    near={1}
                    far={2000}
                    fov={40}
                />
                <color attach="background" args={['#000']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                
                <CustomOBJModel 
                    url='https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/ep129/ep129_brain.obj' 
                    color="0X111111" 
                    opacity={0.15} 
                    transparent={true} 
                />
                <CustomOBJModel
                    url='https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/models/ep129/ep129_lesion1.obj'
                    color="0X808080"
                    opacity={1}
                    transparent={false}
                />
                <OrbitControls />
            </Canvas>
        </Col>
    )

}