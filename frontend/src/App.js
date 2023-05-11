import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { ElectrodeDropDown } from "./components/top-navigation-panel/ElectrodeDropDown";

import { ENTContainer } from "./components/brain-viewer/ENTContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useFullNetworkPerEvent } from "./library/useFullNetworkPerEvent";
import { EventsDistribution } from "./components/events-distribution/events-distribution";
import { useAllEventData } from "./library/useAllEventData";
import { GlobalEvent } from "./components/global-event-timeline/GlobalEvent";
import { LocalEvent } from "./components/local-event-timeline/LocalEvent";

import dataRegistry from "./data/dataRegistry.json";
import { SelectedEventWindow } from "./components/selected-event-window/SelectedEventWindow";
import { RegionSummary } from "./components/region-summary/RegionSummary";
import { NetworkViewer } from "./components/network-viewer/NetworkViewer";
import { SimilarRegion } from "./components/similar-regions/SimilarRegion";
import { EEGDataContainer } from "./components/eeg-data-viewer/EEGDataContainer";
import { PatientSummary } from "./components/patient-summary/patientSummary";
import { ExplorationSoFar } from "./components/exploration-so-far/ExplorationSoFar";

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

  // fist event ID
  const [similarRegionEvent, setSimilarRegionEvent] = useState(1);

  const [exploration, setExploration] = useState([1]);

  const [roiFilter, setRoiFilter] = useState(null);

  const [electrodeListEventWindow, setElectrodeListEventWindow] =
    useState(defaultElList);

  const [eegInBrain, setEegInBrain] = useState(null);

  const [numComponents, setNumComponents] = useState(4);

  function onNumComponentChange(event) {
    setNumComponents(event.target.value);
  }

  // console.log(fullNetwork)
  // console.log(eventRangeNetwork)
  // console.log(selectedEventRange)

  return (
    // component container
    <Container fluid id="container">
      {/* electrode dropdown */}
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

      {/* global event timeline*/}
      {allEventData && fullNetwork ? (
        <GlobalEvent
          data={allEventData}
          id={patientInfo.id}
          currentSample={patientInfo.sample}
          threshold={barThreshold}
          rectWidth={globalTimelineRectWidth}
          setLocalEventDomain={setLocalEventDomain}
          roiElectrodes={fullNetwork[roiFilter]?.electrodes ?? null}
          maxTime={dataRegistry[patientInfo.id].time}
          setEegInBrain={setEegInBrain}
        />
      ) : null}

      {/* event timeline */}
      {allEventData && fullNetwork ? (
        <LocalEvent
          data={allEventData}
          id={patientInfo.id}
          currentSample={patientInfo.sample}
          threshold={barThreshold}
          domain={localEventDomain}
          locaEventHeight={localEventSize.height}
          setSelectedEventRange={setSelectedEventRange}
          setEventRangeNetwork={setEventRangeNetwork}
          seteegPanelRange={seteegPanelRange}
          rectWidth={localTimelineRectWidth}
          roiElectrodes={fullNetwork[roiFilter]?.electrodes ?? null}
          setSimilarRegionEvent={setSimilarRegionEvent}
          setElectrodeListEventWindow={setElectrodeListEventWindow}
          setEegInBrain={setEegInBrain}
        />
      ) : null}

      <Row>
        {/* left panel */}
        <Col md="4">
          <Row>
            <Col md="12" style={{ height: "45vh", backgroundColor: "#FAFBFC" }}>
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
            {fullNetwork && allEventData ? (
              <RegionSummary
                data={fullNetwork}
                eventData={allEventData[patientInfo.sample]}
                eventRange={eventRangeNetwork}
                selectedRoi={selectedRoi}
                setSelectedRoi={setSelectedRoi}
                roiCount={dataRegistry[patientInfo.id][patientInfo.sample].roiCount}
                roiFilter={roiFilter}
                setRoiFilter={setRoiFilter}
              />
            ) : null}
          </Row>
        </Col>
        {/* middle panel */}
        <Col md="4">
          <Row>
            <Col md="12" style={{ height: "6vh", backgroundColor: "#FAFBFC" }}>
              <Row>
                <Col
                  md="2"
                  className="eventWindowTime"
                >{`${selectedEventRange[0]} ms`}</Col>
                <Col md="8" className="eventWindowTime" >
                  Selected Event Window
                </Col>
                <Col
                  md="2"
                  className="eventWindowTime"
                  style={{ textAlign: "end" }}
                >{`${selectedEventRange[1]} ms`}</Col>
              </Row>
              <Row>
                <Col md="12" style={{ height: "6vh" }}>
                  {/* Selected Event Window */}
                  {allEventData ? (
                    <SelectedEventWindow
                      data={allEventData}
                      id={patientInfo.id}
                      currentSample={patientInfo.sample}
                      domain={selectedEventRange}
                      threshold={barThreshold}
                      setEventRangeNetwork={setEventRangeNetwork}
                      setSimilarRegionEvent={setSimilarRegionEvent}
                      similarRegionEvent={similarRegionEvent}
                      setExploration={setExploration}
                    />
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md="12" style={{ height: "30vh", backgroundColor: "#FAFBFC" }}>
              <div style={{ width: "30vh", height: "30vh" }}>
                {fullNetwork && allEventData && fullEventNetwork ? (
                  <NetworkViewer
                    sessionNetwork={fullNetwork}
                    eventData={allEventData[patientInfo.sample]}
                    eventRange={eventRangeNetwork}
                    eventNet={fullEventNetwork}
                    selectedRoi={selectedRoi}
                    colorRange={selectedRoi !== null ? dataRegistry[patientInfo.id].roiColor[selectedRoi] : ["#f5f7f5", "#f5f7f5"]}
                  />
                ) : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12" style={{ height: "44vh" }}>
              <Tabs variant="enclosed" colorScheme="green" size='sm'>
                <TabList>
                  <Tab>Similar Regions</Tab>
                  <Tab>Event Exploration So Far</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel style={{ padding: '0px' }}>
                    <div className="form-numCom-entry">
                      <label htmlFor="numCom">Num_Com:</label>
                      <select id="numCom" value={numComponents} onChange={onNumComponentChange}>
                        <option value="3"> 3</option>
                        <option value="4"> 4</option>
                        <option value="5"> 5 </option>
                        <option value="6"> 6 </option>
                      </select>
                    </div>
                    {similarRegionEvent && allEventData && fullEventNetwork ? (
                      <SimilarRegion
                        similarRegionEvent={similarRegionEvent}
                        selectedRoi={selectedRoi}
                        sessionNetwork={fullNetwork}
                        eventNet={fullEventNetwork}
                        eventData={allEventData[patientInfo.sample]}
                        patient={patientInfo}
                        numComponents={numComponents}
                        colorRange={selectedRoi !== null ? dataRegistry[patientInfo.id].roiColor[selectedRoi] : ["#f5f7f5", "#f5f7f5"]}
                      />
                    ) : (
                      <p>Select an event</p>
                    )}
                  </TabPanel>
                  <TabPanel style={{ padding: '0px' }}>
                    <div style={{ height: '40vh', overflowY: 'auto', overflowX: 'hidden' }}>
                      {
                        exploration && allEventData && fullEventNetwork ? (
                          <ExplorationSoFar
                            exploration={exploration}
                            eventData={allEventData[patientInfo.sample]}
                            eventNet={fullEventNetwork}
                          />
                        ) : <div> No exploration yet </div>
                      }
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Col>
          </Row>
        </Col>
        {/* right panel */}
        <Col md="4">
          <Row>
            <Col md="12" style={{ height: "60vh", backgroundColor: "#FAFBFC" }}>
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
          <Row>
            {
              allEventData ? (
                <PatientSummary
                  patient={patientInfo}
                  events={Object.keys(allEventData)}
                />
              ) : null
            }

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
