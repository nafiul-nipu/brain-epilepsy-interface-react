import * as d3 from "d3";

import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import "./event-bar-viewer.css";

/*
interface ElectronDatum {
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
  mb: 70,
  mt: 10,
};

const countAccessor = (d) => d.count;

export const EventBarViewer = (props) => {
  return (
    <ChartContainer {...containerProps}>
      <Wrapper {...props} />
    </ChartContainer>
  );
};

const Wrapper = ({ data, threshold, onClickEvent }) => {
  const dimensions = useChartContext();
  const yMax = d3.max(data, countAccessor);
  const xScale = d3
    .scaleLinear()
    .range([0, dimensions.boundedWidth])
    .domain([0, data.length])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const handleOnLineClick = (eventDatum) => {
    d3.selectAll(".eventLine").attr("stroke", "grey");
    d3.selectAll(`#ev_${eventDatum.index}`).attr("stroke", "green");

    let arrIdex = data.findIndex((x) => x.index === eventDatum.index);
    d3.select(".referenceCircle").attr("id", `${arrIdex}`);
    onClickEvent(eventDatum);
  };

  return (
    <>
      {data
        .filter((el) => countAccessor(el) >= threshold)
        .map((d, i) => (
          <g key={d.index}>
            <line
              className="eventLine"
              id={`ev_${d.index}`}
              x1={xScale(d.index)}
              y1={yScale(0)}
              x2={xScale(d.index)}
              y2={yScale(countAccessor(d))}
              stroke="grey"
              onClick={() => handleOnLineClick(d)}
            />
          </g>
        ))}
      {/* TODO: remove this hack*/}
      <circle
        className="referenceCircle"
        id="null"
        cx={dimensions.boundedWidth}
        cy={dimensions.boundedHeight}
        r={0}
        fill={"red"}
      ></circle>
      <AxisBottom
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
        innerHeight={dimensions.boundedHeight}
      />
    </>
  );
};
