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


// data URLS
const electrodeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187_electrodes_new.csv"
const sample1URL1 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_0.csv'
const sample1URL2 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_30000.csv'
const sample1URL3 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_60000.csv'
const sample1URL4 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_90000.csv'
const sample1URL5 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_120000.csv'
const sample1URL6 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_150000.csv'
const sample1URL7 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_180000.csv'
const sample1URL8 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_210000.csv'
const sample1URL9 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_240000.csv'
const sample1URL10 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_270000.csv'
const sample1URL11 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_300000.csv'
const sample1URL12 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_330000.csv'
const sample1URL13 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_360000.csv'
const sample1URL14 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_390000.csv'
const sample1URL15 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_420000.csv'
const sample1URL16 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_450000.csv'
const sample1URL17 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_480000.csv'
const sample1URL18 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_510000.csv'
const sample1URL19 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_540000.csv'
const sample1URL20 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample1/sample1_570000.csv'


const sample2URL1 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_0.csv'
const sample2URL2 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_30000.csv'
const sample2URL3 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_60000.csv'
const sample2URL4 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_90000.csv'
const sample2URL5 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_120000.csv'
const sample2URL6 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_150000.csv'
const sample2URL7 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_180000.csv'
const sample2URL8 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_210000.csv'
const sample2URL9 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_240000.csv'
const sample2URL10 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_270000.csv'
const sample2URL11 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_300000.csv'
const sample2URL12 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_330000.csv'
const sample2URL13 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_360000.csv'
const sample2URL14 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_390000.csv'
const sample2URL15 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_420000.csv'
const sample2URL16 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_450000.csv'
const sample2URL17 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_480000.csv'
const sample2URL18 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_510000.csv'
const sample2URL19 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_540000.csv'
const sample2URL20 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample2/sample2_570000.csv'


const sample3URL1 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_0.csv'
const sample3URL2 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_30000.csv'
const sample3URL3 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_60000.csv'
const sample3URL4 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_90000.csv'
const sample3URL5 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_120000.csv'
const sample3URL6 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_150000.csv'
const sample3URL7 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_180000.csv'
const sample3URL8 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_210000.csv'
const sample3URL9 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_240000.csv'
const sample3URL10 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_270000.csv'
const sample3URL11 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_300000.csv'
const sample3URL12 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_330000.csv'
const sample3URL13 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_360000.csv'
const sample3URL14 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_390000.csv'
const sample3URL15 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_420000.csv'
const sample3URL16 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_450000.csv'
const sample3URL17 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_480000.csv'
const sample3URL18 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_510000.csv'
const sample3URL19 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_540000.csv'
const sample3URL20 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/colorAnimation/src/data/electrodes/ep187/sample3/sample3_570000.csv'


function App() {

  const testPromise = useSamples({ sampleName: [sample1URL1, sample1URL1, sample1URL1, sample1URL1] })
  console.log(testPromise)
  // loading brain and lesions
  const multiBrain = useOBJThreeStates({ objType: brain });
  const multiLesion1 = useOBJThreeStates({ objType: lesion1_para });
  const multiLesion2 = useOBJThreeStates({ objType: lesion2_para });
  const multiLesion3 = useOBJThreeStates({ objType: lesion3_para });

  // getting the center of the objtects
  const bboxCenter = useBBoxcenter({ objType: brain });

  // loading the data
  const electrodeDataCsv = useElectrodeData({ url: electrodeURL });
  const sample1CSV = usePropagationData({ url: sample1URL1 });
  const sample1CSV2 = usePropagationData({ url: sample1URL2 });
  const sample1CSV3 = usePropagationData({ url: sample1URL3 });
  const sample1CSV4 = usePropagationData({ url: sample1URL4 });
  const sample1CSV5 = usePropagationData({ url: sample1URL5 });
  const sample1CSV6 = usePropagationData({ url: sample1URL6 });
  const sample1CSV7 = usePropagationData({ url: sample1URL7 });
  const sample1CSV8 = usePropagationData({ url: sample1URL8 });
  const sample1CSV9 = usePropagationData({ url: sample1URL9 });
  const sample1CSV10 = usePropagationData({ url: sample1URL10 });
  const sample1CSV11 = usePropagationData({ url: sample1URL11 });
  const sample1CSV12 = usePropagationData({ url: sample1URL12 });
  const sample1CSV13 = usePropagationData({ url: sample1URL13 });
  const sample1CSV14 = usePropagationData({ url: sample1URL14 });
  const sample1CSV15 = usePropagationData({ url: sample1URL15 });
  const sample1CSV16 = usePropagationData({ url: sample1URL16 });
  const sample1CSV17 = usePropagationData({ url: sample1URL17 });
  const sample1CSV18 = usePropagationData({ url: sample1URL18 });
  const sample1CSV19 = usePropagationData({ url: sample1URL19 });
  const sample1CSV20 = usePropagationData({ url: sample1URL20 });

  console.log(sample1CSV)
  const sample2CSV = usePropagationData({ url: sample2URL1 });
  const sample2CSV2 = usePropagationData({ url: sample2URL2 });
  const sample2CSV3 = usePropagationData({ url: sample2URL3 });
  const sample2CSV4 = usePropagationData({ url: sample2URL4 });
  const sample2CSV5 = usePropagationData({ url: sample2URL5 });
  const sample2CSV6 = usePropagationData({ url: sample2URL6 });
  const sample2CSV7 = usePropagationData({ url: sample2URL7 });
  const sample2CSV8 = usePropagationData({ url: sample2URL8 });
  const sample2CSV9 = usePropagationData({ url: sample2URL9 });
  const sample2CSV10 = usePropagationData({ url: sample2URL10 });
  const sample2CSV11 = usePropagationData({ url: sample2URL11 });
  const sample2CSV12 = usePropagationData({ url: sample2URL12 });
  const sample2CSV13 = usePropagationData({ url: sample2URL13 });
  const sample2CSV14 = usePropagationData({ url: sample2URL14 });
  const sample2CSV15 = usePropagationData({ url: sample2URL15 });
  const sample2CSV16 = usePropagationData({ url: sample2URL16 });
  const sample2CSV17 = usePropagationData({ url: sample2URL17 });
  const sample2CSV18 = usePropagationData({ url: sample2URL18 });
  const sample2CSV19 = usePropagationData({ url: sample2URL19 });
  const sample2CSV20 = usePropagationData({ url: sample2URL20 });


  const sample3CSV = usePropagationData({ url: sample3URL1 });
  const sample3CSV2 = usePropagationData({ url: sample3URL2 });
  const sample3CSV3 = usePropagationData({ url: sample3URL3 });
  const sample3CSV4 = usePropagationData({ url: sample3URL4 });
  const sample3CSV5 = usePropagationData({ url: sample3URL5 });
  const sample3CSV6 = usePropagationData({ url: sample3URL6 });
  const sample3CSV7 = usePropagationData({ url: sample3URL7 });
  const sample3CSV8 = usePropagationData({ url: sample3URL8 });
  const sample3CSV9 = usePropagationData({ url: sample3URL9 });
  const sample3CSV10 = usePropagationData({ url: sample3URL10 });
  const sample3CSV11 = usePropagationData({ url: sample3URL11 });
  const sample3CSV12 = usePropagationData({ url: sample3URL12 });
  const sample3CSV13 = usePropagationData({ url: sample3URL13 });
  const sample3CSV14 = usePropagationData({ url: sample3URL14 });
  const sample3CSV15 = usePropagationData({ url: sample3URL15 });
  const sample3CSV16 = usePropagationData({ url: sample3URL16 });
  const sample3CSV17 = usePropagationData({ url: sample3URL17 });
  const sample3CSV18 = usePropagationData({ url: sample3URL18 });
  const sample3CSV19 = usePropagationData({ url: sample3URL19 });
  const sample3CSV20 = usePropagationData({ url: sample3URL20 });


  const lists1 = [sample1CSV, sample1CSV2, sample1CSV3, sample1CSV4, sample1CSV5, sample1CSV6, sample1CSV7, sample1CSV8, sample1CSV9, sample1CSV10, sample1CSV11, sample1CSV12, sample1CSV13, sample1CSV14, sample1CSV15, sample1CSV16, sample1CSV17, sample1CSV18, sample1CSV19, sample1CSV20]

  const lists2 = [sample2CSV, sample2CSV2, sample2CSV3, sample2CSV4, sample2CSV5, sample2CSV6, sample2CSV7, sample2CSV8, sample2CSV9, sample2CSV10, sample2CSV11, sample2CSV12, sample2CSV13, sample2CSV14, sample2CSV15, sample2CSV16, sample2CSV17, sample2CSV18, sample2CSV19, sample2CSV20]

  const lists3 = [sample3CSV, sample3CSV2, sample3CSV3, sample3CSV4, sample3CSV5, sample3CSV6, sample3CSV7, sample3CSV8, sample3CSV9, sample3CSV10, sample3CSV11, sample3CSV12, sample3CSV13, sample3CSV14, sample3CSV15, sample3CSV16, sample3CSV17, sample3CSV18, sample3CSV19, sample3CSV20]

  const [electrodeNetworkValue, setElectrodeVal] = useState(["TopPercentile", "100"])

  let tickValues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300,
    330, 360, 390, 420, 450, 480, 510, 540, 570, 600]

  let sliderObj = sliderHorizontal()
    .min(0)
    .max(600)
    .default([0, 0]) //for one slider 0
    .ticks(4)
    .tickValues(tickValues)
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

  // console.log(electrodeDataCsv)

  return (
    // <div>debugging</div>
    // component container
    <ComponentContainer
      electrodeData={electrodeDataCsv} //electrode data set
      sampleData={sample1CSV} // propagation sample first 10 minutes
      sampleData2={sample1CSV2} // propagation sample second 10 minutes
      sampleData3={sample1CSV3} // propagation sample third 10 minutes
      multiBrain={multiBrain} //brain objs
      multiLesion1={multiLesion1} //lesion1 objs
      multiLesion2={multiLesion2} //lesion2 objs
      multiLesion3={multiLesion3} // lesion3 objs
      bboxCenter={bboxCenter} //box center
      electrodeNetworkValue={electrodeNetworkValue}
      setElectrodeNetworkValue={setElectrodeNetworkValue}
      sliderObj={sliderObj}
      tickValues={tickValues}
      sampledataList1={lists1}
      sampledataList2={lists2}
      sampledataList3={lists3}
    />
  );
}

export default App;
