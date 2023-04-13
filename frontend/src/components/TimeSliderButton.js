import { Col, Row } from "react-bootstrap"
import { useRef, useEffect, useState } from 'react';

import * as d3 from 'd3'

import dataRegistry from "../data/dataRegistry.json";

import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderMark,
} from '@chakra-ui/react'

// let button, slider
export const TimeSliderButton = ({
    id,
    buttonValue,
    handleClick,
    sliderValue,
    setSliderValue,
    patientID
}) => {
    const time = dataRegistry[patientID].time
    const ranges = Array.from({ length: 5 }, (_, i) => (i + 1) * (time / 4));
    // console.log(ranges)
    // console.log("time slider is rendered")

    return (
        <Col md='12' style={{ height: '5vh' }}>
            <Row>
                <Col md='2'>
                    <button
                        id={`play-pause-btn-${id}`}
                        className="btn btn-light btn-sm"
                        style={{ marginLeft: '5px' }}
                        value={buttonValue}
                        onClick={handleClick}
                    >{buttonValue}
                    </button>
                </Col>
                <Col md='2'>Time</Col>
                {/* <Col md='9' ref={sliderRef}></Col> */}
                <Col md='7'>
                    <RangeSlider
                        aria-label={['min', 'max']}
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
                        <RangeSliderMark
                            value={sliderValue[0]}
                            textAlign='center'
                            bg='blue.500'
                            color='white'
                            mt='2'
                            ml='-5'
                            w='12'
                        >
                            {sliderValue[0]}
                        </RangeSliderMark>
                        <RangeSliderMark
                            value={sliderValue[1]}
                            textAlign='center'
                            bg='blue.500'
                            color='white'
                            mt='2'
                            ml='-5'
                            w='12'
                        >
                            {sliderValue[1]}
                        </RangeSliderMark>
                        <RangeSliderTrack bg='red.100'>
                            <RangeSliderFilledTrack bg='tomato' />
                        </RangeSliderTrack>
                        <RangeSliderThumb boxSize={6} index={0}>
                            {/* <Box color='tomato' as={MdGraphicEq} /> */}
                        </RangeSliderThumb>
                        <RangeSliderThumb boxSize={6} index={1}>
                            {/* <Box color='tomato' as={MdGraphicEq} /> */}
                        </RangeSliderThumb>
                    </RangeSlider>
                </Col>
            </Row>
        </Col>
    )
}
