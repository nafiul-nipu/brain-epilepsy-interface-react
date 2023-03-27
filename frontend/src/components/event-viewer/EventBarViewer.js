import * as d3 from "d3";

import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";
// import { AxisBottom } from "../../CommonComponents/AxisBottom";
import "./event-bar-viewer.css";
import { AxisLeft } from "../../CommonComponents/AxisLeft";
// import { useState } from "react";

/*
interface EventDatum {
  index: number          // unique id
  count: number          // number of electrodes in event
  electrode: number[]    // ids of electrodes
  time: number[]         // time of activation per eletrode id
}

interface EventBarViewerProps {
  data: EventDatum[]  
}
*/

const containerProps = {
  useZoom: false,
  ml: 45,
  mr: 90,
  mb: 110,
  mt: 10,
};

const countAccessor = (d) => d.count;

export const EventBarViewer = (props) => {
  const xMax = d3.max(props.data, countAccessor);
  // console.log(xMax)

  return (
    <>
      <ChartContainer {...containerProps}>
        <Wrapper {...props} xMax={xMax} />
      </ChartContainer>
    </>
  );
};

const Wrapper = ({ data, onClickEvent, xMax, threshold }) => {
  const dimensions = useChartContext();

  let yTicks;
  let yScale;

  // if threshold is 30 and above use point scale
  //else use linear scale
  if (threshold[0] >= 30) {
    const filteredEntries = Object.entries(data).filter(([key, value]) => value.count >= threshold[0] && value.count <= threshold[1]);
    const indexArrays = filteredEntries.map(([key, value]) => value.index);
    yScale = d3
      .scalePoint()
      // .range([dimensions.boundedHeight, 0])
      .range([0, dimensions.boundedHeight])
      .domain(indexArrays)

    yTicks = indexArrays
  } else {
    yScale = d3
      .scaleLinear()
      // .range([dimensions.boundedHeight, 0])
      .range([0, dimensions.boundedHeight])
      .domain([0, data.length])

    yTicks = yScale.ticks()

  }

  const xScale = d3
    .scaleLinear()
    .range([0, dimensions.boundedWidth])
    .domain([0, xMax])
  // .nice();

  // .nice();

  const handleOnLineClick = (eventDatum) => {
    d3.selectAll(".eventLine").attr("stroke", "grey");
    d3.selectAll(".eventLineCircle").attr("fill", "grey");
    d3.selectAll(`#ev_${eventDatum.index}`).attr("stroke", "#FFA500");
    d3.selectAll(`#ev_circle_${eventDatum.index}`).attr("fill", "#FFA500"); //rgb(255,165,0)


    d3.select(d3.select(`#ev_${eventDatum.index}`).node().parentNode).raise();

    let arrIdex = data.findIndex((x) => x.index === eventDatum.index);
    d3.select(".referenceCircle").attr("id", `${arrIdex}`);
    d3.select(".referenceCircleNetwork").attr("id", `${arrIdex}`);
    onClickEvent(eventDatum);
  };

  // console.log(data)

  return (
    <>
      {data
        .filter((el) => countAccessor(el) >= threshold[0] && countAccessor(el) <= threshold[1])
        .map((d, i) => (
          <g key={d.index}>
            <line
              className="eventLine"
              id={`ev_${d.index}`}
              x1={xScale(0)}
              y1={yScale(d.index)}
              x2={xScale(countAccessor(d))}
              y2={yScale(d.index)}
              stroke="grey"
              strokeWidth={2}
              strokeOpacity={1}
              onClick={() => handleOnLineClick(d)}
            /><title>{`
            Event Id : ${d.index}\nTimepoint : ${d.time.length > 1 ? `${d.time[0]} - ${d.time[d.time.length - 1]}` : `${d.time}`} ms\nElectrodes : ${d.count}
            `}</title>
            <circle
              className="eventLineCircle"
              id={`ev_circle_${d.index}`}
              cx={xScale(countAccessor(d))}
              cy={yScale(d.index)}
              r={3}
              fill={"grey"}
              onClick={() => handleOnLineClick(d)}
            /><title>{`
            Event Id : ${d.index}\nTimepoint : ${d.time.length > 1 ? `${d.time[0]} - ${d.time[d.time.length - 1]}` : `${d.time}`} ms\nElectrodes : ${d.count}
            `}</title>
          </g>
        ))}

      <text
        className="axis-label"
        textAnchor="middle"
        transform={`translate(${dimensions.boundedWidth + containerProps.ml}, ${10} )`}
      >
        {`Thr: ${threshold[0]} - ${threshold[1]}`}
      </text>
      <text
        // className="axis-label"
        textAnchor="middle"
        transform={`translate(${-34}, ${dimensions.boundedHeight / 2} )rotate(-90)`}
      >
        {"Event ID"}
      </text>
      <AxisLeft
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
        ticks={yTicks}
      // innerHeight={dimensions.boundedHeight}
      />
      {/* TODO: remove these hacks*/}
      <circle
        className="referenceCircle"
        id="null"
        cx={dimensions.boundedWidth}
        cy={dimensions.boundedHeight}
        r={0}
        fill={"red"}
      ></circle>
      <circle
        className="referenceCircleNetwork"
        id="null"
        cx={dimensions.boundedWidth}
        cy={dimensions.boundedHeight}
        r={0}
        fill={"red"}
      ></circle>
    </>
  );
};
