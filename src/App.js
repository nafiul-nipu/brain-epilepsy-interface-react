import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { sliderHorizontal } from 'd3-simple-slider'

// importing components
import { useElectrodeData } from './library/useElectrodeData';
import { useBBoxcenter } from './library/useBBoxcenter';
import { useOBJThreeStates } from './library/useOBJThreeStates';
import { useSamples } from './library/useSamples';

import { useLesionData } from './library/useLesionData';

import { useState } from 'react';

import dataRegistry from './data/dataRegistry.json'
import { useEventData } from './library/useEventData';

import { Container, Row, Col } from "react-bootstrap"

import { EEGDataViewer } from "./components/EEGDataViewer"
import { ElectrodeDropDown } from "./components/ElectrodeDropDown"
import { ElectrodeNetworkChord3D } from "./components/ElectrodeNetworkChord3D"
import { ElectrodeNetworkTumor } from "./components/ElectrodeNetworkTumor"
import { EventViewer } from "./components/EventViewer"
// import { PropagationTimeSeries } from "./components/PropagationTimeSeries"
import { TimeSliderButton } from "./components/TimeSliderButton"


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
  // console.log(eventData)

  // console.log(eegdata)

  // console.log('eventdata', eventData)

  // loading brain and lesions
  const multiBrain = useOBJThreeStates({ patient: patientInfo.id, objType: 'brain.obj' });
  // console.log('brain', multiBrain)
  const lesions = useLesionData({ patient: patientInfo.id })
  // console.log('lesions', lesions)

  // getting the center of the objtects
  const bboxCenter = useBBoxcenter({ patient: patientInfo.id, objType: 'brain.obj' });
  // console.log('bbox', bboxCenter)

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
          // patientInfo={patientInfo}
          />
        </Col>
        <Col md='4'>
          <Col>
            <Row>
              <Col id="titleBrain1">Electrode network</Col>
            </Row>
            <Row>
              <ElectrodeNetworkChord3D
                brain={multiBrain.obj2}
                electrodeData={electrodeDataCsv}
                sampleData={sampleData}
                bboxCenter={bboxCenter}
                sliderObj={sliderObj}
                timeRange={timeRange}
                // lesions={lesions}
                eventData={eventData}
              />
            </Row>
          </Col>
        </Col>
        <Col md='4'>
          {/* top view - electrode and brain 3D model */}
          <Row>
            <Col>
              <Row>
                <Col id="titleBrain1">Propagation Over Time</Col>
              </Row>
              <Row>
                <ElectrodeNetworkTumor
                  brain={multiBrain.obj1}
                  electrodeData={electrodeDataCsv}
                  sampleData={sampleData}
                  bboxCenter={bboxCenter}
                  sliderObj={sliderObj}
                  timeRange={timeRange}
                  lesions={lesions}
                  eventData={eventData}
                />
              </Row>
            </Col>
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
