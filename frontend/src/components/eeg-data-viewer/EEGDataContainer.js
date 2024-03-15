import { EEGDataViewer } from "./EEGDataViewer";
import { useEffect, useState } from "react";
import { fetchEEGperPatient } from "../../api";

const timeWindow = 10000;
const samples = ['sample1', 'sample2', 'sample3']
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
    <>
      {eegData &&
        <EEGDataViewer
          sampleName={patient.sample}
          eegData={eegData}
          xTicks={[startTime, startTime + timeWindow]}
          electrodeList={electrodeList}
          show={viewColor}
          patchLabels={
            electrodeData.reduce((result, obj) =>
              ({ ...result, [obj.electrode_number]: obj.label }), {})
          }
          regionLabels={electrodeData.reduce((result, obj) => ({ ...result, [obj.electrode_number]: obj.region }), {})}
          communityObj={communityData[topPercent][samples.indexOf(sampleName)] !== undefined ?
            Object.assign({}, ...communityData[topPercent][samples.indexOf(sampleName)].communities.map(({ community, members }) => Object.fromEntries(members.map(value => [value, community]))))
            : null
          }
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
