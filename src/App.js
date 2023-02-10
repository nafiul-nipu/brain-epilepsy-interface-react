import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { sliderHorizontal } from 'd3-simple-slider'

// importing components
import { ComponentContainer } from './components/ComponentContainer';
import { useElectrodeData } from './library/useElectrodeData';
import { usePropagationData } from './library/usePropagationData';
import { useBBoxcenter } from './library/useBBoxcenter';
import { useOBJThreeStates } from './library/useOBJThreeStates';
import { useSamples } from './library/useSamples';

// importing objfiles
import brain from "./models/brain.obj"
import lesion1_para from './models/lesion1_para.obj';
import lesion2_para from './models/lesion2_para.obj';
import lesion3_para from './models/lesion3_para.obj';
import { useState } from 'react';

function App() {
  const [patient, setPatient] = useState('ep187')
  const [sample, setSample] = useState('sample1')

  const sample1 = useSamples({
    patientID: 'ep187',
    sampleName: 'sample1'
  })

  const sample2 = useSamples({
    patientID: 'ep187',
    sampleName: 'sample2'
  })

  const sample3 = useSamples({
    patientID: 'ep187',
    sampleName: 'sample3'
  })

  // loading brain and lesions
  const multiBrain = useOBJThreeStates({ objType: brain });
  const multiLesion1 = useOBJThreeStates({ objType: lesion1_para });
  const multiLesion2 = useOBJThreeStates({ objType: lesion2_para });
  const multiLesion3 = useOBJThreeStates({ objType: lesion3_para });

  // getting the center of the objtects
  const bboxCenter = useBBoxcenter({ objType: brain });

  // loading the data
  const electrodeDataCsv = useElectrodeData({ id: patient });

  const [electrodeNetworkValue, setElectrodeVal] = useState(["TopPercentile", "100"])

  let tickValues = Array.from({ length: 600 / 2 + 1 }, (_, i) => i * 2);

  let sliderObj = sliderHorizontal()
    .min(0)
    .max(600)
    .default([0, 0]) //for one slider 0
    .ticks(4)
    // .tickValues(tickValues)
    // .step(30)
    .tickPadding(0)
    .fill('#2196f3')
    .on('onchange', function () {

    })

  function setElectrodeNetworkValue(val) {
    // console.log(val)
    setElectrodeVal(val)
    // console.log(electrodeNetworkValue)
  }

  console.log(electrodeDataCsv)

  return (
    // <div>debugging</div>
    // component container
    <ComponentContainer
      electrodeData={electrodeDataCsv} //electrode data set
      sampleData={sample1} // propagation sample first 10 minutes
      sampleData2={sample2} // propagation sample second 10 minutes
      sampleData3={sample3} // propagation sample third 10 minutes
      multiBrain={multiBrain} //brain objs
      multiLesion1={multiLesion1} //lesion1 objs
      multiLesion2={multiLesion2} //lesion2 objs
      multiLesion3={multiLesion3} // lesion3 objs
      bboxCenter={bboxCenter} //box center
      electrodeNetworkValue={electrodeNetworkValue}
      setElectrodeNetworkValue={setElectrodeNetworkValue}
      sliderObj={sliderObj}
      tickValues={tickValues}
      sampledataList1={sample1}
      sampledataList2={sample2}
      sampledataList3={sample3}
    />
  );
}

export default App;
