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
  patient,
  electrodeList,
  eegInBrain,
  setEegInBrain
}) => {
  const [eegData, seteegData] = useState(null);
  const [startTime, setstartTime] = useState(0)

  const timeToFecth = (buttonPressed) => {
    if (buttonPressed === 'next') {
      setstartTime(startTime + 500)
    } else if (buttonPressed === 'prev') {
      if (startTime - 500 > 0) {
        setstartTime(startTime - 500)
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
        startTime,  // time start next 500 prev
        500  // range
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

  // const eegList = eegData ? Object.keys(eegData.eeg).map(Number).sort() : [];

  return (
    <>
      {eegData &&
        <EEGDataViewer
          sampleName={patient.sample}
          eegData={eegData}
          xTicks={[startTime, startTime + 500]}
          electrodeList={electrodeList}
          eegInBrain={eegInBrain}
          setEegInBrain={setEegInBrain}
          timeToFecth={timeToFecth}
        />
      }
    </>
  );
};
