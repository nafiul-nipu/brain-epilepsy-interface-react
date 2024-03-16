import { EEGDataViewer } from "./EEGDataViewer";
import { useEffect, useState } from "react";
import { fetchEEGperPatient } from "../../api";
import ChartContainer, { useChartContext } from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";

import * as d3 from "d3";


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
  eegList
}) => {
  const [eegData, seteegData] = useState(null);
  const [startTime, setstartTime] = useState(0)

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
    <>
      <div style={{ width: "100%", height: "5vh", backgroundColor: "white" }}>
        <ChartContainer {...containerProps}>
          <CommonAxisWrapper
            xTicks={[startTime, startTime + timeWindow]}
            timeWindow={timeWindow}
          />
        </ChartContainer>
      </div>

      {eegData &&
        <EEGDataViewer
          sampleName={patient.sample}
          eegData={eegData}
          xTicks={[startTime, startTime + timeWindow]}
          electrodeList={electrodeList}
          electrodeName={electrodeName}
          eegInBrain={eegInBrain}
          setEegInBrain={setEegInBrain}
          timeToFecth={timeToFecth}
          timeWindow={timeWindow}
          eegList={eegList}
        />
      }
    </>
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
