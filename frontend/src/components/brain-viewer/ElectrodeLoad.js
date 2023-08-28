import { useEffect, useLayoutEffect, useRef } from "react";
import { Color, Object3D } from "three";
import { extent, scaleLinear, max } from "d3";

const object = new Object3D();

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3'];

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
    eventid,
    seeRoi,
}) => {
    const isMountedRef = useRef(false)
    const meshRef = useRef()
    useLayoutEffect(() => {
        isMountedRef.current = true;
        meshRef.current.setColorAt(0, new Color());
        console.log(electrodeData)

        console.log(selectedEventRange)
        return () => {
            isMountedRef.current = false;
        }
    }, [])

    // instancing
    useLayoutEffect(() => {
        if (!isMountedRef.current) return;
        let filteredData, freqData, freqDomain, circleRadius;
        if (selectedEventRange) {
            filteredData = eventData
                .filter((el) => el.time.some(t => t >= selectedEventRange[0] && t <= selectedEventRange[selectedEventRange.length - 1]))

            freqData = [];
            freqDomain = [];
            for (let i = 0; i < allnetwork.length - 1; i++) {
                const arr = allnetwork[i].electrodes;
                const result = arr.reduce((acc, curr) => {
                    const frequency = filteredData.reduce((freq, obj) => {
                        if (obj.electrode.includes(curr)) {
                            freq++;
                        }
                        return freq;
                    }, 0);

                    acc.activeElectrode.push(curr);
                    acc.frequency.push(frequency);
                    return acc;
                }, { activeElectrode: [], frequency: [] });

                freqData.push(result);
                freqDomain.push(...extent(result.frequency))
            }

            circleRadius = scaleLinear()
                .domain([0, max(freqDomain) === 0 ? 1 : max(freqDomain)])
                .range([1, 2])
        }
        electrodeData.forEach((electrode, index) => {

            if (seeRoi) {
                allnetwork.forEach((network, netIndex) => {
                    if (network.roi !== "roi"
                        && network.electrodes.includes(electrode['electrode_number'])
                    ) {
                        meshRef.current.setColorAt(index, new Color(colorslist[netIndex]));
                        object.scale.set(1, 1, 1)
                    }
                })
            } else {
                if (selectedEventRange) {
                    if (electrode['electrode_number'] === eegInBrain) {
                        meshRef.current.setColorAt(index, new Color(0x0AF521));
                        object.scale.set(1.25, 1.25, 1.25)
                    } else {
                        let inside = false;
                        for (let r = 0; r < freqData.length; r++) {
                            if (freqData[r].frequency[freqData[r].activeElectrode.indexOf(electrode.electrode_number)] > 0) {
                                meshRef.current.setColorAt(index, new Color(colorslist[r]));
                                const size = circleRadius(freqData[r].frequency[freqData[r].activeElectrode.indexOf(electrode.electrode_number)]);
                                console.log(size)
                                object.scale.set(size, size, size)
                                inside = true;
                                break;
                            }
                        }
                        if (!inside) {
                            meshRef.current.setColorAt(index, new Color(0x000000));
                            object.scale.set(1, 1, 1)
                        }
                    }
                }
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

    }, [allnetwork, eegInBrain, electrodeData, eventData, seeRoi, selectedEventRange])


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