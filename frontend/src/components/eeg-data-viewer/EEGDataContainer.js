import { EEGDataViewer } from "./EEGDataViewer";
import { useEffect, useState } from "react";
import { fetchEEGperPatient } from "../../api";
import ChartContainer, { useChartContext } from "../chart-container/chart-container";
import { AxisBottom } from "../../CommonComponents/AxisBottom";

import * as d3 from "d3";

const containerProps = {
  useZoom: false,
  ml: 50,
  mr: 20,
  mb: 10,
  mt: 10,
};

export const EEGDataContainer = ({
  allEventData,
  patient,
  selectedEventRange,
  eegPanelRange,
  electrodeListEventWindow,
  eegInBrain,
  setEegInBrain
}) => {
  const [eegData, seteegData] = useState(null);
  const [dataViewer, setDataViewer] = useState(null);

  useEffect(() => {
    // console.log(electrodeListEventWindow)
    async function fetchData() {
      const { data, error } = await fetchEEGperPatient(
        patient.id,
        patient.sample,
        eegPanelRange[0],
        500,
        electrodeListEventWindow
      );
      // TODO: if error do something
      seteegData(data);

      const filteredData = allEventData[patient.sample].filter((el) =>
        el.time.some(
          (t) => t >= selectedEventRange[0] && t <= selectedEventRange[1]
        )
      );

      const electrodeList = [
        ...new Set(
          filteredData.reduce((acc, cur) => acc.concat(cur.electrode), [])
        ),
      ];

      const eventList = filteredData.map((el) => el.index);

      setDataViewer({
        eventList: eventList,
        electrodeList: electrodeList,
      });
    }
    fetchData();
  }, [
    allEventData,
    eegPanelRange,
    electrodeListEventWindow,
    patient,
    selectedEventRange,
  ]);

  const eegList = eegData ? Object.keys(eegData.eeg).map(Number).sort() : [];

  return (
    <>
      {electrodeListEventWindow.length > 0 && electrodeListEventWindow.length === eegList.length &&
        electrodeListEventWindow
          .sort()
          .every((value, index) => value === eegList[index]) ? (
        <EEGDataViewer
          eegData={eegData}
          eventList={dataViewer.eventList}
          electrodeListEventWindow={electrodeListEventWindow}
          electrodeList={dataViewer.electrodeList}
          xTicks={eegPanelRange}
          selectedEventRange={selectedEventRange}
          eegInBrain={eegInBrain}
          setEegInBrain={setEegInBrain}
        />
      ) : null}
      <div 
        style={{width: "100%", height: "5vh", backgroundColor:"white"}}

      >
        <ChartContainer {...containerProps}>
            <CommonAxisWrapper
              xTicks={eegPanelRange}
            />
          </ChartContainer>
      </div>
    </>
  );
};


const CommonAxisWrapper = ({xTicks}) => {
  const dimensions = useChartContext();
  const xScale = d3.scaleLinear()
    .domain([0, 500])
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, dimensions.boundedHeight])

  const xtickvalues = Array.from({ length: 6 }, (_, i) => 0 + i * (500 / 5));

  const xTickText = Array.from({ length: 6 }, (_, i) => xTicks[0] + i * ((xTicks[1] - xTicks[0]) / 5));

  return(
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
