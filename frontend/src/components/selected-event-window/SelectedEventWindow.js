import * as d3 from 'd3';

import ChartContainer, { useChartContext } from '../chart-container/chart-container';

const containerProps = {
    useZoom: false,
    ml: 0,
    mr: 0,
    mb: 0,
    mt: 0,
};


const countAccessor = (d) => d.count;

export const SelectedEventWindow = ({
    data,
    currentSample,
    domain,
    threshold,
    setEventRangeNetwork,
    setSimilarRegionEvent,
    similarRegionEvent,
    setExploration
}) => {
    // console.log(data[currentSample])
    return (
        <ChartContainer {...containerProps}>
            <ChartWrapper
                data={data}
                currentSample={currentSample}
                threshold={threshold}
                domain={domain}
                setEventRangeNetwork={setEventRangeNetwork}
                setSimilarRegionEvent={setSimilarRegionEvent}
                similarRegionEvent={similarRegionEvent}
                setExploration={setExploration}
            />
        </ChartContainer>
    );
};

const ChartWrapper = ({
    data,
    currentSample,
    threshold,
    domain,
    setEventRangeNetwork,
    setSimilarRegionEvent,
    similarRegionEvent,
    setExploration
}) => {
    // console.log(data)
    const dimensions = useChartContext();
    const xScale = d3
        .scaleLinear()
        .range([0, dimensions.boundedWidth])
        .domain([domain[0], domain[1]]);

    const saturationScale = d3
        .scaleLinear()
        .range([0, 1])
        .domain([0, d3.max(data[currentSample], (d) => d.count)]);

    const widtheScale = d3
        .scaleLinear()
        .range([5, dimensions.boundedWidth])
        .domain([domain[0], domain[1]]);

    // console.log(dimensions.boundedWidth)
    // console.log(domain)
    // console.log(widtheScale(100))
    // console.log(widtheScale(105))
    function onEventClick(el) {
        // console.log(el.time)
        setEventRangeNetwork(el.time.length > 1 ? el.time : [el.time[0], el.time[0]])
        setSimilarRegionEvent(el.index)
        setExploration(prevState => [...new Set([...prevState, el.index])]);

    }
    return (
        <g>
            {/* <text x={0} y={10} textAnchor="middle" fontSize="12px">Global Timeline</text> */}
            <rect x={0} y={0} width={dimensions.boundedWidth} height={dimensions.boundedHeight} fill="#DDDCDC" />
            <g>
                {
                    data[currentSample]
                        .filter((el) => el.time.some(t => t >= domain[0] && t <= domain[1]))
                        .filter((el) => countAccessor(el) >= threshold[0] && countAccessor(el) <= threshold[1])
                        .map((d, i) => {
                            // console.log(d.time)
                            // console.log(d.time[0], widtheScale(d.time[0]))
                            // console.log(d.time[d.time.length - 1], widtheScale(d.time[d.time.length - 1]))

                            // console.log(widtheScale(d.time[d.time.length - 1]) - widtheScale(d.time[0]))
                            return (
                                <g key={i}>
                                    <rect
                                        key={i}
                                        x={d.time.length > 1 ? xScale(d.time[0]) : xScale(d.time)}
                                        y={0}
                                        width={d.time.length > 1 && d.time[d.time.length - 1] - d.time[0] !== 0 ?
                                            widtheScale(d.time[d.time.length - 1]) - widtheScale(d.time[0])
                                            : 2}
                                        height={dimensions.boundedHeight}
                                        fill={similarRegionEvent === d.index ? 'red' : 'orange'}
                                        onClick={() => onEventClick(d)}
                                    // filter={`saturate(${saturationScale(d.count)})`}
                                    /><title>{`
                                Event Id : ${d.index}\nTimepoint : ${d.time.length > 1 ? `${d.time[0]} - ${d.time[d.time.length - 1]}` : `${d.time}`} ms\nElectrodes : ${d.count}
                                `}</title>
                                </g>
                            );
                        })
                }
            </g>
        </g>
    );
}