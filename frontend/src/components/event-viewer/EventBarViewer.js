import * as d3 from "d3";

import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import "./event-bar-viewer.css";
import { AxisLeft } from "../../CommonComponents/AxisLeft";
import { useState } from "react";

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

  const [threshold, setThreshold] = useState(10);

  const thresholds = Array.from({ length: xMax / 5 + 1 }, (_, i) => i * 5);

  const onThresholdChange = (event) => {
    setThreshold(event.target.value)
  }

  return (
    <>
      <select value={threshold} onChange={onThresholdChange} className='threshSel'>
        {
          thresholds.map((thres, index) => {
            return (
              <option key={index} value={thres}>{`Th: ${thres}`}</option>
            )
          })
        }
      </select>
      <ChartContainer {...containerProps}>
        <Wrapper {...props} xMax={xMax} threshold={threshold} />
      </ChartContainer>
    </>
  );
};

const Wrapper = ({ data, onClickEvent, xMax, threshold }) => {
  const dimensions = useChartContext();

  const xScale = d3
    .scaleLinear()
    .range([0, dimensions.boundedWidth])
    .domain([0, xMax])
  // .nice();
  const yScale = d3
    .scaleLinear()
    // .range([dimensions.boundedHeight, 0])
    .range([0, dimensions.boundedHeight])
    .domain([0, data.length])
  // .nice();

  const handleOnLineClick = (eventDatum) => {
    d3.selectAll(".eventLine").attr("stroke", "grey");
    d3.selectAll(`#ev_${eventDatum.index}`).attr("stroke", "#03DAC5");
    d3.selectAll(`#ev_circle_${eventDatum.index}`).attr("fill", "#03DAC5");

    let arrIdex = data.findIndex((x) => x.index === eventDatum.index);
    d3.select(".referenceCircle").attr("id", `${arrIdex}`);
    onClickEvent(eventDatum);
  };

  // console.log(data)

  return (
    <>
      {data
        .filter((el) => countAccessor(el) >= threshold)
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
              onClick={() => handleOnLineClick(d)}
            /><title>{`
            Event Id : ${d.index}\nTimepoint : ${d.time.length > 1 ? `${d.time[0]} - ${d.time[d.time.length - 1]}` : `${d.time}`} ms\nElectrodes : ${d.count}
            `}</title>
            <circle
              className="eventLine"
              id={`ev_circle_${d.index}`}
              cx={xScale(countAccessor(d))}
              cy={yScale(d.index)}
              r={2}
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
        transform={`translate(${-33}, ${dimensions.boundedHeight / 2} )rotate(-90)`}
      >
        {"Event Id"}
      </text>
      <AxisLeft
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
      // innerHeight={dimensions.boundedHeight}
      />
      {/* TODO: remove this hack*/}
      <circle
        className="referenceCircle"
        id="null"
        cx={dimensions.boundedWidth}
        cy={dimensions.boundedHeight}
        r={0}
        fill={"red"}
      ></circle>
    </>
  );
};
