import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { sliderHorizontal } from 'd3-simple-slider'

// importing components
import { ComponentContainer } from './components/ComponentContainer';
import { useElectrodeData } from './library/useElectrodeData';
import { usePropagationData } from './library/usePropagationData';
import { useBBoxcenter } from './library/useBBoxcenter';
import { useOBJThreeStates } from './library/useOBJThreeStates';

// importing objfiles
import brain from "./models/brain.obj"
import lesion1_para from './models/lesion1_para.obj';
import lesion2_para from './models/lesion2_para.obj';
import lesion3_para from './models/lesion3_para.obj';
import { useState } from 'react';

// data URLS
const electrodeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/ep187_electrodes_new.csv"
const sampleURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample1RealPosition.csv'
const sampleURL2 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample2RealPosition.csv'
const sampleURL3 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample3RealPosition.csv'


function App() {
  // loading brain and lesions
  const multiBrain = useOBJThreeStates({ objType: brain });
  const multiLesion1 = useOBJThreeStates({ objType: lesion1_para });
  const multiLesion2 = useOBJThreeStates({ objType: lesion2_para });
  const multiLesion3 = useOBJThreeStates({ objType: lesion3_para });

  // getting the center of the objtects
  const bboxCenter = useBBoxcenter({ objType: brain });

  // loading the data
  const electrodeDataCsv = useElectrodeData({ url: electrodeURL });
  const sampleDataCSV = usePropagationData({ url: sampleURL });
  const sampleDataCSV2 = usePropagationData({ url: sampleURL2 });
  const sampleDataCSV3 = usePropagationData({ url: sampleURL3 });

  const [electrodeNetworkValue, setElectrodeVal] = useState(["TopPercentile", "5"])

  let tickValues = [0, 10, 20, 30]

  let sliderObj = sliderHorizontal()
    .min(0)
    .max(30)
    .default(0)
    .ticks(4)
    .tickValues(tickValues)
    .step(10)
    .tickPadding(0)

    .on('onchange', function () {

    })

  function setElectrodeNetworkValue(val) {
    console.log(val)
    setElectrodeVal(val)
    // console.log(electrodeNetworkValue)
  }

  // console.log(electrodeDataCsv)

  return (
    // <div>debugging</div>
    // component container
    <ComponentContainer
      electrodeData={electrodeDataCsv} //electrode data set
      sampleData={sampleDataCSV} // propagation sample first 10 minutes
      sampleData2={sampleDataCSV2} // propagation sample second 10 minutes
      sampleData3={sampleDataCSV3} // propagation sample third 10 minutes
      multiBrain={multiBrain} //brain objs
      multiLesion1={multiLesion1} //lesion1 objs
      multiLesion2={multiLesion2} //lesion2 objs
      multiLesion3={multiLesion3} // lesion3 objs
      bboxCenter={bboxCenter} //box center
      electrodeNetworkValue={electrodeNetworkValue}
      setElectrodeNetworkValue={setElectrodeNetworkValue}
      sliderObj={sliderObj}
      tickValues={tickValues}
    />
  );
}

export default App;
