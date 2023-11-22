import { useEffect, useLayoutEffect, useRef } from "react";
import { Color, Object3D } from "three";
import { extent, scaleLinear, max } from "d3";

import comColor from '../../data/communityColor.json'

const object = new Object3D();

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3'];

let currentIndex = 0;

export const ElectrodeLoad = ({
    electrodeData,
    sampleData,
    bbox,
    eegInBrain,
    selectedEventRange,
    timeRange,
    eventData,
    allnetwork,
    allnetworkWithEvent,
    patientID,
    currSample,
    eventid,
    seeRoi,
    buttonValue,
    sliderObj,
    dataTOshow
}) => {
    const isMountedRef = useRef(false)
    const meshRef = useRef()
    useLayoutEffect(() => {
        isMountedRef.current = true;
        meshRef.current.setColorAt(0, new Color());
        // console.log(electrodeData)

        // console.log(selectedEventRange)
        return () => {
            isMountedRef.current = false;
        }
    }, [])

    // instancing
    useLayoutEffect(() => {
        if (!isMountedRef.current) return;
        electrodeData.forEach((electrode, index) => {
            meshRef.current.setColorAt(index, new Color(0x000000));
            object.position.set(
                electrode.position[0],
                electrode.position[1],
                electrode.position[2]
            );
            object.updateMatrix();
            meshRef.current.setMatrixAt(index, object.matrix);


        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.instanceColor.needsUpdate = true;

    }, [allnetwork, eegInBrain, electrodeData, eventData, seeRoi, selectedEventRange])

    useEffect(() => {
        if (!isMountedRef.current) return;
        let interval;
        // console.log(sampleData)
        if (buttonValue === 'Pause') {
            // let currentIndex = 0;
            interval = setInterval(() => {
                if (currentIndex >= sampleData.length) {
                    clearInterval(interval);
                } else {
                    if (dataTOshow === 'null') {
                        // console.log("community: ", currentIndex)
                        const currentSample = sampleData[currentIndex].communities;
                        console.log(currentSample)
                        electrodeData.forEach((electrode, index) => {
                            let found = false;
                            for (let i = 0; i < currentSample.length; i++) {
                                // console.log(currentSample[i])
                                // console.log(new Color(comColor[`${patientID}_${currSample}`][currentSample[i].community]))
                                if (currentSample[i].members.includes(electrode['electrode_number'])) {
                                    meshRef.current.setColorAt(index, new Color(comColor[`${patientID}_${currSample}`][currentSample[i].community]));
                                    object.scale.set(1.25, 1.25, 1.25)
                                    found = true
                                    break;
                                }
                            }
                            if (found === false) {
                                meshRef.current.setColorAt(index, new Color("#FFFFFF"));
                                object.scale.set(1, 1, 1)
                            }
                            object.position.set(
                                electrode.position[0],
                                electrode.position[1],
                                electrode.position[2]
                            );
                            object.updateMatrix();
                            meshRef.current.setMatrixAt(index, object.matrix);
                        });

                        currentIndex = (currentIndex + 1) % sampleData.length;

                    } else {
                        // console.log("propagation: ", currentIndex)
                        const currentSample = sampleData[currentIndex - 1];
                        // console.log(currentSample)
                        // let startElec = [...new Set(currentSample.slice(0, Math.round(currentSample.length)).map(item => item.start))]
                        let startElec = currentSample.electrodes;
                        // console.log(startElec)
                        // console.log(startElec)
                        electrodeData.forEach((electrode, index) => {
                            if (startElec.includes(electrode['electrode_number'])) {
                                meshRef.current.setColorAt(index, new Color("#FF0000"));
                                object.scale.set(1.25, 1.25, 1.25)
                            } else {
                                meshRef.current.setColorAt(index, new Color(0x000000));
                                object.scale.set(1, 1, 1)
                            }

                            object.position.set(
                                electrode.position[0],
                                electrode.position[1],
                                electrode.position[2]
                            );
                            object.updateMatrix();
                            meshRef.current.setMatrixAt(index, object.matrix);
                        });
                    }
                    // console.log(patientID, currSample)

                    meshRef.current.instanceMatrix.needsUpdate = true;
                    // currentIndex = (currentIndex + 1) % sampleData.length;
                    meshRef.current.instanceColor.needsUpdate = true;


                    // console.log("last ", currentIndex)
                    if (currentIndex === 0) {
                        sliderObj([0, 0]);
                    } else {
                        sliderObj([(currentIndex - 1) * timeRange, (currentIndex) * timeRange]);
                    }

                }

            }, 1200);

        }
        return () => clearInterval(interval);
    }, [buttonValue, electrodeData, sampleData])
    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, electrodeData.length]}
            position={[bbox.x, bbox.y, bbox.z]}
        >
            <sphereBufferGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
                attach="material"
                color="#fff"
                emissive={"#000"}

            />
        </instancedMesh>
    )
}