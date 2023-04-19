import * as d3 from 'd3';
import dataRegistry from "../../data/dataRegistry.json";

const containerProps = {
    useZoom: false,
    ml: 10,
    mr: 10,
    mb: 5,
    mt: 0,
};

const countAccessor = (d) => d.count;

export const LocalEvent = ({ data, id, currentSample, threshold, width, locaEventHeight }) => {
    const height = locaEventHeight - containerProps.mt - containerProps.mb;
    // console.log(data[currentSample])
    const xScale = d3
        .scaleLinear()
        .range([0, 121000])
        .domain([0, dataRegistry[id].time]);
    const yScale = d3
        .scaleLinear()
        .range([0, 10])
        .domain([0, d3.max(data[currentSample], (d) => d.count)]);
    return (
        <div className="scrollableEvent">
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill="#DDDCDC" />
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
            </svg>
        </div>
    );
};