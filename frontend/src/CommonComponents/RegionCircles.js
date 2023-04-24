import * as d3 from "d3";
import ChartContainer, {
    useChartContext,
} from "../components/chart-container/chart-container";

const containerProps = {
    useZoom: false,
    ml: 2,
    mr: 2,
    mb: 0,
    mt: 5,
};

export const RegionCircles = ({
    data,
    radiusDomain
}) => {
    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper data={data} radiusDomain={radiusDomain} />
        </ChartContainer>
    )
};

const RegionWrapper = ({ data, radiusDomain }) => {
    // console.log(data.activeElectrode)
    const dimensions = useChartContext();

    // Set number of circles per row
    const circlesPerRow = 8;
    const count = data.activeElectrode.length;

    const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);

    // Calculate number of rows needed
    const numRows = Math.ceil(count / circlesPerRow);

    const circleRadius = d3.scaleLinear()
        .domain(radiusDomain)
        .range([2, 6])

    // const circleRadius = (50 / circlesPerRow) / 2;
    // console.log(d3.extent(data.frequency))

    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const circles = [];
        for (let j = 0; j < circlesPerRow; j++) {
            const circleIndex = i * circlesPerRow + j;
            if (circleIndex < count) {
                circles.push(
                    <g>
                        <circle
                            key={circleIndex}
                            cx={10 + j * (circleSpacing + 2 * 10)}
                            cy={(i + 0.5) * (dimensions.boundedHeight / numRows)}
                            r={circleRadius(data.frequency[circleIndex])}
                            fill="blue"
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
        <>
            {rows}
            <rect x={0} y={0} width={dimensions.boundedWidth} height={dimensions.boundedHeight} fill="none" stroke="black" />
        </>
    )
}