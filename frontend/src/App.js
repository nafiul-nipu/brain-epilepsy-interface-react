import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { sliderHorizontal } from "d3-simple-slider";

// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import dataRegistry from "./data/dataRegistry.json";
import { useEventData } from "./library/useEventData";

import { Container, Row, Col } from "react-bootstrap";

import { EEGDataViewer } from "./components/eeg-data-viewer/EEGDataViewer";
import { ElectrodeDropDown } from "./components/ElectrodeDropDown";

import { EventViewer } from "./components/EventViewer";
import { EventBarViewer } from "./components/event-viewer/EventBarViewer";
// import { PropagationTimeSeries } from "./components/PropagationTimeSeries"
import { TimeSliderButton } from "./components/TimeSliderButton";
import { ENTContainer } from "./components/ENTContainer";
import { ENChordContainer } from "./components/ENChordContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useFullNetworkPerEvent } from "./library/useFullNetworkPerEvent";

import { Logo } from "./components/logo/logo";
import { EventsDistribution } from "./components/events-distribution/events-distribution";
import { useFetch } from "./library/useFetch";

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

  const eventData = useEventData({
    patientID: patientInfo.id,
    sample: patientInfo.sample,
  });

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


  // second three d
  // console.log(dataRegistry)
  const second = {
    id: "ep187",
    sample: "sample1",
  }
  // console.log('patient', patientInfo)
  const secondTimeRange = 1000;

  const seconSample = useSamples({
    patientID: second.id,
    sampleName: second.sample,
    range: secondTimeRange,
  });
  // console.log('sampledata', sampleData)

  const secondEvent = useEventData({
    patientID: second.id,
    sample: second.sample,
  });

  const secondNetwork = useFullNetwork({
    patientID: second.id,
    sample: second.sample,
  });

  const secondEventNetwork = useFullNetworkPerEvent({
    patientID: second.id,
    sample: second.sample,
  });

  // loading the data
  const secondElectrode = useElectrodeData({ id: second.id });


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

  let secondSlider = sliderHorizontal()
    .min(0)
    .max(dataRegistry[second.id].time)
    .default([0, 0]) //for one slider 0
    .ticks(4)
    // .tickValues(tickValues)
    // .step(30)
    .tickPadding(0)
    .fill("#2196f3")
    .on("onchange", function () { });

  function setNewPatientInfo(val) {
    console.log("setting patient info");
    setPatientInfo({ id: val.id, sample: val.sample });
    console.log("setting time range");
    setTimeRange(val.range);
  }

  // console.log(electrodeDataCsv)

  const [eegEL, setEEGEL] = useState({ id: 0, value: [92] });

  function onEventsClicked(eventDatum) {
    // set slider object here, instead of inside bars
    console.log('event clicked')
    // let startTime = eventDatum.time[0];
    // let endTime = eventDatum.time[eventDatum.time.length - 1];
    // console.log(startTime, endTime)
    // sliderObj.value([startTime, endTime]);

    let values = eventDatum.electrode.sort((a, b) => a - b);
    setEEGEL({ id: eventDatum.index, value: values });
  }

  // useFetch('ep129', 'sample1', 'filter')

  return (
    // component container
    <Container fluid id="container">
      <Row className={"fullh"}>
        <Col md="4" className={"event-panel fullh"}>
          <Logo>SpikeXplorer</Logo>
          <ElectrodeDropDown setNewPatientInfo={setNewPatientInfo} />
          <div
            style={{
              width: "100%",
              height: "150px",
              backgroundColor: "#FAFBFC",
              marginTop: "10px",
            }}
          >
            {eventData ? <EventsDistribution data={eventData} /> : null}
          </div>
          <div style={{ height: "70vh", width: "100%", backgroundColor: "#FAFBFC" }}>
            {eventData ? (
              <EventBarViewer
                data={eventData}
                // threshold={10}
                onClickEvent={onEventsClicked}
              />
            ) : null}
            {/* <EventViewer
              data={eventData}
              sliderObj={sliderObj}
              onEventsClicked={onEventsClicked}
            /> */}
          </div>
        </Col>
        <Col md="4">
          <EEGDataViewer eegEL={eegEL} patientInfo={patientInfo} />
        </Col>
        <Col md="4" className="fullh">
          {/* <Row style={{ height: "50%" }}> */}
          {/* <TimeSliderButton sliderObj={sliderObj} /> */}
          <ENTContainer
            patientInformation={patientInfo}
            electrodeData={electrodeDataCsv}
            sample={sampleData}
            slider={sliderObj}
            time={timeRange}
            events={eventData}
            allnetworks={fullNetwork}
            allnetworksWithEvent={fullEventNetwork}
            view={'top'}
          />
          {/* </Row> */}
          {/* <Row style={{ height: "50%" }}> */}
          {/* <ENChordContainer
              epatient={patientInfo}
              samples={sampleData}
              electrodes={electrodeDataCsv}
              allnetworks={fullNetwork}
              allnetworksWithEvent={fullEventNetwork}
            /> */}

          {/* <TimeSliderButton sliderObj={secondSlider} /> */}
          {/* <ENTContainer
            patientInformation={second}
            electrodeData={secondElectrode}
            sample={seconSample}
            slider={secondSlider}
            time={secondTimeRange}
            events={secondEvent}
            allnetworks={secondNetwork}
            allnetworksWithEvent={secondEventNetwork}
            view={'bottom'}
          /> */}
          {/* </Row> */}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
