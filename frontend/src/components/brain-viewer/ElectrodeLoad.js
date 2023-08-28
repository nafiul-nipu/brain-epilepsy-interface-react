import { useLayoutEffect, useRef } from "react"
import { Color, Object3D } from "three"

const object = new Object3D();
export const ElectrodeLoad = ({
    electrodeData,
    sampleData,
    bbox
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
        console.log(bbox)

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
        // meshRef.current.geometry.translate(0, 0, 0)
        // meshRef.current.geometry.translate(bbox.x, bbox.y, bbox.z);
    }, [bbox, electrodeData])

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, electrodeData.length]}
        >
            <sphereBufferGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={"red"} />
        </instancedMesh>
    )
}