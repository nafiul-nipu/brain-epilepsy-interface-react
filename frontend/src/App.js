import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { sliderHorizontal } from "d3-simple-slider";

// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import dataRegistry from "./data/dataRegistry.json";
// import { useEventData } from "./library/useEventData";

import { Container, Row, Col } from "react-bootstrap";

import { EEGDataViewer } from "./components/eeg-data-viewer/EEGDataViewer";
import { ElectrodeDropDown } from "./components/ElectrodeDropDown";

// import { EventViewer } from "./components/EventViewer";
import { EventBarViewer } from "./components/event-viewer/EventBarViewer";
// import { PropagationTimeSeries } from "./components/PropagationTimeSeries"
// import { TimeSliderButton } from "./components/TimeSliderButton";
import { ENTContainer } from "./components/ENTContainer";
// import { ENChordContainer } from "./components/ENChordContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useFullNetworkPerEvent } from "./library/useFullNetworkPerEvent";

import { Logo } from "./components/logo/logo";
import { EventsDistribution } from "./components/events-distribution/events-distribution";
import { useFetch } from "./library/useFetch";
import { useAllEventData } from "./library/useAllEventData";

const spikeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images"

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



  const secondNetwork = useFullNetwork({
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

  // console.log(electrodeDataCsv)

  const [eegEL, setEEGEL] = useState({ id: 0, value: [92] });

  const [baseUrl, setBaseUrl] = useState(spikeURL);

  function onEventsClicked(eventDatum) {
    // set slider object here, instead of inside bars
    console.log('event clicked')
    // let startTime = eventDatum.time[0];
    // let endTime = eventDatum.time[eventDatum.time.length - 1];
    // console.log(startTime, endTime)
    // sliderObj.value([startTime, endTime]);

    let values = eventDatum.electrode.sort((a, b) => a - b);
    setEEGEL({ id: eventDatum.index, value: values });
    setBaseUrl(spikeURL);
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
            <div>Event Viewer</div>
            {allEventData ? (
              <EventBarViewer
                data={allEventData[patientInfo.sample]}
                threshold={barThreshold}
                onClickEvent={onEventsClicked}
              />
            ) : null}
          </div>
        </Col>
        <Col md="5">
          <EEGDataViewer
            eegEL={eegEL}
            patientInfo={patientInfo}
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
          />
        </Col>
        {allEventData ? (
          <Col md="4" className="fullh">
            <ENTContainer
              patientInformation={patientInfo}
              electrodeData={electrodeDataCsv}
              sample={sampleData}
              slider={sliderObj}
              time={timeRange}
              events={allEventData[patientInfo.sample]}
              allnetworks={fullNetwork}
              allnetworksWithEvent={fullEventNetwork}
            />
            <ENTContainer
              patientInformation={second}
              electrodeData={secondElectrode}
              sample={seconSample}
              slider={secondSlider}
              time={secondTimeRange}
              allnetworks={secondNetwork}
            />
          </Col>
        ) : null}

      </Row>
    </Container>
  );
}

export default App;
