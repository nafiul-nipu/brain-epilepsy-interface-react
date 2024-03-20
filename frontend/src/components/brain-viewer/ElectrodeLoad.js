import { useEffect, useLayoutEffect, useRef } from "react";
import { Color, Object3D } from "three";
import { scaleLinear } from "d3";

const object = new Object3D();

const colorslist = [
    '#007ed3',
    '#FF004F',
    '#9F8170',
    '#9400D3',
    '#FFC40C',
    '#59260B',
    '#FE4EDA',
    '#40E0D0',
    '#FF4F00',
    '#006D6F',
    '#C19A6B'
];
const catColor = {
    1: '#1f77b4',
    2: '#ff7f0e',
    3: "#FF96C5",
    4: "#FF5768",
    5: "#FFBF65",
    6: "#9467bd",
    7: "#fdbf6f",
    8: "#ff7f0e",
    9: "#fb9a99",
    10: "#8c564b",
    12: "#9467bd",
    14: "#00A5E3",
}

const seizure = {
    "ep187": [12, 13, 14, 15, 19],
    "ep165": [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124],
    "ep164": [43, 44, 45, 46, 52, 53, 54, 55, 56, 64, 71, 72, 78, 79, 80, 86, 87, 88, 93, 94, 95, 96, 101, 102, 103, 104, 109, 110, 111, 112, 117, 118, 119, 120],
    "ep162": [20, 21, 22, 23, 24, 27, 28, 29, 30, 31, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104],
    "ep160": [19, 20, 29, 30, 31, 32, 36, 37, 38, 39, 40, 49, 50, 51, 52, 55, 57, 58, 59, 60, 63, 64, 65, 66, 67, 72, 73, 74, 75, 76, 77, 80, 81, 82, 83, 84, 88, 89, 90, 91, 92, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112],
    "ep129": [27, 28, 35, 36, 37, 38, 41, 42, 43, 47, 48, 49, 50, 51, 52, 55, 56, 103, 104, 105, 109, 110]
}


let currentIndex = 0;
let sampleSize = scaleLinear().range([1, 4])
export const ElectrodeLoad = ({
    electrodeData,
    sampleData,
    community,
    bbox,
    eegInBrain,
    timeRange,
    eventData,
    allnetwork,
    visualPanel,
    buttonValue,
    sliderObj,
    eegList,
    sampleDomain,
    patchRegionToggle,
    patientID
}) => {
    const isMountedRef = useRef(false)
    const meshRef = useRef()
    useLayoutEffect(() => {
        isMountedRef.current = true;
        meshRef.current.setColorAt(0, new Color());
        // console.log(sampleData)

        return () => {
            isMountedRef.current = false;
        }
    }, [])

    // instancing
    useLayoutEffect(() => {
        // console.log("visual panel", visualPanel)
        if (!isMountedRef.current) return;
        if (buttonValue === 'Pause') return;
        if (visualPanel === 'Patch-Com-Net' || visualPanel === 'Region-Com-Net') {
            // console.log(electrodeData)
            const uniqueRegions = visualPanel === 'Region-Com-Net' ? [...new Set(electrodeData.map(obj => obj.region))] : null;

            // console.log(uniqueRegions);
            // console.log("patches")
            electrodeData.forEach((electrode, index) => {
                if (visualPanel === 'Region-Com-Net') {
                    const regionIndex = uniqueRegions.indexOf(electrode.region);
                    meshRef.current.setColorAt(index, new Color(colorslist[regionIndex]));
                } else {
                    meshRef.current.setColorAt(index, new Color(colorslist[electrode.label]));
                }
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
            const currentSample = community.communities;
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
            sampleSize.domain(sampleDomain)
            // console.log("frequncy")
            const currentSample = sampleData[currentIndex];
            // console.log(currentSample)
            let startElec = [...new Set(currentSample.slice(0, Math.round(currentSample.length)).map(item => item.start))]
            let frequencies = currentSample.map(item => item.frequency)
            electrodeData.forEach((electrode, index) => {
                if (startElec.includes(electrode['electrode_number'])) {
                    meshRef.current.setColorAt(index, new Color(0x04b0bf));
                    const indexOfStartElec = startElec.indexOf(electrode['electrode_number'])
                    const freq = sampleSize(frequencies[indexOfStartElec])
                    object.scale.set(freq, freq, freq)
                } else {
                    meshRef.current.setColorAt(index, new Color("#FFFFFF"));
                    object.scale.set(0.75, 0.75, 0.75)
                }

                object.position.set(
                    electrode.position[0],
                    electrode.position[1],
                    electrode.position[2]
                );
                object.updateMatrix();
                meshRef.current.setMatrixAt(index, object.matrix);
            });

        } else if (visualPanel === 'Patches') {
            // console.log(electrodeData)
            const uniqueRegions = patchRegionToggle === 'Region' ? [...new Set(electrodeData.map(obj => obj.region))] : null;

            // console.log(uniqueRegions);
            // console.log("patches")
            electrodeData.forEach((electrode, index) => {
                if (patchRegionToggle === 'Region') {
                    const regionIndex = uniqueRegions.indexOf(electrode.region);
                    meshRef.current.setColorAt(index, new Color(colorslist[regionIndex]));
                } else {
                    meshRef.current.setColorAt(index, new Color(colorslist[electrode.label]));
                }
                object.scale.set(1, 1, 1)

                object.position.set(
                    electrode.position[0],
                    electrode.position[1],
                    electrode.position[2]
                );
                object.updateMatrix();
                meshRef.current.setMatrixAt(index, object.matrix);
            });
        }

        if (eegList !== null && eegList.length > 0) {
            electrodeData.forEach((electrode, index) => {
                if (eegList.includes(electrode['electrode_number'])) {
                    meshRef.current.setColorAt(index, new Color(0x363636));
                }
            })
        }

        if (eegInBrain !== null) {
            const foundObject = electrodeData.findIndex(obj => obj.electrode_number === eegInBrain);
            meshRef.current.setColorAt(foundObject, new Color(0xd11799));
        }

        // electrodeData.forEach((electrode, index) => {
        //     if (seizure[patientID].includes(electrode['electrode_number'])) {
        //         meshRef.current.setColorAt(index, new Color(0x050df0));
        //     }
        // })


        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.instanceColor.needsUpdate = true;

    }, [allnetwork,
        buttonValue,
        eegInBrain,
        electrodeData,
        eventData,
        visualPanel,
        community,
        eegList,
        sampleDomain,
        patchRegionToggle,
        patientID
    ])

    useEffect(() => {
        if (!isMountedRef.current) return;
        let interval;
        // console.log(sampleData)
        if (buttonValue === 'Pause') {
            // console.log(electrodeData)
            // let currentIndex = 0;
            sampleSize.domain(sampleDomain)
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
                        let frequencies = currentSample.map(item => item.frequency)
                        electrodeData.forEach((electrode, index) => {
                            if (startElec.includes(electrode['electrode_number'])) {
                                meshRef.current.setColorAt(index, new Color(0x04b0bf));
                                const indexOfStartElec = startElec.indexOf(electrode['electrode_number'])
                                const freq = sampleSize(frequencies[indexOfStartElec])
                                object.scale.set(freq, freq, freq)
                            } else {
                                meshRef.current.setColorAt(index, new Color("#FFFFFF"));
                                object.scale.set(0.75, 0.75, 0.75)
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
                }

            }, 1000);

        }
        return () => clearInterval(interval);
    }, [buttonValue, electrodeData, sampleData, community, sampleDomain])
    return (
        <group>
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
        </group>
    )
}