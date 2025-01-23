import * as d3 from "d3";
import { Color } from "three";

const colorslist = [
  "#007ed3",
  "#FF004F",
  "#9400D3",
  "#FFC40C",
  "#59260B",
  "#FE4EDA",
  "#FF4F00",
  "#C19A6B",
  "#9F8170",
  "#006D6F",
  "#40E0D0",
];
const HullMesh = ({ weight, points, minWeight, maxWeight }) => {
  const colorScale = d3
    .scaleSequential(d3.interpolatePlasma)
    .domain([minWeight, maxWeight]);

  return (
    <mesh>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flat())}
          itemSize={3}
          count={points.length}
        />
      </bufferGeometry>
      <meshStandardMaterial
        attach="material"
        // color={new Color(colorslist[weight])}
        color={colorslist[weight]}
        side={2}
      />
    </mesh>
  );
};

export const ActivationPattern = ({ patternData, bbox }) => {
  console.log(patternData);
  const weights = patternData.map((obj) => obj.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  return (
    <group position={[bbox.x, bbox.y, bbox.z]}>
      {patternData.map((pattern, i) => (
        <HullMesh
          key={i}
          weight={pattern.weight}
          points={pattern.hull_points}
          minWeight={minWeight}
          maxWeight={maxWeight}
        />
      ))}
    </group>
  );
};
