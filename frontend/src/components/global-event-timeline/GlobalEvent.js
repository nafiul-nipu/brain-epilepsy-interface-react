import * as d3 from "d3";
import { useState } from "react";

import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";

import dataRegistry from "../../data/dataRegistry.json";
import "./global-events.css";

const containerProps = {
  useZoom: false,
  ml: 0,
  mr: 0,
  mb: 0,
  mt: 0,
};

const countAccessor = (d) => d.count;

export const GlobalEvent = ({
  data,
  id,
  currentSample,
  threshold,
  rectWidth,
  setLocalEventDomain,
  roiElectrodes,
  maxTime,
  setEegInBrain
}) => {
  // console.log(roiElectrodes)
  return (
    <div style={{ width: "100%" }}>
      <div className="global-event-title-bar">
        <div className="event-bar-title">Global Event Timeline</div>
        <div className="event-bar-title">{`${maxTime} ms`}</div>
      </div>
      <div className="global-event-container">
        <ChartContainer {...containerProps}>
          <ChartWrapper
            data={data}
            id={id}
            currentSample={currentSample}
            threshold={threshold}
            rectWidth={rectWidth}
            setLocalEventDomain={setLocalEventDomain}
            roiElectrodes={roiElectrodes}
            setEegInBrain={setEegInBrain}
          />
        </ChartContainer>
      </div>
    </div>
  );
};

const ChartWrapper = ({
  data,
  id,
  currentSample,
  threshold,
  rectWidth,
  setLocalEventDomain,
  roiElectrodes,
  setEegInBrain
}) => {
  // console.log(dataRegistry[id].time)
  const dimensions = useChartContext();
  const xScale = d3
    .scaleLinear()
    .range([0, dimensions.boundedWidth])
    .domain([0, dataRegistry[id].time]);

  const saturationScale = d3
    .scaleLinear()
    .range([0, 1])
    .domain([0, d3.max(data[currentSample], (d) => d.count)]);

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
      if (
        newRectX >= 0 &&
        newRectX <= dimensions.boundedWidth - xScale(rectWidth)
      ) {
        setRectPos({ x: newRectX });
        setDragStartPos({ x: event.clientX });
      }
    }
  };

  const handleMouseUp = () => {
    // console.log(rectPos.x, xScale.invert(rectPos.x), xScale.invert(rectPos.x + xScale(rectWidth)));
    setIsDragging(false);
    setLocalEventDomain([
      Math.round(xScale.invert(rectPos.x)),
      Math.round(xScale.invert(rectPos.x + xScale(rectWidth))),
    ]);
    setEegInBrain(null)
  };

  return (
    <g onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
      {/* <text x={0} y={10} textAnchor="middle" fontSize="12px">Global Timeline</text> */}
      <rect
        x={0}
        y={0}
        width={dimensions.boundedWidth}
        height={dimensions.boundedHeight}
        fill="#DDDCDC"
      />
      <g>
        {data[currentSample]
          .filter((el) => {
            // console.log(el)
            if (roiElectrodes === null) {
              return true; // include all elements if roiElectrodes is null
            }

            return el.electrode.some((elem) => roiElectrodes.includes(elem));
          })
          .filter(
            (el) =>
              countAccessor(el) >= threshold[0] &&
              countAccessor(el) <= threshold[1]
          )
          .map((d, i) => {
            return (
              <g key={i}>
                <rect
                  key={i}
                  x={d.time.length > 1 ? xScale(d.time[0]) : xScale(d.time)}
                  y={0}
                  width={
                    d.time.length > 1
                      ? xScale(d.time[d.time.length - 1]) - xScale(d.time[0])
                      : 1
                  }
                  // width={yScale(d.count)}
                  height={dimensions.boundedHeight}
                  fill={"orange"}
                // filter={`saturate(${saturationScale(d.count)})`}
                />
                <title>{`
                                Event Id : ${d.index}\nTimepoint : ${d.time.length > 1
                    ? `${d.time[0]} - ${d.time[d.time.length - 1]}`
                    : `${d.time}`
                  } ms\nElectrodes : ${d.count}
                                `}</title>
              </g>
            );
          })}
      </g>

      <rect
        x={rectPos.x}
        y={rectPos.y}
        width={xScale(rectWidth)}
        height={dimensions.boundedHeight}
        fill="red"
        opacity={0.5}
        onMouseUp={handleMouseUp}
      />
    </g>
  );
};
