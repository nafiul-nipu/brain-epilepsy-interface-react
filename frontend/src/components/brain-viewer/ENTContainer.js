import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { useOBJThreeStates } from "../../library/useOBJThreeStates";
import { useLesionData } from "../../library/useLesionData";
import { useBBoxcenter } from "../../library/useBBoxcenter";


import { Row, Col, } from "react-bootstrap"
import { useState } from "react";
import { TimeSliderButton } from "./TimeSliderButton";
import { Switch, FormControl, FormLabel } from '@chakra-ui/react'
import { BrainViewer } from "./BrainViewer";
import './brainViewer.css'

export const ENTContainer = ({
    patientInformation,
    electrodeData,
    sample,
    community,
    time,
    events,
    allnetworks,
    eventid,
    selectedEventRange,
    eegInBrain
}) => {
    const [sliderValue, setSliderValue] = useState([0, 0])


    // loading brain and lesions
    const multiBrain = useOBJThreeStates({ patient: patientInformation.id, objType: 'brain.obj' });
    // console.log(multiBrain)
    // console.log('brain', multiBrain)
    const lesions = useLesionData({ patient: patientInformation.id })
    // console.log('lesions', lesions)

    // getting the center of the objtects
    const bboxCenter = useBBoxcenter({ patient: patientInformation.id, objType: 'brain.obj' });

    // console.log(bboxCenter)
    const [buttonValue, setButtonValue] = useState('Play');

    const [seeRoi, setSeeRoi] = useState(false);

    function handleClick() {
        if (buttonValue === 'Pause') {
            setButtonValue('Play');
        } else {
            setButtonValue('Pause');
        }
    }

    // console.log(eventid)
    function roiCheckBoxChange() {
        setSeeRoi(!seeRoi)
    }


    return (
        <>
            <Row >
                <TimeSliderButton
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
                        <div id="titleBrain1">{`${patientInformation.id}: Communities Over Time`}</div>
                        <BrainViewer
                            patientInformation={patientInformation}
                            electrodeData={electrodeData}
                            sample={community}
                            time={time}
                            events={events}
                            allnetworks={allnetworks}
                            allnetworksWithEvent={allnetworks}
                            eventid={eventid}
                            selectedEventRange={selectedEventRange}
                            eegInBrain={eegInBrain}
                            sliderObj={setSliderValue}
                            buttonValue={buttonValue}
                            seeRoi={seeRoi}
                        />

                        <div id="checkBox">
                            <FormControl display='flex' alignItems='center'>
                                <FormLabel htmlFor='email-alerts' mb='0'>
                                    See ROIs
                                </FormLabel>
                                <Switch size='sm' id='email-alerts' onChange={() => { roiCheckBoxChange() }} />
                            </FormControl>
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md='12' style={{ height: '35vh' }}>
                    <Row>
                        <div id="titleBrain1">{`${patientInformation.id}: Propagation Over Time`}</div>
                        <BrainViewer
                            patientInformation={patientInformation}
                            electrodeData={electrodeData}
                            sample={sample}
                            time={time}
                            events={events}
                            allnetworks={allnetworks}
                            allnetworksWithEvent={allnetworks}
                            eventid={eventid}
                            selectedEventRange={selectedEventRange}
                            eegInBrain={eegInBrain}
                            sliderObj={setSliderValue}
                            buttonValue={buttonValue}
                            seeRoi={seeRoi}
                            dataTOshow={'sample'}
                        />
                    </Row>
                </Col>
            </Row>
        </>
    )
}