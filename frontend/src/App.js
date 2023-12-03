import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Switch, FormControl, FormLabel } from '@chakra-ui/react'

// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { ElectrodeDropDown } from "./components/top-navigation-panel/ElectrodeDropDown";

import { ENTContainer } from "./components/brain-viewer/ENTContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useFullNetworkPerEvent } from "./library/useFullNetworkPerEvent";
// import { EventsDistribution } from "./components/events-distribution/events-distribution";
import { useAllEventData } from "./library/useAllEventData";
// import { GlobalEvent } from "./components/global-event-timeline/GlobalEvent";
// import { LocalEvent } from "./components/local-event-timeline/LocalEvent";

import dataRegistry from "./data/dataRegistry.json";
import { SelectedEventWindow } from "./components/selected-event-window/SelectedEventWindow";
import { RegionSummary } from "./components/region-summary/RegionSummary";
import { NetworkViewer } from "./components/previous components/network-viewer/NetworkViewer";
// import { SimilarRegion } from "./components/similar-regions/SimilarRegion";
import { EEGDataContainer } from "./components/eeg-data-viewer/EEGDataContainer";
import { PatientSummary } from "./components/patient-summary/patientSummary";
import { ExplorationSoFar } from "./components/previous components/exploration-so-far/ExplorationSoFar";
import { BrainViewer } from "./components/brain-viewer/BrainViewer";

const globalTimelineRectWidth = 10000;
const localTimelineRectWidth = 500;

const defaultElList = [
  26, 28, 36, 20, 32, 21, 22, 40, 41, 54, 19, 31, 39, 47, 48, 52, 56, 27, 29,
  34, 35, 43, 49, 50, 53, 18, 33, 44, 30, 38, 51, 37, 108, 109, 107, 102, 112,
  55, 45, 23, 103, 73, 74, 76, 75, 84, 89,
];

function App() {
  const localEventSize = useLocalHeightResize();

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

  const allEventData = useAllEventData({ patientID: patientInfo.id });

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

  const [barThreshold, setBarThreshold] = useState([0, 70]);

  const [localEventDomain, setLocalEventDomain] = useState([
    0,
    globalTimelineRectWidth,
  ]);
  const [selectedEventRange, setSelectedEventRange] = useState([
    0,
    localTimelineRectWidth,
  ]);
  // first event time
  const [eventRangeNetwork, setEventRangeNetwork] = useState([103, 113]);
  const [eegPanelRange, seteegPanelRange] = useState([
    0,
    localTimelineRectWidth,
  ]);

  const [selectedRoi, setSelectedRoi] = useState(0);

  const [showAllRoi, setShowAllRoi] = useState(false);

  // fist event ID
  const [similarRegionEvent, setSimilarRegionEvent] = useState(1);

  const [exploration, setExploration] = useState([1]);

  const [roiFilter, setRoiFilter] = useState(null);

  const [electrodeListEventWindow, setElectrodeListEventWindow] =
    useState(defaultElList);

  const [eegInBrain, setEegInBrain] = useState(null);

  const [numCompWithSelEvent, setNumCompWithSelEvent] = useState(5);

  function onNumComponentChange(event) {
    setNumCompWithSelEvent(event.target.value);
  }

  // console.log(fullNetwork)
  // console.log(eventRangeNetwork)
  // console.log(selectedEventRange)

  return (
    // component container
    <Container fluid id="container">
      {/* electrode dropdown */}
      {/* 6vh */}
      <ElectrodeDropDown
        patientInfo={patientInfo}
        setPatientInfo={setPatientInfo}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        setRoiFilter={setRoiFilter}
        setSelectedRoi={setSelectedRoi}
        setSimilarRegionEvent={setSimilarRegionEvent}
        setExploration={setExploration}
      />
      <Row>
        {/* 94vh */}
        {/* left panel */}
        <Col md="7">
          <Row>
            {/* brain - 55vh */}
            <Col md="12" style={{ height: "55vh", backgroundColor: "#FAFBFC" }}>
              {allEventData ? (
                <ENTContainer
                  patientInformation={patientInfo}
                  electrodeData={electrodeDataCsv}
                  sample={sampleData}
                  time={timeRange}
                  events={allEventData[patientInfo.sample]}
                  allnetworks={fullNetwork}
                  allnetworksWithEvent={fullEventNetwork}
                  eventid={similarRegionEvent}
                  selectedEventRange={eventRangeNetwork}
                  eegInBrain={eegInBrain}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* region - 35vh */}
            {fullNetwork && allEventData && electrodeDataCsv ? (
              <RegionSummary
                data={fullNetwork}
                eventData={allEventData[patientInfo.sample]}
                eventRange={eventRangeNetwork}
                selectedRoi={selectedRoi}
                setSelectedRoi={setSelectedRoi}
                roiCount={dataRegistry[patientInfo.id][patientInfo.sample].roiCount}
                roiFilter={roiFilter}
                setRoiFilter={setRoiFilter}
                electrodeData={electrodeDataCsv}
              />
            ) : null}
          </Row>
        </Col>
        {/* right panel */}
        <Col md="5">
          <Row>
            {/* eeg 94 */}
            <Col md="12" style={{ height: "94vh", backgroundColor: "#FAFBFC" }}>
              {allEventData ? (
                <EEGDataContainer
                  allEventData={allEventData}
                  patient={patientInfo}
                  selectedEventRange={eventRangeNetwork}
                  eegPanelRange={eegPanelRange}
                  electrodeListEventWindow={electrodeListEventWindow}
                  eegInBrain={eegInBrain}
                  setEegInBrain={setEegInBrain}
                />
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

function useLocalHeightResize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [localHeight, setLocalHeight] = useState({
    height: 0.04 * window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setLocalHeight({
        height: 0.04 * window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return localHeight;
}

export default App;
