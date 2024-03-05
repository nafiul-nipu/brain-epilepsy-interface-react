import { Row, Col, } from "react-bootstrap"
import { Segmented } from 'antd'
import { useState } from "react";
import { TimeSliderButton } from "./TimeSliderButton";
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
    eegInBrain,
    topPercent,
    selectedRoi,
    eegList
}) => {
    // console.log(community)
    // console.log(topPercent)
    const [sliderValue, setSliderValue] = useState([0, 1000])

    // console.log(bboxCenter)
    const [buttonValue, setButtonValue] = useState('Play');

    const [segment, setSegment] = useState('Patches')

    // const [seeRoi, setSeeRoi] = useState(false);

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

    // console.log(community)


    return (
        <>
            <Row>
                <Col md='12' style={{ height: '5vh' }}>
                    <Segmented
                        options={["Patches", "Frequency", "Community", "Patch-Com-Net", "Region-Com-Net"]}
                        onChange={onSegmentChange}
                        defaultValue={'Patches'}
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
                    visualPanel={segment}
                    totalSamples={community[topPercent].map((el) => el.sample)}
                    totalCommunities={community[topPercent].map((el) => el.communityList.length)}
                />
            </Row>
            <Row>
                <Col md='12' style={{ height: '35vh' }}>
                    <Row>
                        {
                            segment === 'Community' ? null :
                                segment === 'Patches' ? <div id="titleBrain1">{`${patientInformation.id}: Brain Patches`}</div> :
                                    segment === 'Frequency' ? <div id="titleBrain1">{`${patientInformation.id}: Propagation Over Time`}</div> :
                                        segment === 'Patch-Com-Net' ? <div id="titleBrain1">{`${patientInformation.id}: Patch Network`}</div> :
                                            <div id="titleBrain1">{`${patientInformation.id}: Region Network`}</div>
                        }
                        <BrainViewer
                            patientInformation={patientInformation}
                            electrodeData={electrodeData}
                            sample={sample}
                            community={community[topPercent]}
                            time={time}
                            events={events}
                            allnetworks={allnetworks}
                            eegInBrain={eegInBrain}
                            sliderObj={setSliderValue}
                            buttonValue={buttonValue}
                            visualPanel={segment}
                            topPercent={topPercent}
                            selectedRoi={selectedRoi}
                            eegList={eegList}
                        />
                    </Row>
                </Col>
            </Row>
        </>
    )
}