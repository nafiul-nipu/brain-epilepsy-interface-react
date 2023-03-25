import { Row, Col, Form } from "react-bootstrap"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { useOBJThreeStates } from "../library/useOBJThreeStates";
import { useLesionData } from "../library/useLesionData";
import { useBBoxcenter } from "../library/useBBoxcenter";
import { useState } from "react";

export const ENTContainer = ({
    patientInformation,
    electrodeData,
    sample,
    slider,
    time,
    events,
    allnetworks,
    allnetworksWithEvent
}) => {
    // loading brain and lesions
    const multiBrain = useOBJThreeStates({ patient: patientInformation.id, objType: 'brain.obj' });
    // console.log('brain', multiBrain)
    const lesions = useLesionData({ patient: patientInformation.id })
    // console.log('lesions', lesions)

    // getting the center of the objtects
    const bboxCenter = useBBoxcenter({ patient: patientInformation.id, objType: 'brain.obj' });

    const [isChecked, setIsChecked] = useState(true);


    const handleCheckboxChange = (event) => {
        // console.log(event.target.checked)
        setIsChecked(event.target.checked);
    };

    // console.log('bbox', bboxCenter)

    return (
        <Col>
            <Row>
                <Col id="titleBrain1" md='6'>{`${patientInformation.id}: Propagation Over Time`}</Col>
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
                <ElectrodeNetworkTumor
                    brain={multiBrain.obj1} //ok
                    electrodeData={electrodeData} //ok
                    sampleData={sample} //ok
                    bboxCenter={bboxCenter} //ok
                    sliderObj={slider} //problem
                    timeRange={time}
                    lesions={lesions} //ok
                    eventData={events}
                    allnetwork={allnetworks}
                    allnetworkWithEvent={allnetworksWithEvent}
                    patientID={patientInformation.id}
                    drawSVG={isChecked}
                />
            </Row>
        </Col>
    )
}