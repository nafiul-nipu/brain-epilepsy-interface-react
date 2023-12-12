import { useEffect, useLayoutEffect, useRef } from "react";
import { Color, Object3D } from "three";

const object = new Object3D();

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3', '#00A5E3', '#8DD7BF', '#FF96C5'];
const catColor = {
    1: "#00A5E3",
    2: "#8DD7BF",
    3: "#FF96C5",
    4: "#FF5768",
    5: "#FFBF65",
    6: "#9467bd",
    7: "#fdbf6f",
    8: "#ff7f0e",
    9: "#fb9a99",
    10: "#8c564b",
    12: "#9467bd",
    14: "#ff7f0e",
}
let currentIndex = 0;
let currentSampleID = 0;

export const ElectrodeLoad = ({
    electrodeData,
    sampleData,
    community,
    bbox,
    eegInBrain,
    selectedEventRange,
    timeRange,
    eventData,
    allnetwork,
    allnetworkWithEvent,
    patientID,
    eventid,
    visualPanel,
    buttonValue,
    sliderObj,
    setSampleValue
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
        // console.log("visual panel", visualPanel)
        if (!isMountedRef.current) return;
        if (buttonValue === 'Pause') return;
        if (visualPanel === 'Patches') {
            console.log(electrodeData)
            // console.log("patches")
            electrodeData.forEach((electrode, index) => {
                meshRef.current.setColorAt(index, new Color(colorslist[electrode.label]));
                object.scale.set(1, 1, 1)

                object.position.set(
                    electrode.position[0],
                    electrode.position[1],
                    electrode.position[2]
                );
                object.updateMatrix();
                meshRef.current.setMatrixAt(index, object.matrix);
            });

        } else if (visualPanel === 'Community') {
            // console.log("community")
            // console.log(community)
            const currentSample = community[currentSampleID].communities;
            // console.log(currentSample)
            // const coms = community[0].communityList;
            // console.log(coms)
            electrodeData.forEach((electrode, index) => {
                let found = false;
                for (let i = 0; i < currentSample.length; i++) {
                    // console.log(currentSample[i].community)
                    // console.log(new Color(comColor[`${patientID}_${currSample}`][currentSample[i].community]))
                    if (currentSample[i].members.includes(electrode['electrode_number'])) {
                        meshRef.current.setColorAt(index, new Color(catColor[currentSample[i].community]));
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

        } else if (visualPanel === 'Frequency') {
            // console.log("frequncy")
            const currentSample = sampleData[currentIndex];
            // console.log(currentSample)
            let startElec = [...new Set(currentSample.slice(0, Math.round(currentSample.length)).map(item => item.start))]
            // console.log(startElec)
            electrodeData.forEach((electrode, index) => {
                if (startElec.includes(electrode['electrode_number'])) {
                    meshRef.current.setColorAt(index, new Color(0x0AF521));
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

        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.instanceColor.needsUpdate = true;

    }, [allnetwork, buttonValue, eegInBrain, electrodeData, eventData, visualPanel, selectedEventRange, community])

    useEffect(() => {
        if (!isMountedRef.current) return;
        let interval;
        // console.log(sampleData)
        if (buttonValue === 'Pause') {
            // let currentIndex = 0;
            interval = setInterval(() => {
                if (visualPanel === 'Frequency') {
                    // console.log("inter val frequncy")
                    if (currentIndex >= sampleData.length) {
                        clearInterval(interval);
                    } else {
                        currentIndex = (currentIndex + 1) % sampleData.length;

                        const currentSample = sampleData[currentIndex];
                        // console.log(currentSample)
                        let startElec = [...new Set(currentSample.slice(0, Math.round(currentSample.length)).map(item => item.start))]
                        // console.log(startElec)
                        electrodeData.forEach((electrode, index) => {
                            if (startElec.includes(electrode['electrode_number'])) {
                                meshRef.current.setColorAt(index, new Color(0x0AF521));
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

                        meshRef.current.instanceMatrix.needsUpdate = true;
                        meshRef.current.instanceColor.needsUpdate = true;


                        // console.log(currentIndex)
                        // console.log([(currentIndex - 1) * timeRange, currentIndex * timeRange])
                        sliderObj([(currentIndex) * timeRange, (currentIndex + 1) * timeRange]);
                        // if (currentIndex === 0) {
                        //     sliderObj([0, 0]);
                        // } else {
                        //     sliderObj([(currentIndex - 1) * timeRange, currentIndex * timeRange]);
                        // }

                    }
                } else if (visualPanel === 'Community') {
                    // console.log("inter val community")
                    if (currentSampleID >= community.length) {
                        clearInterval(interval);
                    } else {
                        currentSampleID = (currentSampleID + 1) % community.length;
                        // console.log(community)
                        const currentSample = community[currentSampleID].communities;
                        // console.log(currentSample)
                        // const coms = community[0].communityList;
                        // console.log(coms)
                        electrodeData.forEach((electrode, index) => {
                            let found = false;
                            for (let i = 0; i < currentSample.length; i++) {
                                // console.log(currentSample[i].community)
                                // console.log(new Color(comColor[`${patientID}_${currSample}`][currentSample[i].community]))
                                if (currentSample[i].members.includes(electrode['electrode_number'])) {
                                    meshRef.current.setColorAt(index, new Color(catColor[currentSample[i].community]));
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

                        meshRef.current.instanceMatrix.needsUpdate = true;
                        // console.log(currentSampleID)
                        meshRef.current.instanceColor.needsUpdate = true;

                        // currentSampleID = (currentSampleID + 1) % community.length;
                        setSampleValue(currentSampleID)

                    }
                }

            }, 1000);

        }
        return () => clearInterval(interval);
    }, [buttonValue, electrodeData, sampleData, community])
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