import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { sliderHorizontal } from "d3-simple-slider";

// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import dataRegistry from "./data/dataRegistry.json";

import { Container, Row, Col } from "react-bootstrap";

import { EEGDataViewer } from "./components/eeg-data-viewer/EEGDataViewer";
import { ElectrodeDropDown } from "./components/ElectrodeDropDown";

import { EventBarViewer } from "./components/event-viewer/EventBarViewer";

import { ENTContainer } from "./components/brain-viewer/ENTContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useFullNetworkPerEvent } from "./library/useFullNetworkPerEvent";

import { Logo } from "./components/logo/logo";
import { EventsDistribution } from "./components/events-distribution/events-distribution";
import { useFetch } from "./library/useFetch";
import { useAllEventData } from "./library/useAllEventData";


function App() {

  // first three d
  // console.log(dataRegistry)
  const [patientInfo, setPatientInfo] = useState({
    id: "ep129",
    sample: "sample1",
  });
  // console.log('patient', patientInfo)
  const [timeRange, setTimeRange] = useState(1000);
  // console.log('time', timeRange)

  const sampleData = useSamples({
    patientID: patientInfo.id,
    sampleName: patientInfo.sample,
    range: timeRange,
  });
  // console.log('sampledata', sampleData)

  const allEventData = useAllEventData({ patientID: patientInfo.id })

  // console.log(allEventData)

  const fullNetwork = useFullNetwork({
    patientID: patientInfo.id,
    sample: patientInfo.sample,
  });

  const fullEventNetwork = useFullNetworkPerEvent({
    patientID: patientInfo.id,
    sample: patientInfo.sample,
  });

  // loading the data
  const electrodeDataCsv = useElectrodeData({ id: patientInfo.id });



  let sliderObj = sliderHorizontal()
    .min(0)
    .max(dataRegistry[patientInfo.id].time)
    .default([0, 0]) //for one slider 0
    .ticks(4)
    // .tickValues(tickValues)
    // .step(30)
    .tickPadding(0)
    .fill("#2196f3")
    .on("onchange", function () { });

  // console.log(electrodeDataCsv)

  const [eegEL, setEEGEL] = useState({ id: 0, value: [92] });

  const [eventid, setEventid] = useState(null);


  function onEventsClicked(eventDatum) {
    // set slider object here, instead of inside bars
    console.log('event clicked')
    let values = eventDatum.electrode.sort((a, b) => a - b);
    setEEGEL({ id: eventDatum.index, value: values });
    console.log(eventDatum.index)
    setEventid(eventDatum.index)
  }

  const [barThreshold, setBarThreshold] = useState([35, 40]);

  // useFetch('ep129', 'sample1', 'filter')

  return (
    // component container
    <Container fluid id="container">
      <Row className={"fullh"}>
        <Col md="3" className={"event-panel fullh"}>
          <Logo>SpikeXplorer</Logo>
          <ElectrodeDropDown
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
          <div
            style={{
              width: "100%",
              height: "150px",
              backgroundColor: "#FAFBFC",
              marginTop: "10px",
            }}
          >
            {allEventData ?
              (<EventsDistribution
                id={patientInfo.id}
                currentSample={patientInfo.sample}
                data={allEventData}
                setBarThreshold={setBarThreshold}
              />
              ) : null}
          </div>
          <div style={{ height: "70vh", width: "100%", backgroundColor: "#FAFBFC" }}>
            {/* <div>Event Viewer</div>
             */}
            {allEventData ? (
              <ENTContainer
                patientInformation={patientInfo}
                electrodeData={electrodeDataCsv}
                sample={sampleData}
                slider={sliderObj}
                time={timeRange}
                events={allEventData[patientInfo.sample]}
                allnetworks={fullNetwork}
                allnetworksWithEvent={fullEventNetwork}
                eventid={eventid}
              />
            ) : null}
            {/* {allEventData ? (
              <EventBarViewer
                data={allEventData[patientInfo.sample]}
                threshold={barThreshold}
                onClickEvent={onEventsClicked}
              />
            ) : null} */}
          </div>
        </Col>
        <Col md="5">
          <EEGDataViewer
            eegEL={eegEL}
            patientInfo={patientInfo}
          />
        </Col>
        <Col md="4" className="fullh">


        </Col>
      </Row>
    </Container>
  );
}

export default App;
