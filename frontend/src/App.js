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
    console.log('event clicked')
    let values = eventDatum.electrode.sort((a, b) => a - b);
    setEEGEL({ id: eventDatum.index, value: values });
    console.log(eventDatum.index)
    setEventid(eventDatum.index)
  }

  const [barThreshold, setBarThreshold] = useState([0, 70]);

  // useFetch('ep129', 'sample1', 'filter')

  // fake data for adjacency matrix
  var numrows = 30;
  var numcols = 30;

  var matrix = new Array(numrows);
  for (var i = 0; i < numrows; i++) {
    matrix[i] = new Array(numcols);
    for (var j = 0; j < numcols; j++) {
      matrix[i][j] = Math.random() * 2;
    }
  }
  let columns = Array.from({ length: matrix.length }, (_, i) => i);


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
          {allEventData ?
            (<GlobalEvent
              data={allEventData}
              id={patientInfo.id}
              currentSample={patientInfo.sample}
              threshold={barThreshold}
            />
            ) : null}
        </Col>
      </Row>
      <Row>
        {/* event timeline */}
        <Col style={{ height: '5vh' }}>
          <div className="localEventTitle">Local Event Timeline</div>
          {allEventData ?
            (<LocalEvent
              data={allEventData}
              id={patientInfo.id}
              currentSample={patientInfo.sample}
              threshold={barThreshold}
              width={dataRegistry[patientInfo.id].time}
              locaEventHeight={localEventSize.height}
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
            <Col md='12' style={{ height: '30vh', backgroundColor: 'lightcyan' }}>Region Summary</Col>
          </Row>
        </Col>
        {/* middle panel */}
        <Col md="5">
          <Row>
            <Col md="12" style={{ height: '10vh', backgroundColor: "lightcyan" }}>Selected Event Window</Col>
          </Row>
          <Row>
            <Col md="12" style={{ height: '40vh', backgroundColor: "#FAFBFC" }}>
              <AdjacencyMatrix
                data={matrix}
                columns={columns}
              />

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
          <EEGDataViewer
            eegEL={eegEL}
            patientInfo={patientInfo}
          />
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
