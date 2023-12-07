import { Col, Row } from "react-bootstrap"
import dataRegistry from "../../data/dataRegistry.json";
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
    patientID
}) => {
    const time = dataRegistry[patientID].time
    const ranges = Array.from({ length: 5 }, (_, i) => (i + 1) * (time / 4));

    return (
        <Col md='12' style={{ height: '8vh' }}>
            <Row style={{ marginTop: '2%' }}>
                <Col md='2'>
                    <button
                        id={`play-pause-btn`}
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
            </Row>
        </Col>
    )
}
