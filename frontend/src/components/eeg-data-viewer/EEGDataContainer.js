import { EEGDataViewer } from "./EEGDataViewer";
import { useEffect, useState } from "react";
import { fetchEEGperPatient } from "../../api";
import ChartContainer, { useChartContext } from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";

import * as d3 from "d3";

import "./eeg-data-viewer.css";


const timeWindow = 10000;

const containerProps = {
  useZoom: false,
  ml: 50,
  mr: 25,
  mb: 0,
  mt: 0,
};

export const EEGDataContainer = ({
  patient,
  electrodeList,
  electrodeName,
  eegInBrain,
  setEegInBrain,
  eegList,
  viewColor,
  electrodeData,
  communityData,
  topPercent,
  sampleName
}) => {
  const [eegData, seteegData] = useState(null);
  const [startTime, setstartTime] = useState(0);

  const timeToFecth = (buttonPressed) => {
    if (buttonPressed === 'next') {
      setstartTime(startTime + timeWindow)
    } else if (buttonPressed === 'prev') {
      if (startTime - timeWindow > 0) {
        setstartTime(startTime - timeWindow)
      } else {
        setstartTime(0)
      }
    }
  }

  useEffect(() => {
    // console.log(electrodeListEventWindow)
    async function fetchData() {
      const { data, error } = await fetchEEGperPatient(
        patient.id,
        patient.sample,
        startTime,  // time start next timeWindow prev
        timeWindow  // range
      );
      // TODO: if error do something
      seteegData(data);
      // console.log(data)

    }
    fetchData();
  }, [
    startTime,
    patient
  ]);

  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div title="Previous" onClick={() => timeToFecth('prev')}><TbPlayerTrackPrevFilled /></div>
        <div><strong>EEGs</strong> <span>{patient.sample}</span></div>
        <div title="Next" onClick={() => timeToFecth('next')}><TbPlayerTrackNextFilled /></div>
      </div>
      <div style={{ width: "100%", height: "4vh", backgroundColor: "white" }}>
        <ChartContainer {...containerProps}>
          <CommonAxisWrapper
            xTicks={[startTime, startTime + timeWindow]}
            timeWindow={timeWindow}
          />
        </ChartContainer>
      </div>
      <div>
        {eegData &&
          <EEGDataViewer
            eegData={eegData}
            xTicks={[startTime, startTime + timeWindow]}
            electrodeList={electrodeList}
            electrodeName={electrodeName}
            eegInBrain={eegInBrain}
            setEegInBrain={setEegInBrain}
            timeWindow={timeWindow}
            eegList={eegList}
          />
        }
      </div>
    </div>
  );
};



const CommonAxisWrapper = ({ xTicks, timeWindow }) => {
  const dimensions = useChartContext();
  const xScale = d3.scaleLinear()
    .domain([0, timeWindow])
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, dimensions.boundedHeight])

  const xTickText = Array.from({ length: 6 }, (_, i) => xTicks[0] + i * ((xTicks[1] - xTicks[0]) / 5));
  // console.log(xTickText)
  const xtickvalues = Array.from({ length: 6 }, (_, i) => 0 + i * (timeWindow / 5));
  return (
    <g>
      <text
        x={-containerProps.ml + 12}
        y={dimensions.boundedHeight / 2 - 10}
      ><tspan x={-containerProps.ml + 12} y={dimensions.boundedHeight / 2 - 17} dy=".6em">Time</tspan>
        <tspan x={-containerProps.ml + 12} y={dimensions.boundedHeight / 2 - 10} dy="1.2em">(ms)</tspan></text>
      <AxisBottom
        xScale={xScale}
        yScale={yScale}
        scaleOffset={5}
        innerHeight={-35}
        textPosition={3.85}
        ticks={xtickvalues}
        tickText={xTickText}
      />
    </g>

  )
};
