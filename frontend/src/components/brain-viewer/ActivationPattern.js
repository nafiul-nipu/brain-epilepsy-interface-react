import { Line } from "@react-three/drei";
import * as d3 from "d3";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

const twoColors = ["#e41a1c", "#ffff99", ];
const threeColors = ["#e41a1c", "#ffff99", "#984ea3" ];
const HullMesh = ({ type, weight, points, minWeight, maxWeight }) => {
  const colorScale = d3
    .scaleOrdinal()
    .domain(
      maxWeight === 2
        ? [minWeight, maxWeight]
        : [minWeight, (minWeight + maxWeight) / 2, maxWeight]
    )
    .range(maxWeight === 2 ? twoColors : threeColors);
  const color = new THREE.Color(colorScale(weight));

  if (type === "hull") {
    // Four or more points → Draw convex hull
    const vectorPoints = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return (
      <mesh geometry={new ConvexGeometry(vectorPoints)}>
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>
    );
  } else if (type === "line") {
    const linePoints = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));

    return <Line points={linePoints} color={color} lineWidth={5} />;
  } else if (type === "other") {
    if (points.length === 1) {
      // Single point → Draw sphere
      return (
        <mesh position={points[0]}>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      );
    }

    if (points.length === 2) {
      // Two points → Draw line
      const linePoints = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));

      return <Line points={linePoints} color={color} lineWidth={15} />;
    }

    if (points.length === 3) {
      const linePoints = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));

      return <Line points={linePoints} color={color} lineWidth={15} />;
      // // Three points → Create convex geometry
      // const [p1, p2, p3] = points;

      // // Convert array to THREE.Vector3
      // const v1 = new THREE.Vector3(...p1);
      // const v2 = new THREE.Vector3(...p2);
      // const v3 = new THREE.Vector3(...p3);

      // // Calculate midpoints of edges
      // const midpoint12 = new THREE.Vector3()
      //   .addVectors(v1, v2)
      //   .multiplyScalar(0.5);
      // const midpoint23 = new THREE.Vector3()
      //   .addVectors(v2, v3)
      //   .multiplyScalar(0.5);
      // const midpoint31 = new THREE.Vector3()
      //   .addVectors(v3, v1)
      //   .multiplyScalar(0.5);

      // // Add an additional point inside the triangle (centroid)
      // const centroid = new THREE.Vector3()
      //   .addVectors(v1, v2)
      //   .add(v3)
      //   .multiplyScalar(1 / 3);

      // // Combine original points, midpoints, and centroid
      // const allPoints = [
      //   v1,
      //   v2,
      //   v3,
      //   midpoint12,
      //   midpoint23,
      //   midpoint31,
      //   centroid,
      // ];

      // // Create ConvexGeometry
      // const geometry = new ConvexGeometry(allPoints);

      // return (
      //   <mesh geometry={geometry}>
      //     <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      //   </mesh>
      // );
    }
  }
};

export const ActivationPattern = ({ patternData, bbox }) => {
  // console.log(patternData);
  const weights = patternData.map((obj) => obj.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  return (
    <group position={[bbox.x, bbox.y, bbox.z]}>
      {patternData.map((pattern, i) => (
        <HullMesh
          key={i}
          type={pattern.type}
          weight={pattern.weight}
          points={pattern.points}
          minWeight={minWeight}
          maxWeight={maxWeight}
        />
      ))}
    </group>
  );
};
