import * as d3 from "d3";
import ChartContainer, {
    useChartContext,
} from "../components/chart-container/chart-container";

const containerProps = {
    useZoom: false,
    ml: 20,
    mr: 20,
    mb: 0,
    mt: 20,
};

export const RegionCircles = ({
    activeElectrode,
    sampleData
}) => {
    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper activeElectrode={activeElectrode} sampleData={sampleData} />
        </ChartContainer>
    )
};

const RegionWrapper = ({ activeElectrode, sampleData }) => {
    console.log(sampleData)
    const dimensions = useChartContext();

    // Set number of circles per row
    const circlesPerRow = 8;
    const count = activeElectrode.length;

    const circleSpacing = (dimensions.boundedWidth - 2 * 10 * circlesPerRow) / (circlesPerRow - 1);

    // Calculate number of rows needed
    const numRows = Math.ceil(count / circlesPerRow);

    const circleRadius = (50 / circlesPerRow) / 2;

    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const circles = [];
        for (let j = 0; j < circlesPerRow; j++) {
            const circleIndex = i * circlesPerRow + j;
            if (circleIndex < count) {
                circles.push(
                    <circle
                        key={circleIndex}
                        cx={10 + j * (circleSpacing + 2 * 10)}
                        cy={(i + 0.5) * (dimensions.boundedHeight / numRows)}
                        r={circleRadius}
                        fill="blue"
                    />
                );
            }
        }
        rows.push(<g key={i}>{circles}</g>);
    }


    return (
        <>
            {rows}
        </>
    )
}