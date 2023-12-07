import { Row, Col, } from "react-bootstrap"
import { Segmented } from 'antd'
import { useState } from "react";
import { TimeSliderButton } from "./TimeSliderButton";
import { Switch, FormControl, FormLabel } from '@chakra-ui/react'
import { BrainViewer } from "./BrainViewer";
import './brainViewer.css'

export const ENTContainer = ({
    patientInformation,
    electrodeData,
    sample,
    time,
    events,
    allnetworks,
    eventid,
    selectedEventRange,
    eegInBrain
}) => {
    const [sliderValue, setSliderValue] = useState([0, 0])

    // console.log(bboxCenter)
    const [buttonValue, setButtonValue] = useState('Play');

    const [segment, setSegment] = useState('ROI')

    const [seeRoi, setSeeRoi] = useState(false);

    function onSegmentChange(value) {
        setSegment(value)
    }

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
            <Row>
                <Col md='12' style={{ height: '5vh' }}>
                    <Segmented
                        options={["ROI", "Frequncy", "Community", "Curve"]}
                        onChange={onSegmentChange}
                        defaultValue={'ROI'}
                    >
                    </Segmented>
                </Col>
            </Row>
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
                            visualPanel={segment}
                        />
                    </Row>
                </Col>
            </Row>
        </>
    )
}