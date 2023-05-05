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
  mb: 35,
  mt: 0,
};

export const EEGDataViewer = ({
  eegData,
  eventList,
  electrodeListEventWindow,
  electrodeList,
  xTicks
}) => {

  const extents = Object.keys(eegData.eeg)
    .map(key => [Math.min(...eegData.eeg[key]), Math.max(...eegData.eeg[key])])
    .flat();

  const absMax = Math.max(...extents.map(Math.abs));

  const yDomain = [-absMax, absMax];

  console.log(extents)
  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div>EEGs </div>
        <div className="referenceDIV" id="null"></div>
        <div>Event {!eventList ? "loading" : `${eventList}`}</div>
      </div>

      <div className="eeg-list">
        {
          electrodeListEventWindow.map((el, i) => {
            return (
              <div style={{ height: '15vh' }} key={i}>
                <div className="electrodeEEGNameDiv">{`E${el}`} </div>
                <ChartContainer {...containerProps} key={i}>
                  <EEGChartWrapper
                    data={eegData.eeg[el]}
                    electrodeList={electrodeList}
                    currenElectrode={el}
                    yDomain={yDomain}
                    xTicks={xTicks}
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


const EEGChartWrapper = ({ data, electrodeList, currenElectrode, yDomain, xTicks }) => {
  // console.log(currenElectrode)

  // console.log(data)

  console.log(xTicks)
  const dimensions = useChartContext();

  const xScale = d3.scaleLinear()
    .domain([0, 500])
    .range([0, dimensions.boundedWidth])

  const yLineScale = d3.scaleLinear()
    .domain(yDomain)
    .range([dimensions.boundedHeight, 0])

  const yTicks = yLineScale.ticks();
  const tickValues = [yTicks[0], yTicks[Math.floor(yTicks.length * 2 / 4)], yTicks[yTicks.length - 1]];

  const xTickText = Array.from({ length: 6 }, (_, i) => xTicks[0] + i * ((xTicks[1] - xTicks[0]) / 5));
  // console.log(xTickText)
  const xtickvalues = Array.from({ length: 6 }, (_, i) => 0 + i * (500 / 5));

  return (
    <g>
      <LinePlot
        data={data}
        xScale={xScale}
        yLineScale={yLineScale}
        colorChecker={electrodeList}
        curr={currenElectrode}
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
        ticks={xtickvalues}
        tickText={xTickText}
      />
    </g>
  )
}
