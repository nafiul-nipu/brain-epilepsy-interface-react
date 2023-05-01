import { Row, Col, Form } from "react-bootstrap"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { useOBJThreeStates } from "../../library/useOBJThreeStates";
import { useLesionData } from "../../library/useLesionData";
import { useBBoxcenter } from "../../library/useBBoxcenter";
import { useState } from "react";
import { TimeSliderButton } from "./TimeSliderButton";

export const ENTContainer = ({
    patientInformation,
    electrodeData,
    sample,
    time,
    events,
    allnetworks,
    allnetworksWithEvent,
    view,
    eventid,
    selectedEventRange
}) => {
    const [sliderValue, setSliderValue] = useState([0, 0])
    // loading brain and lesions
    const multiBrain = useOBJThreeStates({ patient: patientInformation.id, objType: 'brain.obj' });
    // console.log('brain', multiBrain)
    const lesions = useLesionData({ patient: patientInformation.id })
    // console.log('lesions', lesions)

    // getting the center of the objtects
    const bboxCenter = useBBoxcenter({ patient: patientInformation.id, objType: 'brain.obj' });

    const [buttonValue, setButtonValue] = useState('Play');

    function handleClick() {
        if (buttonValue === 'Pause') {
            setButtonValue('Play');
        } else {
            setButtonValue('Pause');
        }
    }

    // console.log(eventid)

    return (
        <>
            <Row >
                <TimeSliderButton
                    id={view}
                    buttonValue={buttonValue}
                    handleClick={handleClick}
                    sliderValue={sliderValue}
                    setSliderValue={setSliderValue}
                    patientID={patientInformation.id}
                />
            </Row>
            <Row>
                <Col md='12' style={{ height: '35vh' }}>
                    <Row>
                        <div id="titleBrain1">{`${patientInformation.id}: Propagation Over Time`}</div>
                        <ElectrodeNetworkTumor
                            brain={multiBrain.obj1} //ok
                            electrodeData={electrodeData} //ok
                            sampleData={sample} //ok
                            bboxCenter={bboxCenter} //ok
                            sliderObj={setSliderValue}
                            timeRange={time}
                            lesions={lesions} //ok
                            eventData={events}
                            allnetwork={allnetworks}
                            allnetworkWithEvent={allnetworksWithEvent}
                            patientID={patientInformation.id}
                            view={view}
                            buttonValue={buttonValue}
                            eventid={eventid}
                            selectedEventRange={selectedEventRange}
                        />
                    </Row>
                </Col>
            </Row>
        </>
    )
}