import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { sliderHorizontal } from 'd3-simple-slider'

// importing components
import { useElectrodeData } from './library/useElectrodeData';
import { useSamples } from './library/useSamples';

import { useState } from 'react';

import dataRegistry from './data/dataRegistry.json'
import { useEventData } from './library/useEventData';

import { Container, Row, Col } from "react-bootstrap"

import { EEGDataViewer } from "./components/EEGDataViewer"
import { ElectrodeDropDown } from "./components/ElectrodeDropDown"

import { EventViewer } from "./components/EventViewer"
// import { PropagationTimeSeries } from "./components/PropagationTimeSeries"
import { TimeSliderButton } from "./components/TimeSliderButton"
import { ENTContainer } from './components/ENTContainer';
import { ENChordContainer } from './components/ENChordContainer';


function App() {
  // console.log(dataRegistry)
  const [patientInfo, setPatientInfo] = useState({ id: 'ep187', sample: 'sample1' })
  // console.log('patient', patientInfo)
  const [timeRange, setTimeRange] = useState(1000)
  // console.log('time', timeRange)

  const sampleData = useSamples({
    patientID: patientInfo.id,
    sampleName: patientInfo.sample,
    range: timeRange
  })
  // console.log('sampledata', sampleData)

  const eventData = useEventData({
    patientID: patientInfo.id,
    sample: patientInfo.sample
  })



  // loading the data
  const electrodeDataCsv = useElectrodeData({ id: patientInfo.id });
  // console.log('electrodcsv', electrodeDataCsv)

  // console.log(dataRegistry['ep129'])

  let sliderObj = sliderHorizontal()
    .min(0)
    .max(dataRegistry[patientInfo.id].time)
    .default([0, 0]) //for one slider 0
    .ticks(4)
    // .tickValues(tickValues)
    // .step(30)
    .tickPadding(0)
    .fill('#2196f3')
    .on('onchange', function () {

    })

  function setNewPatientInfo(val) {
    console.log("setting patient info")
    setPatientInfo({ id: val.id, sample: val.sample });
    console.log('setting time range')
    setTimeRange(val.range);
  }

  // console.log(electrodeDataCsv)

  const [eegEL, setEEGEL] = useState({ id: 0, value: [92] })

  function onEventsClicked(value) {
    let values = value.electrode.sort((a, b) => a - b);
    setEEGEL({ id: value.index, value: values })
  }

  return (
    // <div>debugging</div>
    // component container
    <Container fluid id="container">
      {/* nav bar */}
      <Row style={{ height: '5vh' }}>
        <Col md='6' style={{ height: '5vh' }}>
          {/* dropdown menues */}
          <ElectrodeDropDown
            setNewPatientInfo={setNewPatientInfo}
          />
        </Col>
        <Col md='6' style={{ height: '5vh' }}>
          <TimeSliderButton
            sliderObj={sliderObj}
          />
        </Col>
      </Row>
      {/* vis */}
      <Row style={{ height: '50vh' }}>
        <Col md='4'>
          <EEGDataViewer
            eegEL={eegEL}
            patientInfo={patientInfo}
          />
        </Col>
        <Col md='4'>
          <ENChordContainer
            epatient={patientInfo}
            samples={sampleData}
            electrodes={electrodeDataCsv}
          />
        </Col>
        <Col md='4'>
          {/* top view - electrode and brain 3D model */}
          <Row>
            <ENTContainer
              patientInformation={patientInfo}
              electrodeData={electrodeDataCsv}
              sample={sampleData}
              slider={sliderObj}
              time={timeRange}
              events={eventData}
            />
          </Row>

        </Col>
      </Row>
      <Row>
        <Col md='12' style={{ height: '45vh' }}>
          <Row>
            <EventViewer
              data={eventData}
              sliderObj={sliderObj}
              onEventsClicked={onEventsClicked}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
