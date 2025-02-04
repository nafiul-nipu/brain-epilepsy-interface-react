import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
// importing components
import { useElectrodeData } from "./library/useElectrodeData";
import { useSamples } from "./library/useSamples";

import { useEffect, useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { ElectrodeDropDown } from "./components/top-navigation-panel/ElectrodeDropDown";

import { ENTContainer } from "./components/brain-viewer/ENTContainer";

import { useAllEventData } from "./library/useAllEventData";
import { usePatchData } from "./library/usePatchData";
import { useSamplePropagation } from "./library/useSamplePropagation";
import { RegionSummary } from "./components/region-summary/RegionSummary";
import { EEGDataContainer } from "./components/eeg-data-viewer/EEGDataContainer";
import { PatchSummary } from "./components/region-summary/PatchSummary";
import { SpikeSummary } from "./components/region-summary/SpikeSummary";
import { useCommunity } from "./library/useCommunity";
import { useAllNetwork } from "./library/useAllNetwork";
import { PatchNetwork } from "./components/patch-network/PatchNetwork";
import { useRegionData } from "./library/useRegionData";
import { useBBoxcenter } from "./library/useBBoxcenter";
import { useNetworkPerMinute } from "./library/useNetworkPerMinute";
import { usePatternBoundaryPoints } from "./library/usePatternBoundaryPoints";
import { usePatternBoundaryPerSample } from "./library/usePatternBoundaryPerSample";

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

  // const bboxCenter = useBBoxcenter({ patient: patientInfo.id, objType: 'brain.obj' })
  // console.log("Patient: ", patientInfo.id, "BBoxCenter: ", bboxCenter)

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
  });

  const allEventData = useAllEventData({ patientID: patientInfo.id });

  // console.log(allEventData)

  const allNetwork = useAllNetwork({ patientID: patientInfo.id });

  const networkPerMinute = useNetworkPerMinute({ patientID: patientInfo.id });
  // console.log(networkPerMinute)

  // loading the data
  const electrodeDataCsv = useElectrodeData({ id: patientInfo.id });
  // console.log(electrodeDataCsv)

  const patchData = usePatchData({ patientID: patientInfo.id });
  const samplePropagationData = useSamplePropagation({
    patientID: patientInfo.id,
    sampleID: patientInfo.sample,
  });

  const patternBoundaries = usePatternBoundaryPoints({
    patientID: patientInfo.id,
  });

  const patternBoundariesPerSample = usePatternBoundaryPerSample({
    patientID: patientInfo.id,
  });

  console.log(patternBoundariesPerSample);

  const regionData = useRegionData({ patientID: patientInfo.id });

  const [selectedRoi, setSelectedRoi] = useState(null);

  const [eegInBrain, setEegInBrain] = useState(null);
  const [eegList, setEegList] = useState(null);

  const [topPercent, setTopPercent] = useState(99);
  const [viewColor, setViewColor] = useState("na");

  const onViewChange = (event) => {
    setViewColor(event.target.value);
  };

  const topOnChange = (event) => {
    setTopPercent(event.target.value);
  };

  const [patchRegionToggle, setPatchRegionToggle] = useState("Patch");

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
              {allEventData &&
              comData &&
              allNetwork &&
              networkPerMinute &&
              patternBoundaries &&
              patternBoundariesPerSample ? (
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
                  selectedRoi={selectedRoi}
                  eegList={eegList}
                  setEegInBrain={setEegInBrain}
                  patchRegionToggle={patchRegionToggle}
                  network_per_minute={networkPerMinute[patientInfo.sample]}
                  patternBoundaries={patternBoundaries}
                  patternBoundariesPerSample={patternBoundariesPerSample}
                />
              ) : null}
            </Col>
          </Row>

          <div id="viewPatch">
            <label htmlFor="view">View:</label>
            <select id="view" value={viewColor} onChange={onViewChange}>
              <option value="na"> N/A </option>
              <option value="patch"> Patch </option>
              <option value="regions"> Regions </option>
              <option value="communities"> Communities </option>
            </select>
          </div>
          {/* Patient dropdown */}
          <div id="region-topPercent">
            <label htmlFor="percent">Percentile:</label>
            <select id="percent" value={topPercent} onChange={topOnChange}>
              <option value="99"> 99 </option>
              <option value="98"> 98 </option>
              <option value="97"> 97 </option>
              <option value="96"> 96 </option>
              <option value="95"> 95 </option>
              <option value="90"> 90 </option>
              <option value="50"> 50 </option>
            </select>
          </div>

          <Row style={{ margin: "5px 0" }}>
            <Tabs
              variant="enclosed"
              colorScheme="green"
              size="sm"
              style={{ paddingRight: 0 }}
              onChange={(index) => {
                setEegList(null);
              }}
            >
              <TabList>
                <Tab>Patch Network</Tab>
                <Tab>Region Network</Tab>
                <Tab>All Networks</Tab>
              </TabList>
              <TabPanels>
                <TabPanel style={{ padding: "0px" }}>
                  {/* patch network */}
                  {allNetwork && electrodeDataCsv && comData && patchData ? (
                    <PatchNetwork
                      networks={allNetwork[patientInfo.sample]}
                      patchData={patchData}
                      sampleName={patientInfo.sample}
                      electrodeData={electrodeDataCsv}
                      communityData={comData}
                      viewColor={viewColor}
                      topPercent={topPercent}
                      rowLength={Array.from(
                        new Set(electrodeDataCsv.map((el) => el.label))
                      ).sort((a, b) => a - b)}
                      selectedRoi={selectedRoi}
                      setSelectedRoi={setSelectedRoi}
                      eegList={eegList}
                      setEegList={setEegList}
                      networkType={"patch"}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel style={{ padding: "0px" }}>
                  {/* region network */}
                  {allNetwork && electrodeDataCsv && comData && regionData ? (
                    <PatchNetwork
                      networks={allNetwork[patientInfo.sample]}
                      patchData={regionData}
                      sampleName={patientInfo.sample}
                      electrodeData={electrodeDataCsv}
                      communityData={comData}
                      viewColor={viewColor}
                      topPercent={topPercent}
                      rowLength={[
                        ...new Set(electrodeDataCsv.map((obj) => obj.region)),
                      ]}
                      selectedRoi={selectedRoi}
                      setSelectedRoi={setSelectedRoi}
                      eegList={eegList}
                      setEegList={setEegList}
                      networkType={"region"}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel style={{ padding: "0px" }}>
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
                      eegList={eegList}
                      setEegList={setEegList}
                      networkType={"all"}
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
            <Tabs
              variant="enclosed"
              colorScheme="green"
              size="sm"
              style={{ padding: 0 }}
            >
              <TabList>
                <Tab>EEG</Tab>
                <Tab>Spikes</Tab>
                <Tab>Patches</Tab>
                <Tab>Regions</Tab>
              </TabList>

              <TabPanels>
                <TabPanel style={{ padding: "0px", marginRight: "12px" }}>
                  {/* eeg 89.5vh */}
                  <Col
                    md="12"
                    style={{ height: "89.5vh", backgroundColor: "#FAFBFC" }}
                  >
                    {allEventData && electrodeDataCsv && comData ? (
                      <EEGDataContainer
                        viewColor={viewColor}
                        patient={patientInfo}
                        electrodeData={electrodeDataCsv}
                        communityData={comData}
                        sampleName={patientInfo.sample}
                        topPercent={topPercent}
                        electrodeList={electrodeDataCsv.map(
                          (el) => el.electrode_number
                        )}
                        electrodeName={electrodeDataCsv.map((el) => el.E_Brain)}
                        eegInBrain={eegInBrain}
                        setEegInBrain={setEegInBrain}
                        eegList={eegList}
                      />
                    ) : null}
                  </Col>
                </TabPanel>
                <TabPanel style={{ padding: "0px", marginRight: "12px" }}>
                  {allEventData &&
                  patchData &&
                  regionData &&
                  samplePropagationData &&
                  electrodeDataCsv ? (
                    <SpikeSummary
                      patchData={patchData}
                      regionData={regionData}
                      samplePropagationData={samplePropagationData}
                      eventData={allEventData[patientInfo.sample]}
                      selectedRoi={selectedRoi}
                      setSelectedRoi={setSelectedRoi}
                      patientID={patientInfo.id}
                      electrodeData={electrodeDataCsv}
                      patchRegionToggle={patchRegionToggle}
                      setPatchRegionToggle={setPatchRegionToggle}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel style={{ padding: "0px", marginRight: "12px" }}>
                  {allEventData &&
                  patchData &&
                  samplePropagationData &&
                  electrodeDataCsv ? (
                    <PatchSummary
                      patchData={patchData}
                      patchRegionMark={"patch"}
                      samplePropagationData={samplePropagationData}
                      eventData={allEventData[patientInfo.sample]}
                      selectedRoi={selectedRoi}
                      setSelectedRoi={setSelectedRoi}
                      electrodeData={electrodeDataCsv}
                    />
                  ) : null}
                </TabPanel>
                <TabPanel style={{ padding: "0px", marginRight: "12px" }}>
                  {allEventData &&
                  samplePropagationData &&
                  regionData &&
                  electrodeDataCsv ? (
                    <PatchSummary
                      patchData={regionData}
                      patchRegionMark={"region"}
                      samplePropagationData={samplePropagationData}
                      eventData={allEventData[patientInfo.sample]}
                      selectedRoi={selectedRoi}
                      setSelectedRoi={setSelectedRoi}
                      electrodeData={electrodeDataCsv}
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
