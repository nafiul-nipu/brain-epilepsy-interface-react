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
import { PatchNetwork } from "./components/patch-network/PatchNetwork";

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


  const [topPercent, setTopPercent] = useState(0.01)
  const [colorTheLine, setColorTheLine] = useState('width')
  const [viewColor, setViewColor] = useState('na')

  const onViewChange = (event) => {
    setViewColor(event.target.value);
  };

  const topOnChange = (event) => {
    setTopPercent(event.target.value)
  }

  const colorOnChange = (event) => {
    setColorTheLine(event.target.value)
  }

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
              {allEventData && comData && allNetwork ? (
                <ENTContainer
                  patientInformation={patientInfo}
                  electrodeData={electrodeDataCsv}
                  sample={sampleData}
                  community={comData}
                  time={timeRange}
                  events={allEventData[patientInfo.sample]}
                  allnetworks={allNetwork}
                  eegInBrain={eegInBrain}
                  topPercent={topPercent}
                />
              ) : null}
            </Col>
          </Row>

          <div id="viewPatch">
            <label htmlFor="view">View:</label>
            <select id="view" value={viewColor} onChange={onViewChange}>
              <option value="na"> N/A </option>
              <option value="patch"> Patch </option>
              <option value="communities"> Communities </option>
            </select>
          </div>
          {/* Patient dropdown */}
          <div id="region-topPercent">
            <label htmlFor="percent">Top:</label>
            <select id="percent" value={topPercent} onChange={topOnChange}>
              <option value="0.01"> 1% </option>
              <option value="0.02"> 2% </option>
              <option value="0.05"> 5% </option>
              <option value="0.1"> 10% </option>
            </select>
          </div>

          {/* propagation dropdown */}
          <div id="region-color">
            <label htmlFor="color">Color:</label>
            <select id="color" value={colorTheLine} onChange={colorOnChange}>
              <option value="width"> width</option>
              <option value="time"> time </option>
            </select>
          </div>

          <Row style={{margin: '5px 0'}}>
            <Tabs variant="enclosed" colorScheme="green" size='sm' style={{ paddingRight: 0 }}>
              <TabList>
                <Tab>Patch Network</Tab>
                <Tab>All Networks</Tab>
                {/* <Tab></Tab> */}
              </TabList>
              <TabPanels>
                <TabPanel style={{ padding: '0px' }}>
                  {allNetwork && electrodeDataCsv && comData && patchData ? (
                    <PatchNetwork
                      networks={allNetwork[patientInfo.sample]}
                      patchData={patchData}
                      sampleName={patientInfo.sample}
                      electrodeData={electrodeDataCsv}
                      communityData={comData}
                      viewColor={viewColor}
                      topPercent={topPercent}
                      colorTheLine={colorTheLine}
                      rowLength={Array.from(
                        new Set(
                          electrodeDataCsv.map((el) => el.label)
                        )
                      ).sort((a, b) => a - b)}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel style={{ padding: '0px' }}>
                  {/* region - 35vh */}
                  {/* this will be 2D similar view */}
                  {allNetwork && electrodeDataCsv && comData ? (
                    <RegionSummary
                      networks={allNetwork}
                      sampleName={patientInfo.sample}
                      electrodeData={electrodeDataCsv}
                      communityData={comData}
                      viewColor={viewColor}
                      topPercent={topPercent}
                      colorTheLine={colorTheLine}
                    />
                  ) : null}
                </TabPanel>
              </TabPanels>
            </Tabs>

          </Row>
        </Col>
        {/* right panel */}
        <Col md="5">
          <Row>
            <Tabs variant="enclosed" colorScheme="green" size='sm' style={{ paddingRight: 0 }}>
              <TabList>
                <Tab>EEG</Tab>
                <Tab>Patches</Tab>
                <Tab></Tab>
              </TabList>

              <TabPanels>
                <TabPanel style={{ padding: '0px' }}>
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
              </TabPanels>

            </Tabs>
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
