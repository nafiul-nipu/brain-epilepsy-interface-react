import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { sliderHorizontal } from 'd3-simple-slider'

// importing components
import { ComponentContainer } from './components/ComponentContainer';
import { useElectrodeData } from './library/useElectrodeData';
import { useBBoxcenter } from './library/useBBoxcenter';
import { useOBJThreeStates } from './library/useOBJThreeStates';
import { useSamples } from './library/useSamples';

import { useLesionData } from './library/useLesionData';

import { useState } from 'react';

import dataRegistry from './data/dataRegistry.json'
import { useEventData } from './library/useEventData';

function App() {
  // console.log(dataRegistry)
  const [patientInfo, setPatientInfo] = useState({ id: 'ep187', sample: 'sample1' })
  // console.log('patient', patientInfo)
  const [timeRange, setTimeRange] = useState(1000)
  // console.log('time', timeRange)

  const [eegEL, setEEGEL] = useState([92])

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

  function onEventsClicked(value) {
    value.sort((a, b) => a - b);
    setEEGEL(value)
  }

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
    // console.log("setting patient info")
    setPatientInfo({ id: val.id, sample: val.sample });
    // console.log('setting time range')
    setTimeRange(val.range);
  }

  // console.log(electrodeDataCsv)

  return (
    // <div>debugging</div>
    // component container
    <ComponentContainer
      electrodeData={electrodeDataCsv} //electrode data set
      sampleData={sampleData} // propagation samples
      multiBrain={multiBrain} //brain objs
      bboxCenter={bboxCenter} //box center
      setNewPatientInfo={setNewPatientInfo}
      sliderObj={sliderObj}
      timeRange={timeRange} //which time range are we showing
      lesions={lesions} // all lesions
      eventData={eventData} //event data 
      onEventsClicked={onEventsClicked}
      eegEL={eegEL}
    />
  );
}

export default App;
