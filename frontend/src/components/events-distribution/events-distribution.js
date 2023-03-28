import * as d3 from "d3";
// import { useRef, useEffect, useState } from "react";
import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import { AxisLeft } from "../../CommonComponents/AxisLeft";

import dataRegistry from "../../data/dataRegistry.json"

/**
 * See EventBarViewer for definition of EventDatum
 * data: EventDatum[]
 */

const containerProps = {
  useZoom: false,
  ml: 75,
  mr: 20,
  mb: 40,
  mt: 10,
};
const countAccessor = (d) => d.count;

export const EventsDistribution = ({ data, id, currentSample, setBarThreshold }) => {
  const maxBin = dataRegistry[id].maxEvent;

  return (
    <ChartContainer {...containerProps}>
      <ChartWrapper data={data} maxBin={maxBin} currentSample={currentSample} setBarThreshold={setBarThreshold} />
    </ChartContainer>
  );
};

const ChartWrapper = ({ data, maxBin, currentSample, setBarThreshold }) => {
  // console.log(data)
  const dimensions = useChartContext();
  const bin = d3.bin(); //.thresholds(thresholds);

  // originally for handling several lines, each with its own distribution
  let lines = [];

  let extent = [];
  for (let ev in data) {
    const distribution = data[ev].map((el) => countAccessor(el));
    const binnedData = bin(distribution);
    extent.push(d3.max(binnedData, (d) => d.length))
    lines.push({ bins: binnedData, sample: ev });

  }
  const xScale = d3
    .scaleLinear()
    .range([0, dimensions.boundedWidth])
    .nice()
    .domain([0, maxBin]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(extent)])
    .nice()
    .range([dimensions.boundedHeight, 0]);

  const line = (data) =>
    d3
      .line()
      .x((d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .y((d) => yScale(d.length))
      .curve(d3.curveMonotoneX)(data);


  const handleBrushEnd = (event) => {

    const [x1, x2] = event.selection;
    const domain = [Math.round(xScale.invert(x1)), Math.round(xScale.invert(x2))];
    setBarThreshold(domain);

    // console.log(domain)

  };

  const brush = d3.brushX()
    .extent([[0, 0], [dimensions.boundedWidth, dimensions.boundedHeight]])
    .on('end', handleBrushEnd);


  const yTicks = yScale.ticks();
  const tickValues = [yTicks[0], yTicks[Math.floor(yTicks.length / 4)], yTicks[Math.floor(yTicks.length / 2)], yTicks[Math.floor(yTicks.length * 3 / 4)], yTicks[yTicks.length - 1]];
  return (
    <>
      {lines.length > 0 &&
        lines.map((el, i) => (
          <path
            key={`line-${i}`}
            d={line(el.bins)}
            fill={"none"}
            stroke={el.sample === currentSample ? "orange" : 'grey'}
            strokeOpacity={1}
            strokeWidth={2}
          />
        ))}
      <g ref={node => d3.select(node).call(brush)}>
      </g>
      <text
        // className="axis-label"
        textAnchor="middle"
        transform={`translate(${dimensions.boundedWidth - 50}, ${10} )`}
      >
        {"Brush to filter"}
      </text>
      <AxisLeft
        xScale={xScale} yScale={yScale} scaleOffset={10}
        ticks={tickValues}
      />
      <text
        // className="axis-label"
        textAnchor="middle"
        transform={`translate(${-(containerProps.mb + containerProps.mr)}, ${dimensions.boundedHeight / 2} )rotate(-90)`}
      >
        {"# of Events"}
      </text>
      <AxisBottom
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
        innerHeight={dimensions.boundedHeight}
      />
      <text
        // className="axis-label"
        textAnchor="middle"
        transform={`translate(${(dimensions.boundedWidth / 2 + containerProps.mr)}, ${dimensions.boundedHeight + containerProps.mb} )`}
      >
        {"Activated Electrode Count"}
      </text>
    </>
  );
};
