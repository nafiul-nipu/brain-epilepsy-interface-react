export const RegionCircles = ({
    width,
    height,
    regions,
}) => {
    return (
        <svg width={width} height={height}>
            <g>
                {regions.map((region, i) => {
                    return (
                        <g key={i}>
                            <circle
                                cx={region.x}
                                cy={region.y}
                                r={region.r}
                                fill={region.color}
                                stroke="black"
                                strokeWidth={1}
                            />
                            <text
                                x={region.x}
                                y={region.y}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize="0.5em"
                            >
                                {region.name}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};