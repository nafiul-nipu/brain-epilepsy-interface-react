import { EEGDataViewer } from "./EEGDataViewer";
import { useEffect, useState } from "react";
import axios from "axios";

export const EEGDataContainer = ({
    allEventData,
    patient,
    selectedEventRange,
    eegPanelRange,
    electrodeListEventWindow
}) => {

    const [eegData, seteegData] = useState(null);
    const [dataViewer, setDataViewer] = useState(null);

    // console.log("eegPanelRange", eegPanelRange, "electrodeListEventWindow", electrodeListEventWindow, "patient", patient)
    // console.log(eegPanelRange)
    useEffect(() => {
        // console.log("fetching eeg data", eegPanelRange)
        const url = `http://127.0.0.1:5000//patient/${patient.id}/eeg/${patient.sample}/${eegPanelRange[0]}/${499}/${electrodeListEventWindow.join(",")}`

        // console.log(url)
        async function fetchData() {
            try {
                const response = await axios.get(url);
                // console.log("response", response)
                seteegData(response.data);

                const filteredData = allEventData[patient.sample]
                    .filter((el) => el.time.some(t => t >= selectedEventRange[0] && t <= selectedEventRange[1]))

                const electrodeList = [...new Set(filteredData.reduce((acc, cur) => acc.concat(cur.electrode), []))];

                const eventList = filteredData.map((el) => el.index);

                setDataViewer({
                    eventList: eventList,
                    electrodeList: electrodeList
                })

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();

    }, [allEventData, eegPanelRange, electrodeListEventWindow, patient, selectedEventRange])

    // console.log(eegData)
    // console.log(dataViewer)

    const eegList = eegData ? Object.keys(eegData.eeg).map(Number).sort() : [];

    return (
        <>
            {
                (electrodeListEventWindow.length === eegList.length && electrodeListEventWindow.sort().every((value, index) => value === eegList[index])) ? (
                    <EEGDataViewer
                        eegData={eegData}
                        eventList={dataViewer.eventList}
                        electrodeListEventWindow={electrodeListEventWindow}
                        electrodeList={dataViewer.electrodeList}
                        xTicks={eegPanelRange}
                    />
                ) : null
            }
        </>

    )
}

