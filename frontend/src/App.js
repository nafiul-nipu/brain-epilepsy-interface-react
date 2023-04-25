import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { EEGDataViewer } from "./components/eeg-data-viewer/EEGDataViewer";
import { ElectrodeDropDown } from "./components/top-navigation-panel/ElectrodeDropDown";

import { ENTContainer } from "./components/brain-viewer/ENTContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useFullNetworkPerEvent } from "./library/useFullNetworkPerEvent";
import { EventsDistribution } from "./components/events-distribution/events-distribution";
import { useFetch } from "./library/useFetch";
import { useAllEventData } from "./library/useAllEventData";
import { GlobalEvent } from "./components/global-event-timeline/GlobalEvent";
import { LocalEvent } from "./components/local-event-timeline/LocalEvent";
import { AdjacencyMatrix } from "./CommonComponents/AdjacencyMatrix";

import dataRegistry from "./data/dataRegistry.json";
import { RegionCircles } from "./CommonComponents/RegionCircles";
import { useMergedRois } from "./library/useMergedRois";
import { SelectedEventWindow } from "./components/selected-event-window/SelectedEventWindow";
import { RegionSummary } from "./components/region-summary/RegionSummary";
import { NetworkViewer } from "./components/network-viewer/NetworkViewer";

const globalTimelineRectWidth = 10000;
const localTimelineRectWidth = 500;


function App() {
  const localEventSize = useLocalHeightResize()

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

  // console.log(electrodeDataCsv)

  const [eegEL, setEEGEL] = useState({ id: 0, value: [92] });

  const [eventid, setEventid] = useState(null);


  function onEventsClicked(eventDatum) {
    // set slider object here, instead of inside bars
    // console.log('event clicked')
    let values = eventDatum.electrode.sort((a, b) => a - b);
    setEEGEL({ id: eventDatum.index, value: values });
    // console.log(eventDatum.index)
    setEventid(eventDatum.index)
  }

  const [barThreshold, setBarThreshold] = useState([0, 70]);

  // useFetch('ep129', 'sample1', 'filter')

  const [localEventDomain, setLocalEventDomain] = useState([0, globalTimelineRectWidth])
  const [selectedEventRange, setSelectedEventRange] = useState([0, localTimelineRectWidth])
  const [eventRangeNetwork, setEventRangeNetwork] = useState([0, localTimelineRectWidth])


  const [selectedRoi, setSelectedRoi] = useState(0)



  // console.log(adjaData)

  return (
    // component container
    <Container fluid id="container">
      <Row>
        {/* electrode dropdown */}
        <Col md='12' style={{ height: '5vh' }}>
          <ElectrodeDropDown
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </Col>
      </Row>
      <Row>
        {/* global-event timeline */}
        <Col md='12' style={{ height: '4vh', backgroundColor: '#FAFBFC' }}>
          <div className="globalEventTitle">Global Event Timeline</div>
          <div className="gloablTime">{`${dataRegistry[patientInfo.id].time} MS`}</div>
          {allEventData ?
            (<GlobalEvent
              data={allEventData}
              id={patientInfo.id}
              currentSample={patientInfo.sample}
              threshold={barThreshold}
              rectWidth={globalTimelineRectWidth}
              setLocalEventDomain={setLocalEventDomain}
            />
            ) : null}
        </Col>
      </Row>
      <Row>
        {/* event timeline */}
        <Col style={{ height: '5vh' }}>
          <div className="localEventTitle">Local Event Timeline</div>
          <div className="localTimestart">{`${localEventDomain[0]} MS`}</div>
          <div className="localTimeEnd">{`${localEventDomain[1]} MS`}</div>
          {allEventData ?
            (<LocalEvent
              data={allEventData}
              id={patientInfo.id}
              currentSample={patientInfo.sample}
              threshold={barThreshold}
              domain={localEventDomain}
              locaEventHeight={localEventSize.height}
              setSelectedEventRange={setSelectedEventRange}
              setEventRangeNetwork={setEventRangeNetwork}
              rectWidth={localTimelineRectWidth}

            />
            ) : null}
        </Col>
      </Row>
      <Row>
        {/* left panel */}
        <Col md="3" >
          <Row>
            <Col md="12" style={{ height: '15vh', backgroundColor: "#FAFBFC" }}>
              {allEventData ?
                (<EventsDistribution
                  id={patientInfo.id}
                  currentSample={patientInfo.sample}
                  data={allEventData}
                  setBarThreshold={setBarThreshold}
                />
                ) : null}
            </Col>
          </Row>
          <Row>
            <Col md='12' style={{ height: '40vh', backgroundColor: "#FAFBFC" }}>
              {allEventData ? (
                <ENTContainer
                  patientInformation={patientInfo}
                  electrodeData={electrodeDataCsv}
                  sample={sampleData}
                  time={timeRange}
                  events={allEventData[patientInfo.sample]}
                  allnetworks={fullNetwork}
                  allnetworksWithEvent={fullEventNetwork}
                  eventid={eventid}
                />
              ) : null}
            </Col>
          </Row>
          <Row>
            <Col md='12' className="regionSummaryContainer" style={{ height: '30vh', backgroundColor: '#FAFBFC' }}>
              <div className="regionSummary">Region Summary</div>
              {fullNetwork && allEventData ?
                (<RegionSummary
                  data={fullNetwork}
                  eventData={allEventData[patientInfo.sample]}
                  eventRange={eventRangeNetwork}
                  setSelectedRoi={setSelectedRoi}
                />
                ) : null}
            </Col>
          </Row>
        </Col>
        {/* middle panel */}
        <Col md="5">
          <Row>
            <Col md="12" style={{ height: '7vh', backgroundColor: "#FAFBFC" }}>
              {/* Selected Event Window */}
              {allEventData ?
                (<SelectedEventWindow
                  data={allEventData}
                  id={patientInfo.id}
                  currentSample={patientInfo.sample}
                  domain={selectedEventRange}
                  threshold={barThreshold}
                  setEventRangeNetwork={setEventRangeNetwork}
                />
                ) : null}

            </Col>
          </Row>
          <Row>
            <Col md="12" style={{ height: '28vh', backgroundColor: "#FAFBFC" }}>
              {fullNetwork && allEventData && fullEventNetwork ?
                (<NetworkViewer
                  sessionNetwork={fullNetwork}
                  eventData={allEventData[patientInfo.sample]}
                  eventRange={eventRangeNetwork}
                  eventNet={fullEventNetwork}
                  selectedRoi={selectedRoi}
                />
                ) : null}

            </Col>
          </Row>
          <Row>
            <Col md="12" style={{ height: '35vh' }}>
              <Tabs variant='enclosed' colorScheme='green'>
                <TabList>
                  <Tab>Similar Regions</Tab>
                  <Tab>Exploration So Far</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <p>Showing Similar Regions</p>
                  </TabPanel>
                  <TabPanel>
                    <p>Showing Exploration so far</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Col>
          </Row>
        </Col>
        {/* right panel */}
        <Col md="4" className="fullh">
          <Row>
            <Col md="12" style={{ height: '60vh', backgroundColor: "#FAFBFC" }}>
              <EEGDataViewer
                eegEL={eegEL}
                patientInfo={patientInfo}
              />
            </Col>
          </Row>
          <Row>
            <Col md="12" style={{ height: '40vh', backgroundColor: "#FAFBFC" }}> Patient Summary</Col>
          </Row>
        </Col>
      </Row >
    </Container >
  );
}


function useLocalHeightResize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [localHeight, setLocalHeight] = useState({
    height: (0.04 * window.innerHeight)
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setLocalHeight({
        height: (0.04 * window.innerHeight),
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
