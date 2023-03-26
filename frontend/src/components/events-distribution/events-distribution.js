import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import { AxisLeft } from "../../CommonComponents/AxisLeft";

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

export const EventsDistribution = ({ data, barThreshold, setBarThreshold }) => {
  const distribution = data.map((el) => countAccessor(el));

  return (
    <ChartContainer {...containerProps}>
      <ChartWrapper data={distribution} barThreshold={barThreshold} setBarThreshold={setBarThreshold} />
    </ChartContainer>
  );
};

const ChartWrapper = ({ data, barThreshold, setBarThreshold }) => {
  const dimensions = useChartContext();
  const bin = d3.bin(); //.thresholds(thresholds);

  // originally for handling several lines, each with its own distribution
  let lines = [];

  // get binned data and largest bin
  const binnedData = bin(data);
  const maxBin = d3.max(binnedData, (d) => d.length);
  lines.push({ bins: binnedData });

  const xScale = d3
    .scaleLinear()
    .range([0, dimensions.boundedWidth])
    .nice()
    .domain(d3.extent(data, (d) => d));
  const yScale = d3
    .scaleLinear()
    .domain([0, maxBin])
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



  return (
    <>
      {lines.length > 0 &&
        lines.map((el, i) => (
          <path
            key={`line-${i}`}
            d={line(el.bins)}
            fill={"none"}
            stroke={"orange"}
            strokeOpacity={1}
            strokeWidth={2}
          />
        ))}
      <g ref={node => d3.select(node).call(brush)}>
      </g>
      <AxisLeft
        xScale={xScale} yScale={yScale} scaleOffset={10}
        ticks={yScale.ticks()}
      />
      <AxisBottom
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
        innerHeight={dimensions.boundedHeight}
      />
    </>
  );
};
