import { EEGDataViewer } from "./EEGDataViewer";
import { useEffect, useState } from "react";
import { fetchEEGperPatient } from "../../api";

export const EEGDataContainer = ({
  allEventData,
  patient,
  selectedEventRange,
  eegPanelRange,
  electrodeListEventWindow,
}) => {
  const [eegData, seteegData] = useState(null);
  const [dataViewer, setDataViewer] = useState(null);

  useEffect(() => {
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
      {electrodeListEventWindow.length === eegList.length &&
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
        />
      ) : null}
    </>
  );
};
