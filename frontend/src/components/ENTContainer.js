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
    events
}) => {
    // loading brain and lesions
    const multiBrain = useOBJThreeStates({ patient: patientInformation.id, objType: 'brain.obj' });
    // console.log('brain', multiBrain)
    const lesions = useLesionData({ patient: patientInformation.id })
    // console.log('lesions', lesions)

    // getting the center of the objtects
    const bboxCenter = useBBoxcenter({ patient: patientInformation.id, objType: 'brain.obj' });


    // console.log('bbox', bboxCenter)

    return (
        <Col>
            <Row>
                <Col id="titleBrain1" md='6'>Propagation Over Time</Col>

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
                />
            </Row>
        </Col>
    )
}