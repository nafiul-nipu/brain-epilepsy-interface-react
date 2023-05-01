import * as d3 from 'd3';
import { useState } from 'react';
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

export const LocalEvent = ({
    data,
    currentSample,
    threshold,
    domain,
    locaEventHeight,
    setSelectedEventRange,
    setEventRangeNetwork,
    rectWidth,
    roiElectrodes
}) => {
    return (
        <ChartContainer {...containerProps}>
            <ChartWrapper
                data={data}
                currentSample={currentSample}
                threshold={threshold}
                domain={domain}
                locaEventHeight={locaEventHeight}
                setSelectedEventRange={setSelectedEventRange}
                setEventRangeNetwork={setEventRangeNetwork}
                rectWidth={rectWidth}
                roiElectrodes={roiElectrodes}
            />
        </ChartContainer>
    );

};

const ChartWrapper = ({
    data,
    currentSample,
    threshold,
    domain,
    locaEventHeight,
    setSelectedEventRange,
    setEventRangeNetwork,
    rectWidth,
    roiElectrodes
}) => {
    const dimensions = useChartContext();
    const height = locaEventHeight - containerProps.mt - containerProps.mb;
    // console.log(data[currentSample])
    const xScale = d3
        .scaleLinear()
        .range([0, dimensions.boundedWidth])
        .domain(domain);


    const [rectPos, setRectPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setDragStartPos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const deltaX = event.clientX - dragStartPos.x;
            // const deltaY = event.clientY - dragStartPos.y;
            const newRectX = rectPos.x + deltaX;
            if (newRectX >= 0 && newRectX <= dimensions.boundedWidth - xScale(rectWidth)) {
                setRectPos({ x: newRectX });
                setDragStartPos({ x: event.clientX });
            }
        }
    };

    const handleMouseUp = () => {
        // console.log("rectpos", rectPos.x, "rectpost invert", xScale.invert(rectPos.x));
        // console.log("rectwidth", rectWidth, "scale rectWitdh", xScale(rectWidth))
        // console.log("rectpos + rect Width Invert", xScale.invert(rectPos.x + xScale(rectWidth)))
        setIsDragging(false);
        setSelectedEventRange([Math.round(xScale.invert(rectPos.x)), Math.round(xScale.invert(rectPos.x)) + rectWidth]);
        setEventRangeNetwork([Math.round(xScale.invert(rectPos.x)), Math.round(xScale.invert(rectPos.x)) + rectWidth]);
    };
    return (
        <g onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
            <rect x={0} y={0} width={dimensions.boundedWidth} height={height} fill="#DDDCDC" />
            <rect
                x={rectPos.x}
                y={rectPos.y}
                width={xScale(domain[0] + rectWidth)}
                height={dimensions.boundedHeight}
                fill="red"
                opacity={0.5}
                onMouseUp={handleMouseUp}
            />
            <g>
                {
                    data[currentSample]
                        .filter(el => {
                            // console.log(el)
                            if (roiElectrodes === null) {
                                return true; // include all elements if roiElectrodes is null
                            }

                            return el.electrode.some(elem => roiElectrodes.includes(elem));
                        })
                        .filter((el) => countAccessor(el) >= threshold[0] && countAccessor(el) <= threshold[1])
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

        </g>
    );

};