import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ComponentContainer } from './components/ComponentContainer';
import { useElectrodeData } from './library/useElectrodeData';
import { usePropagationData } from './library/usePropagationData';
import { useOBJThreeJS } from './library/useOBJThreeJS';

import brain from "./models/brain.obj"
import lesion1_para from './models/lesion1_para.obj';
import lesion2_para from './models/lesion2_para.obj';
import lesion3_para from './models/lesion3_para.obj';


const electrodeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/ep187_electrodes_new.csv"
const sampleURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample1RealPosition.csv'


function App() {
  const brainOBJ = useOBJThreeJS({ objType: brain });
  const brain2OBJ = useOBJThreeJS({ objType: brain });
  const brain3OBJ = useOBJThreeJS({ objType: brain });
  const electrodeDataCsv = useElectrodeData({ url: electrodeURL });
  const sampleDataCSV = usePropagationData({ url: sampleURL });

  // if(brainOBJ){

  // }
  const lesion1OBJ = useOBJThreeJS({ objType: lesion1_para });

  const lesion2OBJ = useOBJThreeJS({ objType: lesion2_para });

  const lesion3OBJ = useOBJThreeJS({ objType: lesion3_para });

  // console.log(lesion1OBJ);

  return (
    // <div>debugging</div>
    <ComponentContainer
      electrodeData={electrodeDataCsv}
      sampleData={sampleDataCSV}
      brain={brainOBJ}
      brainCopy={brain2OBJ}
      brainCopy2={brain3OBJ}
      lesion1={lesion1OBJ}
      lesion2={lesion2OBJ}
      lesion3={lesion3OBJ}
    />
  );
}

export default App;
