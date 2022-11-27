import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ComponentContainer } from './components/ComponentContainer';
import { useElectrodeData } from './library/useElectrodeData';
import { usePropagationData } from './library/usePropagationData';
import { useOBJThreeJS } from './library/useOBJThreeJS';
import { useBBoxcenter } from './library/useBBoxcenter';

import brain from "./models/brain.obj"
import lesion1_para from './models/lesion1_para.obj';
import lesion2_para from './models/lesion2_para.obj';
import lesion3_para from './models/lesion3_para.obj';
import { useOBJThreeStates } from './library/useOBJThreeStates';


const electrodeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/ep187_electrodes_new.csv"
const sampleURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample1RealPosition.csv'
const sampleURL2 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample2RealPosition.csv'
const sampleURL3 = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample3RealPosition.csv'


function App() {
  const multiBrain = useOBJThreeStates({ objType: brain });
  const multiLesion1 = useOBJThreeStates({ objType: lesion1_para });
  const multiLesion2 = useOBJThreeStates({ objType: lesion2_para });
  const multiLesion3 = useOBJThreeStates({ objType: lesion3_para });


  const bboxCenter = useBBoxcenter({ objType: brain });

  const electrodeDataCsv = useElectrodeData({ url: electrodeURL });
  const sampleDataCSV = usePropagationData({ url: sampleURL });
  const sampleDataCSV2 = usePropagationData({ url: sampleURL2 });
  const sampleDataCSV3 = usePropagationData({ url: sampleURL3 });


  return (
    // <div>debugging</div>
    <ComponentContainer
      electrodeData={electrodeDataCsv}
      sampleData={sampleDataCSV}
      sampleData2={sampleDataCSV2}
      sampleData3={sampleDataCSV3}
      multiBrain={multiBrain}
      multiLesion1={multiLesion1}
      multiLesion2={multiLesion2}
      multiLesion3={multiLesion3}
      bboxCenter={bboxCenter}
    />
  );
}

export default App;
