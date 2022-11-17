import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { ComponentContainer } from './components/ComponentContainer';
import { useOBJData } from './library/useOBJData';
import { useElectrodeData } from './library/useElectrodeData';
import { usePropagationData } from './library/usePropagationData';

import brain from "./models/brain.obj"
import lesion1_para from './models/lesion1_para.obj';
import lesion2_para from './models/lesion2_para.obj';
import lesion3_para from './models/lesion3_para.obj';
import { useOBJThreeJS } from './library/useOBJThreeJS';

const electrodeURL = "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/ep187_electrodes_new.csv"
const sampleURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/src/data/electrodes/newSample1RealPosition.csv'
const electrodeData = [
  [61.7397994995117, 139.014129638672, 178.866790771484],
  [57.0425949096680, 139.287994384766, 172.553298950195],
  [52.6332588195801, 139.174285888672, 168.291290283203],
  [49.9343223571777, 139.158569335938, 163.294281005859],
  [47.0855522155762, 139.024169921875, 158.372970581055],
  [58.0416793823242, 131.243377685547, 179.853149414063],
  [53.8179206848145, 130.746154785156, 173.396087646484],
  [50.9673805236816, 130.553924560547, 168.459442138672],
  [48.1004180908203, 130.171569824219, 163.658401489258],
  [47.0327911376953, 130.298995971680, 158.395172119141],
  [44.5878067016602, 152.413452148438, 127.619720458984],
  [46.5737419128418, 153.781738281250, 122.439125061035],
  [50.5636215209961, 155.926162719727, 118.359619140625],
  [54.1101531982422, 157.709716796875, 113.420326232910],
  [60.9065780639648, 159.683746337891, 110.268630981445],
  [45.3121032714844, 142.812438964844, 126.440490722656],
  [49.4790573120117, 145.072082519531, 121.394447326660],
  [50.6709136962891, 147.108184814453, 117.142639160156],
  [54.8323822021484, 149.705718994141, 112.750564575195],
  [60.2906494140625, 149.689758300781, 109.682693481445]
];

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
