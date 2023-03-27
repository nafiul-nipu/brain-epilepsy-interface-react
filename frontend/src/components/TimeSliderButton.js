import { Col, Row } from "react-bootstrap"
import { useRef, useEffect, useState } from 'react';

import * as d3 from 'd3'

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import dataRegistry from "../data/dataRegistry.json";


// let button, slider
function valuetext(value) {
    return `${value}°C`;
}

export const TimeSliderButton = ({
    sliderObj,
    id,
    buttonValue,
    handleClick,
    sliderValue,
    handleSliderChange,
    patient
}) => {

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
                <Col md='1'>Time</Col>
                <Col md='9'>
                    <Box sx={{ width: '22vw' }}>
                        <Slider
                            size="small"
                            getAriaLabel={() => 'Temperature range'}
                            value={sliderValue}
                            // onChange={handleSliderChange}
                            valueLabelDisplay="on"
                            getAriaValueText={valuetext}
                            min={0}
                            max={dataRegistry[patient].time}

                        />
                    </Box>
                </Col>
            </Row>
        </Col>
    )
}
