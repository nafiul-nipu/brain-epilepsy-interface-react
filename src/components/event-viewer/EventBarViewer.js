import * as d3 from "d3";

import ChartContainer, {
  useChartContext,
} from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";

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

export const EventBarViewer = ({ data }) => {
  return (
    <ChartContainer {...containerProps}>
      <Wrapper data={data} />
    </ChartContainer>
  );
};

const Wrapper = ({ data }) => {
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

  return (
    <>
      {data.map((d, i) => (
        <g>
          <line
            x1={xScale(i)}
            y1={yScale(0)}
            x2={xScale(i)}
            y2={yScale(countAccessor(d))}
            stroke="grey"
          />
        </g>
      ))}
      <AxisBottom
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
        innerHeight={dimensions.boundedHeight}
      />
    </>
  );
};
