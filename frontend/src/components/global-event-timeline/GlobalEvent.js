import * as d3 from 'd3';
import ChartContainer, { useChartContext } from '../chart-container/chart-container';

import dataRegistry from "../../data/dataRegistry.json";

const containerProps = {
    useZoom: false,
    ml: 10,
    mr: 10,
    mb: 5,
    mt: 0,
};

const countAccessor = (d) => d.count;

export const GlobalEvent = ({ data, id, currentSample, threshold }) => {
    // console.log(data[currentSample])
    return (
        <ChartContainer {...containerProps}>
            <ChartWrapper data={data} id={id} currentSample={currentSample} threshold={threshold} />
        </ChartContainer>
    );
};

const ChartWrapper = ({ data, id, currentSample, threshold }) => {
    console.log(dataRegistry[id].time)
    const dimensions = useChartContext();
    const xScale = d3
        .scaleLinear()
        .range([0, dimensions.boundedWidth])
        .domain([0, dataRegistry[id].time]);
    const yScale = d3
        .scaleLinear()
        .range([0, 10])
        .domain([0, d3.max(data[currentSample], (d) => d.count)]);

    return (
        <>
            {/* <text x={0} y={10} textAnchor="middle" fontSize="12px">Global Timeline</text> */}
            <rect x={0} y={0} width={dimensions.boundedWidth} height={dimensions.boundedHeight} fill="#DDDCDC" />
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
                                        width={yScale(d.count)}
                                        height={dimensions.boundedHeight}
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
}