import { LinePlot } from "../../CommonComponents/LinePlot";
import ChartContainer, { useChartContext } from "../chart-container/chart-container";
import "./eeg-data-viewer.css";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import { AxisLeft } from "../../CommonComponents/AxisLeft";
import * as d3 from "d3";

const containerProps = {
  useZoom: false,
  ml: 50,
  mr: 20,
  mb: 30,
  mt: 0,
};

export const EEGDataViewer = ({
  data,
  selectedEventRange,
  currentSample,
}) => {
  const filteredData = data[currentSample]
    .filter((el) => el.time.some(t => t >= selectedEventRange[0] && t <= selectedEventRange[1]))

  const electrodeList = [...new Set(filteredData.reduce((acc, cur) => acc.concat(cur.electrode), []))];

  // console.log(electrodeList)

  const eventList = filteredData.map((el) => el.index);

  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div>EEGs </div>
        <div className="referenceDIV" id="null"></div>
        <div>Event {!eventList ? "loading" : `${eventList}`}</div>
      </div>

      <div className="eeg-list">
        {
          electrodeList.map((el, i) => {
            return (
              <div style={{ height: '10vh' }} key={i}>
                <ChartContainer {...containerProps} key={i}>
                  <EEGChartWrapper
                    data={electrodeList}
                  />
                </ChartContainer>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};


const EEGChartWrapper = ({ data }) => {

  const dimensions = useChartContext();

  const xScale = d3.scaleLinear()
    .domain([0, 500])
    .range([0, dimensions.boundedWidth])

  const yLineScale = d3.scaleLinear()
    .domain([0, 101])
    .range([dimensions.boundedHeight, 0])

  const yTicks = yLineScale.ticks();
  const tickValues = [yTicks[0], yTicks[Math.floor(yTicks.length * 2 / 4)], yTicks[yTicks.length - 1]];


  return (
    <g>
      <LinePlot
        data={Array.from({ length: 500 }, () => Math.floor(Math.random() * 101))}
        xScale={xScale}
        yLineScale={yLineScale}
      />
      <AxisLeft
        xScale={xScale} yScale={yLineScale} scaleOffset={10}
        ticks={tickValues}
        textPosition={2.85}
      />
      <AxisBottom
        xScale={xScale}
        yScale={yLineScale}
        scaleOffset={5}
        innerHeight={dimensions.boundedHeight}
        textPosition={3.85}
      />
    </g>
  )
}
