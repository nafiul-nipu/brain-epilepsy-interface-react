import * as d3 from "d3";
import ChartContainer, {
    useChartContext,
} from "../components/chart-container/chart-container";

const colorslist = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3'];


const containerProps = {
    useZoom: false,
    ml: 2,
    mr: 2,
    mb: 0,
    mt: 10,
};

export const RegionCircles = ({
    data,
    circleRadius,
    roi,
    roiCount,
    roiFilter,
    setRoiFilter
}) => {
    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper
                data={data}
                circleRadius={circleRadius}
                roi={roi}
                roiCount={roiCount}
                roiFilter={roiFilter}
                setRoiFilter={setRoiFilter}
            />
        </ChartContainer>
    )
};

const RegionWrapper = ({ data, circleRadius, roi, roiCount, roiFilter, setRoiFilter }) => {
    // console.log(data.activeElectrode)
    const dimensions = useChartContext();

    // Set number of circles per row
    const circlesPerRow = 8;
    const count = data.activeElectrode.length;

    const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);

    // Calculate number of rows needed
    const numRows = Math.ceil(count / circlesPerRow);


    // const circleRadius = (50 / circlesPerRow) / 2;
    // console.log(d3.extent(data.frequency))

    const roiScale = d3.scaleLinear()
        .domain([0, d3.max(roiCount)])
        .range([0, dimensions.boundedWidth - 40])

    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const circles = [];
        for (let j = 0; j < circlesPerRow; j++) {
            const circleIndex = i * circlesPerRow + j;
            if (circleIndex < count) {
                circles.push(
                    <g key={`${i}_${j}`}>
                        <circle
                            key={circleIndex}
                            cx={10 + j * (circleSpacing + 2 * 10)}
                            cy={(i + 0.5) * (dimensions.boundedHeight / numRows)}
                            r={circleRadius(data.frequency[circleIndex])}
                            fill={`${colorslist[roi]}`}
                        /><title>{`
                        Electrode : E${data.activeElectrode[circleIndex]}\nFrequency : ${data.frequency[circleIndex]}
                        `}</title>
                    </g>
                );
            }
        }
        rows.push(<g key={i}>{circles}</g>);
    }


    return (
        <g >
            <text x={0} y={-1} fontSize={12} fill="black" textAnchor="start">
                {`Roi: ${roi}`}
            </text>
            {/* <text x={0} y={0} fontSize={12} fill="black" textAnchor="start">
                {`Freq: ${roiCount[roi]}`}
            </text> */}
            <rect
                x={0}
                y={0}
                width={dimensions.boundedWidth}
                height={dimensions.boundedHeight}
                fill={`${colorslist[roi]}`}
                opacity={0.2}
                stroke="black"
            />
            <rect
                x={35}
                y={-10}
                width={roiScale(roiCount[roi])}
                height={containerProps.mt - containerProps.ml}
                fill={roi === roiFilter ? "#FFA500" : "#2b2b2a"}
                onClick={() => setRoiFilter(roi)}
            /><title>{`
            Roi : ${roi}\nFrequency : ${roiCount[roi]}
            `}</title>

            {rows}

        </g>
    )
}