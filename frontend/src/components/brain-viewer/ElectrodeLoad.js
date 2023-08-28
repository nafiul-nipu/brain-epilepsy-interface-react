import { useLayoutEffect, useRef } from "react"
import { Color, Object3D } from "three"

const object = new Object3D();
export const ElectrodeLoad = ({
    electrodeData,
    sampleData
}) => {
    const isMountedRef = useRef(false)
    const meshRef = useRef()
    useLayoutEffect(() => {
        isMountedRef.current = true;
        meshRef.current.setColorAt(0, new Color());

        return () => {
            isMountedRef.current = false;
        }
    }, [])

    // instancing
    useLayoutEffect(() => {
        if (!isMountedRef.current) return;

        electrodeData.forEach((electrode, index) => {
            object.position.set(
                electrode.position[0],
                electrode.position[1],
                electrode.position[2]
            );
            object.updateMatrix();
            meshRef.current.setMatrixAt(index, object.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [electrodeData])

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, electrodeData.length]}
        >
            <sphereBufferGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={"red"} />
        </instancedMesh>
    )
}