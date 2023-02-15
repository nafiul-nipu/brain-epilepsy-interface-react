import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { sliderHorizontal } from 'd3-simple-slider'

// importing components
import { ComponentContainer } from './components/ComponentContainer';
import { useElectrodeData } from './library/useElectrodeData';
import { useBBoxcenter } from './library/useBBoxcenter';
import { useOBJThreeStates } from './library/useOBJThreeStates';
import { useSamples } from './library/useSamples';

// importing objfiles
// import brain from "./models/brain.obj"
// import lesion1_para from './models/lesion1_para.obj';
// import lesion2_para from './models/lesion2_para.obj';
// import lesion3_para from './models/lesion3_para.obj';
import { useState } from 'react';

import dataRegistry from './data/dataRegistry.json'

function App() {
  // console.log(dataRegistry)
  const [patientInfo, setPatientInfo] = useState({ id: 'ep187', sample: 'sample1' })
  const [timeRange, setTimeRange] = useState(1000)

  const sampleData = useSamples({
    patientID: patientInfo.id,
    sampleName: patientInfo.sample,
    range: timeRange
  })

  // loading brain and lesions
  const multiBrain = useOBJThreeStates({ patient: patientInfo.id, objType: 'brain.obj' });
  const multiLesion1 = useOBJThreeStates({ patient: patientInfo.id, objType: 'lesion1.obj' });
  const multiLesion2 = useOBJThreeStates({ patient: patientInfo.id, objType: 'lesion2.obj' });
  const multiLesion3 = useOBJThreeStates({ patient: patientInfo.id, objType: 'lesion3.obj' });

  // getting the center of the objtects
  const bboxCenter = useBBoxcenter({ patient: patientInfo.id, objType: 'brain.obj' });

  // loading the data
  const electrodeDataCsv = useElectrodeData({ id: patientInfo.id });

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
    setPatientInfo({ id: val.id, sample: val.sample });
    setTimeRange(val.range);
  }

  // console.log(electrodeDataCsv)

  return (
    // <div>debugging</div>
    // component container
    <ComponentContainer
      electrodeData={electrodeDataCsv} //electrode data set
      sampleData={sampleData} // propagation sample 10 minutes
      multiBrain={multiBrain} //brain objs
      multiLesion1={multiLesion1} //lesion1 objs
      multiLesion2={multiLesion2} //lesion2 objs
      multiLesion3={multiLesion3} // lesion3 objs
      bboxCenter={bboxCenter} //box center
      setNewPatientInfo={setNewPatientInfo}
      sliderObj={sliderObj}
      timeRange={timeRange}
    />
  );
}

export default App;
