import { Col, Row } from "react-bootstrap"
import { useRef, useEffect } from 'react';

import * as d3 from 'd3'

// let button, slider
export const TimeSliderButton = ({
    sliderObj,
    id,
    buttonValue,
    handleClick
}) => {
    const sliderRef = useRef(null)


    useEffect(() => {
        // console.log(d3.select(slider).node().clientWidth)
        let slider = sliderRef.current;
        d3.select(slider).select('svg').remove()

        // slider = sliderRef.current;

        sliderObj.width(d3.select(slider).node().clientWidth - 70)

        d3.select(slider).append('svg')
            .attr('class', 'slider-svg')
            .attr('width', d3.select(slider).node().clientWidth)
            .attr('height', 70)
            .append('g')
            .attr('transform', 'translate(15, 10)')
            .call(sliderObj)
    }, [sliderObj])
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
                <Col md='9' ref={sliderRef}></Col>
            </Row>
        </Col>
    )
}
