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
    eegList,
    setEegInBrain,
    patchRegionToggle
}) => {
    // console.log(community)
    // console.log(topPercent)
    const [sliderValue, setSliderValue] = useState([0, 1000])

    // console.log(bboxCenter)
    const [buttonValue, setButtonValue] = useState('Play');

    const [segment, setSegment] = useState('Patches')

    const [sampleDomain, setSampleDomain] = useState(null)

    const [propagationSlider, setPropagationSlider] = useState([0, 60000])
    const [propagatoinButtonValue, setPropagationButtonValue] = useState('Play')

    // const [seeRoi, setSeeRoi] = useState(false);

    function onSegmentChange(value) {
        if (value === 'Frequency') {
            if (sample === null) return;

            // Flatten the array of arrays into a single array of objects
            const flattenedArray = [].concat(...sample);

            // Use reduce to find the max and min frequencies
            const { maxFrequency, minFrequency } = flattenedArray.reduce(
                (result, obj) => {
                    const frequency = obj.frequency;

                    // Update max frequency
                    result.maxFrequency = Math.max(result.maxFrequency, frequency);

                    // Update min frequency
                    result.minFrequency = Math.min(result.minFrequency, frequency);

                    return result;
                },
                { maxFrequency: -Infinity, minFrequency: Infinity }
            );

            setSampleDomain([minFrequency, maxFrequency]);
        }
        setSegment(value)
    }

    function handleClick() {
        if (buttonValue === 'Pause') {
            setButtonValue('Play');
        } else {
            setButtonValue('Pause');
        }
    }

    function handlePropagationClick() {
        if (propagatoinButtonValue === 'Pause') {
            setPropagationButtonValue('Play');
        } else {
            setPropagationButtonValue('Pause');
        }
    }

    // console.log(community)


    return (
        <>
            <Row>
                <Col md='12' style={{ height: '5vh' }}>
                    <Segmented
                        options={["Patches", "Frequency", "Propagation", "Community", "Patch-Com-Net", "Region-Com-Net"]}
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
                    propagationSlider={propagationSlider}
                    setPropagationSlider={setPropagationSlider}
                    propagatoinButtonValue={propagatoinButtonValue}
                    handlePropagationClick={handlePropagationClick}
                />
            </Row>
            <Row>
                <Col md='12' style={{ height: '35vh' }}>
                    <Row>
                        {
                            segment === 'Community' ? null :
                                segment === 'Patches' ? <div id="titleBrain1">{`${patientInformation.id}: Brain Patches`}</div> :
                                    segment === 'Frequency' ? <div id="titleBrain1">{`${patientInformation.id}: Spikes Over Time`}</div> :
                                        segment === 'Propagation' ? <div id="titleBrain1">{`${patientInformation.id}: Propagation Over Time`}</div> :
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
                            sampleDomain={sampleDomain}
                            setEegInBrain={setEegInBrain}
                            patchRegionToggle={patchRegionToggle}
                        />
                    </Row>
                </Col>
            </Row>
        </>
    )
}