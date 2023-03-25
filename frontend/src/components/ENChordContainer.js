import { Row, Col, Form } from "react-bootstrap"
import { ElectrodeNetworkChord3D } from "./ElectrodeNetworkChord3D"
import { useBBoxcenter } from "../library/useBBoxcenter";
import { useOBJThreeStates } from "../library/useOBJThreeStates";
import { useFullNetwork } from "../library/useFullNetwork";
import { useFullNetworkPerEvent } from "../library/useFullNetworkPerEvent";
import { useState } from "react";

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

    const [isChecked, setIsChecked] = useState(true);


    const handleCheckboxChange = (event) => {
        // console.log(event.target.checked)
        setIsChecked(event.target.checked);
    };

    return (
        <Col>
            <Row>
                <Col id="titleBrain1">Electrode network</Col>
                <Col md='1' id="svgcheckbox">

                    <Form>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Network"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />

                    </Form>
                </Col>
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
                    drawSVG={isChecked}
                />
            </Row>
        </Col>
    )
}