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
  mt: 10,
};

export const EEGDataViewer = ({
  eegData,
  eventList,
  electrodeListEventWindow,
  electrodeList,
  xTicks,
  selectedEventRange,
  eegInBrain,
  setEegInBrain
}) => {
  // console.log(eegData)
  // console.log(selectedEventRange)

  const extents = Object.keys(eegData.eeg)
    .map(key => [Math.min(...eegData.eeg[key]), Math.max(...eegData.eeg[key])])
    .flat();

  const absMax = Math.max(...extents.map(Math.abs));

  const yDomain = [-absMax, absMax];
  // const yDomain = [-2000, 2000];

  const peakIndex = d3.scaleLinear()
    .domain(xTicks)
    .range([0, 500])

  function onEEGClick(el) {
    // console.log(el)
    setEegInBrain(el)
  }

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
              <div
                style={{
                  height: '12vh',
                  boxShadow: eegInBrain === el ? "0 0 10px 5px #000000" : "none"
                }}
                key={i}
                onClick={() => onEEGClick(el)}
              >
                {/* <div className="electrodeEEGNameDiv">{`E${el}`} </div> */}
                <ChartContainer {...containerProps} key={i}>
                  <EEGChartWrapper
                    data={eegData.eeg[el]}
                    electrodeList={electrodeList}
                    currenElectrode={el}
                    yDomain={yDomain}
                    xTicks={xTicks}
                    peaks={eegData.peaks[el] ? eegData.peaks[el] : []}
                    peakIndex={peakIndex}
                    selectedEventRange={selectedEventRange}
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


const EEGChartWrapper = ({ data, electrodeList, currenElectrode, yDomain, xTicks, peaks, peakIndex, selectedEventRange }) => {
  // console.log(currenElectrode)

  // console.log(data)

  // console.log(xTicks)
  const dimensions = useChartContext();

  const xScale = d3.scaleLinear()
    .domain([0, 500])
    .range([0, dimensions.boundedWidth])

  const yLineScale = d3.scaleLinear()
    .domain(yDomain)
    .range([dimensions.boundedHeight, 0])

  const yTicks = yLineScale.ticks();
  const tickValues = [yTicks[0], yTicks[yTicks.length - 1]];

  const xTickText = Array.from({ length: 6 }, (_, i) => xTicks[0] + i * ((xTicks[1] - xTicks[0]) / 5));
  // console.log(xTickText)
  const xtickvalues = Array.from({ length: 6 }, (_, i) => 0 + i * (500 / 5));



  return (
    <g>
      <text
        x={-containerProps.ml + 10}
        y={dimensions.boundedHeight / 2}
      >E{currenElectrode}</text>
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

      {
        selectedEventRange ? (
          <g>
            <rect
              x={xScale(peakIndex(selectedEventRange[0] - 1))}
              y={0}
              width={selectedEventRange[selectedEventRange.length - 1] - selectedEventRange[0] === 0 ? 1 :
                xScale(peakIndex(selectedEventRange[selectedEventRange.length - 1] - 1) - peakIndex(selectedEventRange[0] - 1))}
              height={dimensions.boundedHeight}
              fill="red"
              opacity={0.2}
            /><title>{`Time: ${selectedEventRange[0]} - ${selectedEventRange[selectedEventRange.length - 1]}`}</title>
          </g>
        ) : null
      }
      {
        peaks.map((el, i) => {
          // console.log(peakIndex(el.time))
          return (
            <g key={i}>
              <circle
                key={i}
                cx={xScale(peakIndex(el.time) - 1)}
                cy={yLineScale(data[peakIndex(el.time) - 1])}
                r={4}
                fill="red"
              /><title>{`Time: ${el.time}`}</title>
            </g>
          )
        })
      }
    </g>
  )
}
