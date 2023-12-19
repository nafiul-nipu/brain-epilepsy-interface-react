import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { ElectrodeDropDown } from "./components/top-navigation-panel/ElectrodeDropDown";

import { ENTContainer } from "./components/brain-viewer/ENTContainer";

import { useFullNetwork } from "./library/useFullNetwork";
import { useAllEventData } from "./library/useAllEventData";
import { usePatchData } from "./library/usePatchData";
import { useSamplePropagation } from "./library/useSamplePropagation"
import dataRegistry from "./data/dataRegistry.json";
import { RegionSummary } from "./components/region-summary/RegionSummary";
import { EEGDataContainer } from "./components/eeg-data-viewer/EEGDataContainer";
import { PatchSummary } from "./components/region-summary/PatchSummary";
import { useCommunity } from "./library/useCommunity";
import { useAllNetwork } from "./library/useAllNetwork";

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

  const comData = useCommunity({
    patientID: patientInfo.id,
    sampleName: patientInfo.sample,
    range: timeRange,
  })

  const allEventData = useAllEventData({ patientID: patientInfo.id });

  // console.log(allEventData)

  const fullNetwork = useFullNetwork({
    patientID: patientInfo.id,
    sample: patientInfo.sample,
  });

  const allNetwork = useAllNetwork({ patientID: patientInfo.id });

  // loading the data
  const electrodeDataCsv = useElectrodeData({ id: patientInfo.id });

  const patchData = usePatchData({ patientID: patientInfo.id })
  const samplePropagationData = useSamplePropagation({
    patientID: patientInfo.id,
    sampleID: patientInfo.sample,
  })


  const [selectedRoi, setSelectedRoi] = useState(0);

  const [eegInBrain, setEegInBrain] = useState(null);

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
        setSelectedRoi={setSelectedRoi}
      />
      <Row>
        {/* 94vh */}
        {/* left panel */}
        <Col md="7">
          <Row>
            {/* brain - 50vh */}
            <Col md="12" style={{ height: "54vh", backgroundColor: "#FAFBFC" }}>
              {allEventData && comData ? (
                <ENTContainer
                  patientInformation={patientInfo}
                  electrodeData={electrodeDataCsv}
                  sample={sampleData}
                  community={comData}
                  time={timeRange}
                  events={allEventData[patientInfo.sample]}
                  allnetworks={fullNetwork}
                  eegInBrain={eegInBrain}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Tabs variant="enclosed" colorScheme="green" size='sm' style={{ paddingRight: 0 }}>
              <TabList>
                <Tab>Network</Tab>
                <Tab>Patches</Tab>
                <Tab></Tab>
              </TabList>
              <TabPanels>
                <TabPanel style={{ padding: '0px' }}>
                  {/* region - 35vh */}
                  {/* this will be 2D similar view */}
                  {allNetwork && electrodeDataCsv ? (
                    <RegionSummary
                      networks={allNetwork}
                      sampleName={patientInfo.sample}
                      electrodeData={electrodeDataCsv}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel style={{ padding: '0px' }}>
                  {allEventData && patchData && samplePropagationData ? (
                    <PatchSummary
                      patchData={patchData}
                      samplePropagationData={samplePropagationData}
                      eventData={allEventData[patientInfo.sample]}
                      selectedRoi={selectedRoi}
                      setSelectedRoi={setSelectedRoi}
                      roiCount={dataRegistry[patientInfo.id][patientInfo.sample].roiCount}
                    />
                  ) : null}
                </TabPanel>

                <TabPanel style={{ padding: '0px' }}>
                  {/* TODO: add the network component here */}
                  network to visualize

                </TabPanel>
              </TabPanels>
            </Tabs>

          </Row>
        </Col>
        {/* right panel */}
        <Col md="5">
          <Row>
            {/* eeg 94vh */}
            <Col md="12" style={{ height: "94vh", backgroundColor: "#FAFBFC" }}>
              {allEventData && electrodeDataCsv ? (
                <EEGDataContainer
                  patient={patientInfo}
                  electrodeList={electrodeDataCsv.map((el) => el.electrode_number)}
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

// function useLocalHeightResize() {
//   // Initialize state with undefined width/height so server and client renders match
//   // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
//   const [localHeight, setLocalHeight] = useState({
//     height: 0.04 * window.innerHeight,
//   });

//   useEffect(() => {
//     // Handler to call on window resize
//     function handleResize() {
//       // Set window width/height to state
//       setLocalHeight({
//         height: 0.04 * window.innerHeight,
//       });
//     }
//     // Add event listener
//     window.addEventListener("resize", handleResize);
//     // Call handler right away so state gets updated with initial window size
//     handleResize();
//     // Remove event listener on cleanup
//     return () => window.removeEventListener("resize", handleResize);
//   }, []); // Empty array ensures that effect is only run on mount
//   return localHeight;
// }

export default App;
