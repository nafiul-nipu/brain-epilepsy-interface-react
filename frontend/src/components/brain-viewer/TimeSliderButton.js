import { Col, Row } from "react-bootstrap"
import dataRegistry from "../../data/dataRegistry.json";
import { Button } from "antd";
import './brainViewer.css'
// import { getPercentValue } from "@chakra-ui/utils";

import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderMark,
} from '@chakra-ui/react'

// let button, slider
export const TimeSliderButton = ({
    buttonValue,
    handleClick,
    sliderValue,
    setSliderValue,
    patientID,
    visualPanel,
    totalSamples,
    totalCommunities,
    propagationSlider,
    setPropagationSlider,
    propagatoinButtonValue,
    handlePropagationClick
}) => {
    const time = dataRegistry[patientID].time
    const ranges = Array.from({ length: 5 }, (_, i) => (i + 1) * (time / 4));

    if (visualPanel !== 'Patches') {
        console.log(`visualPanel: ${visualPanel}, className: ${visualPanel === 'Frequency' || visualPanel === 'Propagation' ? "timeSliderTab" : "titleTab"}`);
        return (
            <Col md='12' style={{ height: '8vh', position: 'absolute', zIndex: 100 }}>
                <Row className={visualPanel === 'Frequency' || visualPanel === 'Propagation' ? "timeSliderTab" : "titleTab"}>
                    {
                        visualPanel === 'Frequency' ? (
                            <Button
                                id={`play-pause-btn`}
                                style={{ marginLeft: '15px', width: '80px' }}
                                value={buttonValue}
                                onClick={handleClick}
                            >{buttonValue}
                            </Button>
                        )
                            :
                            visualPanel === 'Propagation' ? (
                                <Button
                                    id={`play-pause-btn`}
                                    style={{ marginLeft: '15px', width: '80px' }}
                                    value={propagatoinButtonValue}
                                    onClick={handlePropagationClick}
                                >{propagatoinButtonValue}
                                </Button>
                            )
                                : null
                    }
                    {
                        visualPanel === 'Frequency' ?
                            (
                                <>
                                    <Col md='1' className="d-flex align-items-center justify-content-center" style={{marginRight: 30, fontSize: "0.9em"}}>Time:</Col>
                                    {/* <Col md='9' ref={sliderRef}></Col> */}
                                    <Col md='5'>
                                        <RangeSlider
                                            aria-label={'min-max-slider'}
                                            // defaultValue={[30, 80]}
                                            onChange={(val) => setSliderValue(val)}
                                            max={time}
                                        >
                                            <RangeSliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>
                                                0
                                            </RangeSliderMark>
                                            <RangeSliderMark value={ranges[0]} mt='1' ml='-2.5' fontSize='sm'>
                                                {ranges[0]}
                                            </RangeSliderMark>
                                            <RangeSliderMark value={ranges[1]} mt='1' ml='-2.5' fontSize='sm'>
                                                {ranges[1]}
                                            </RangeSliderMark>
                                            <RangeSliderMark value={ranges[2]} mt='1' ml='-2.5' fontSize='sm'>
                                                {ranges[2]}
                                            </RangeSliderMark>
                                            <RangeSliderMark value={ranges[3]} mt='1' ml='-2.5' fontSize='sm'>
                                                {ranges[3]}
                                            </RangeSliderMark>
                                            <RangeSliderTrack bg='red.100'>
                                                <RangeSliderFilledTrack bg='tomato' />
                                            </RangeSliderTrack>

                                            {/* left slider */}
                                            <RangeSliderMark
                                                value={sliderValue[0]}
                                                textAlign='center'
                                                bg='blue.100'
                                                color='black'
                                                mt='-6'
                                                ml='-12'
                                                w='14'
                                            >
                                                {sliderValue[0]}
                                            </RangeSliderMark>

                                            {/* left slider marker */}
                                            <RangeSliderMark
                                                value={sliderValue[0]}
                                                textAlign='center'
                                                bg='black.500'
                                                color='black'
                                                mt='-2.5'
                                                ml='0'
                                                w='2'
                                            >
                                                |
                                            </RangeSliderMark>

                                            {/* right slider */}
                                            <RangeSliderMark
                                                value={sliderValue[1]}
                                                textAlign='center'
                                                bg='blue.100'
                                                color='black'
                                                mt='1'
                                                ml='0'
                                                w='14'
                                            >
                                                {sliderValue[1]}
                                            </RangeSliderMark>
                                            {/* right slider marker */}
                                            <RangeSliderMark
                                                value={sliderValue[1]}
                                                textAlign='center'
                                                bg='black.500'
                                                color='black'
                                                mt='-2.5'
                                                ml='0'
                                                w='2'
                                            >
                                                |
                                            </RangeSliderMark>
                                        </RangeSlider>
                                    </Col>
                                </>
                            ) :
                            visualPanel === 'Community' ? (

                                totalSamples.map((sample, index) => (
                                    <Col
                                        key={index}
                                        md={12 / totalSamples.length}
                                    >
                                        <div style={{ marginLeft: 10, fontSize: "0.9em" }}>Sample: {sample + 1} Com: {totalCommunities[index]}</div>
                                    </Col>
                                ))

                            ) : visualPanel === 'Patch-Com-Net' || visualPanel === 'Region-Com-Net' ? (
                                totalSamples.map((sample, index) => (
                                    <Col
                                        key={index}
                                        md={12 / totalSamples.length}
                                    >
                                        <div style={{ marginLeft: 10, fontSize: "0.9em" }}>Sample: {sample + 1}</div>
                                    </Col>
                                ))
                            ) : visualPanel === 'Propagation' ?
                                (
                                    <>
                                        <Col md='1' className="d-flex align-items-center justify-content-center" style={{marginRight: 30, fontSize: "0.9em"}}>Time:</Col>
                                        {/* <Col md='9' ref={sliderRef}></Col> */}
                                        <Col md='5'>
                                            <RangeSlider
                                                aria-label={'min-max-slider'}
                                                // defaultValue={[30, 80]}
                                                onChange={(val) => setPropagationSlider(val)}
                                                max={time}
                                            >
                                                <RangeSliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>
                                                    0 m
                                                </RangeSliderMark>
                                                <RangeSliderMark value={ranges[0]} mt='1' ml='-2.5' fontSize='sm'>
                                                    {`${(ranges[0] / 60000).toFixed(2)} m`}
                                                </RangeSliderMark>
                                                <RangeSliderMark value={ranges[1]} mt='1' ml='-2.5' fontSize='sm'>
                                                    {`${(ranges[1] / 60000).toFixed(2)} m`}
                                                </RangeSliderMark>
                                                <RangeSliderMark value={ranges[2]} mt='1' ml='-2.5' fontSize='sm'>
                                                    {`${(ranges[2] / 60000).toFixed(2)} m`}
                                                </RangeSliderMark>
                                                <RangeSliderMark value={ranges[3]} mt='1' ml='-2.5' fontSize='sm'>
                                                    {`${(ranges[3] / 60000).toFixed(2)} m`}
                                                </RangeSliderMark>
                                                <RangeSliderTrack bg='red.100'>
                                                    <RangeSliderFilledTrack bg='tomato' />
                                                </RangeSliderTrack>

                                                {/* left slider */}
                                                <RangeSliderMark
                                                    value={propagationSlider[0]}
                                                    textAlign='center'
                                                    bg='blue.100'
                                                    color='black'
                                                    mt='-6'
                                                    ml='-12'
                                                    w='14'
                                                >
                                                    {`${propagationSlider[0] / 60000} m`}
                                                </RangeSliderMark>

                                                {/* left slider marker */}
                                                <RangeSliderMark
                                                    value={propagationSlider[0]}
                                                    textAlign='center'
                                                    bg='black.500'
                                                    color='black'
                                                    mt='-2.5'
                                                    ml='0'
                                                    w='2'
                                                >
                                                    |
                                                </RangeSliderMark>

                                                {/* right slider */}
                                                <RangeSliderMark
                                                    value={propagationSlider[1]}
                                                    textAlign='center'
                                                    bg='blue.100'
                                                    color='black'
                                                    mt='1'
                                                    ml='0'
                                                    w='14'
                                                >
                                                    {`${propagationSlider[1] / 60000} m`}
                                                </RangeSliderMark>
                                                {/* right slider marker */}
                                                <RangeSliderMark
                                                    value={propagationSlider[1]}
                                                    textAlign='center'
                                                    bg='black.500'
                                                    color='black'
                                                    mt='-2.5'
                                                    ml='0'
                                                    w='2'
                                                >
                                                    |
                                                </RangeSliderMark>
                                            </RangeSlider>
                                        </Col>
                                    </>
                                ) :
                                null
                    }
                </Row>
            </Col>
        )
    }
}
