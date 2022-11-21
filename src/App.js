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


const electrodeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/ep187_electrodes_new.csv"
const sampleURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample1RealPosition.csv'


function App() {
  const brainOBJ = useOBJThreeJS({ objType: brain });
  const brain2OBJ = useOBJThreeJS({ objType: brain });
  const brain3OBJ = useOBJThreeJS({ objType: brain });
  const brain4OBJ = useOBJThreeJS({ objType: brain });
  const brain5OBJ = useOBJThreeJS({ objType: brain });
  const bboxCenter = useBBoxcenter({ obj: brain4OBJ })
  // console.log(bboxCenter);

  const electrodeDataCsv = useElectrodeData({ url: electrodeURL });
  const sampleDataCSV = usePropagationData({ url: sampleURL });

  // if(brainOBJ){

  // }
  const lesion1OBJ = useOBJThreeJS({ objType: lesion1_para });
  const lesion2OBJ = useOBJThreeJS({ objType: lesion2_para });
  const lesion3OBJ = useOBJThreeJS({ objType: lesion3_para });

  const lesion1OBJ2 = useOBJThreeJS({ objType: lesion1_para });
  const lesion2OBJ2 = useOBJThreeJS({ objType: lesion2_para });
  const lesion3OBJ2 = useOBJThreeJS({ objType: lesion3_para });



  return (
    // <div>debugging</div>
    <ComponentContainer
      electrodeData={electrodeDataCsv}
      sampleData={sampleDataCSV}
      brain={brainOBJ}
      brainCopy={brain2OBJ}
      brainCopy2={brain3OBJ}
      brainCopy3={brain5OBJ}
      lesion11={lesion1OBJ}
      lesion12={lesion2OBJ}
      lesion13={lesion3OBJ}
      lesion21={lesion1OBJ2}
      lesion22={lesion2OBJ2}
      lesion23={lesion3OBJ2}
      bboxCenter={bboxCenter}
    />
  );
}

export default App;
