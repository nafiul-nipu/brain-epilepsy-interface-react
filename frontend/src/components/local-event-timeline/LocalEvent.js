import * as d3 from 'd3';
import dataRegistry from "../../data/dataRegistry.json";
import ChartContainer, { useChartContext } from '../chart-container/chart-container';

const containerProps = {
    useZoom: false,
    ml: 10,
    mr: 10,
    mb: 5,
    mt: 0,
};

const countAccessor = (d) => d.count;

export const LocalEvent = ({ data, id, currentSample, threshold, domain, locaEventHeight }) => {
    return (
        <ChartContainer {...containerProps}>
            <ChartWrapper
                data={data}
                id={id}
                currentSample={currentSample}
                threshold={threshold}
                domain={domain}
                locaEventHeight={locaEventHeight} />
        </ChartContainer>
    );

};

const ChartWrapper = ({ data, id, currentSample, threshold, domain, locaEventHeight }) => {
    const dimensions = useChartContext();
    const height = locaEventHeight - containerProps.mt - containerProps.mb;
    // console.log(data[currentSample])
    const xScale = d3
        .scaleLinear()
        .range([0, dimensions.boundedWidth])
        .domain(domain);
    return (
        <>
            <rect x={0} y={0} width={dimensions.boundedWidth} height={height} fill="#DDDCDC" />
            <g>
                {
                    data[currentSample].filter((el) => countAccessor(el) >= threshold[0] && countAccessor(el) <= threshold[1])
                        .map((d, i) => {
                            return (
                                <g key={i}>
                                    <rect
                                        key={i}
                                        x={d.time.length > 1 ? xScale(d.time[0]) : xScale(d.time)}
                                        y={0}
                                        width={d.time.length > 1 ? xScale(d.time[d.time.length - 1]) - xScale(d.time[0]) : 1}
                                        height={height}
                                        fill={'orange'}
                                    /><title>{`
                            Event Id : ${d.index}\nTimepoint : ${d.time.length > 1 ? `${d.time[0]} - ${d.time[d.time.length - 1]}` : `${d.time}`} ms\nElectrodes : ${d.count}
                            `}</title>
                                </g>
                            );
                        })
                }
            </g>
        </>
    );

};