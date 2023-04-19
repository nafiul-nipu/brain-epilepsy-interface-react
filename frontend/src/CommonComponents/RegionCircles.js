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
    activeElectrode
}) => {
    return (
        <ChartContainer {...containerProps}>
            <RegionWrapper activeElectrode={activeElectrode} />
        </ChartContainer>
    )
};

const RegionWrapper = ({ activeElectrode }) => {
    const dimensions = useChartContext();

    // Set number of circles per row
    const circlesPerRow = 8;
    const count = activeElectrode.length;

    // Calculate number of rows needed
    const numRows = Math.ceil(count / circlesPerRow);

    // Calculate circle radius based on number of circles per row and SVG width
    const circleRadius = (50 / circlesPerRow) / 2;

    // Create rows and circles using nested loops
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const circles = [];
        for (let j = 0; j < circlesPerRow; j++) {
            const circleIndex = i * circlesPerRow + j;
            if (circleIndex < count) {
                circles.push(
                    <circle
                        key={circleIndex}
                        cx={`${(j + 0.5) * (100 / circlesPerRow)}%`}
                        cy={`${(i + 0.5) * (100 / numRows)}%`}
                        r={`${circleRadius}%`}
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