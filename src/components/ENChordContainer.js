import { Row, Col } from "react-bootstrap"
import { ElectrodeNetworkChord3D } from "./ElectrodeNetworkChord3D"
import { useBBoxcenter } from "../library/useBBoxcenter";
import { useOBJThreeStates } from "../library/useOBJThreeStates";

export const ENChordContainer = ({
    epatient,
    samples,
    electrodes
}) => {
    // loading brain and lesions
    const multiBrain = useOBJThreeStates({ patient: epatient.id, objType: 'brain.obj' });
    // console.log('brain', multiBrain)
    // getting the center of the objtects
    const bboxCenter = useBBoxcenter({ patient: epatient.id, objType: 'brain.obj' });
    // console.log('bbox', bboxCenter)

    return (
        <Col>
            <Row>
                <Col id="titleBrain1">Electrode network</Col>
            </Row>
            <Row>
                <ElectrodeNetworkChord3D
                    brain={multiBrain.obj1}
                    electrodeData={electrodes}
                    sampleData={samples}
                    bboxCenter={bboxCenter}
                />
            </Row>
        </Col>
    )
}