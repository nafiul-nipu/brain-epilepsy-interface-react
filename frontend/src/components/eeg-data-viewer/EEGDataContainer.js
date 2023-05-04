import { EEGDataViewer } from "./EEGDataViewer";
import { useFetchEEG } from "../../library/useFetch";

export const EEGDataContainer = ({
    allEventData,
    patient,
    selectedEventRange,
    eegPanelRange
}) => {

    const filteredData = allEventData[patient.sample]
        .filter((el) => el.time.some(t => t >= selectedEventRange[0] && t <= selectedEventRange[1]))

    const electrodeList = [...new Set(filteredData.reduce((acc, cur) => acc.concat(cur.electrode), []))];

    const strElectrode = electrodeList.toString()
    console.log(strElectrode)
    const eegData = useFetchEEG({
        patientid: patient.id,
        sample: patient.sample,
        start: parseInt(eegPanelRange[0]),
        num_records: parseInt(500),
        electrodes: strElectrode

    })

    // console.log(eegData)

    const eventList = filteredData.map((el) => el.index);

    const filteredDataForEventWindow = allEventData[patient.sample]
        .filter((el) => el.time.some(t => t >= eegPanelRange[0] && t <= eegPanelRange[1]))

    const electrodeListEventWindow = [...new Set(filteredDataForEventWindow.reduce((acc, cur) => acc.concat(cur.electrode), []))];

    return (
        <EEGDataViewer
            data={allEventData}
            selectedEventRange={selectedEventRange}
            currentSample={patient.sample}
            eegPanelRange={eegPanelRange}
        />
    )
}