import { Row, Col } from "react-bootstrap"
import { ElectrodeNetworkChord3D } from "./ElectrodeNetworkChord3D"
import { useBBoxcenter } from "../library/useBBoxcenter";
import { useOBJThreeStates } from "../library/useOBJThreeStates";
import { useFullNetwork } from "../library/useFullNetwork";
import { useFullNetworkPerEvent } from "../library/useFullNetworkPerEvent";

export const ENChordContainer = ({
    epatient,
    samples,
    electrodes,
    allnetworks,
    allnetworksWithEvent
}) => {
    // loading brain and lesions
    const multiBrain = useOBJThreeStates({ patient: epatient.id, objType: 'brain.obj' });
    // console.log('brain', multiBrain)
    // getting the center of the objtects
    const bboxCenter = useBBoxcenter({ patient: epatient.id, objType: 'brain.obj' });
    // console.log('bbox', bboxCenter)

    // const fullNetwork = useFullNetwork({
    //     patientID: epatient.id,
    //     sample: epatient.sample
    // })

    // const fullEventNetwork = useFullNetworkPerEvent({
    //     patientID: epatient.id,
    //     sample: epatient.sample
    // })

    // console.log(fullNetwork)
    // console.log(fullEventNetwork)

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
                    allnetwork={allnetworks}
                    allnetworkWithEvent={allnetworksWithEvent}
                    patientID={epatient.id}
                />
            </Row>
        </Col>
    )
}