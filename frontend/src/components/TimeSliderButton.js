import { Col, Row } from "react-bootstrap"
import { useRef, useEffect } from 'react';

import * as d3 from 'd3'

let button, slider
export const TimeSliderButton = ({
    sliderObj
}) => {
    const buttoneRef = useRef(null)
    const sliderRef = useRef(null)

    useEffect(() => {
        button = buttoneRef.current;


        d3.select(button).select('#play-pause-btn').remove();

        console.log('button creation');

        d3.select(button).append('button')
            .attr('class', `btn btn-light btn-sm`)
            .attr("style", "margin-left:5px")
            .attr('id', "play-pause-btn")
            .attr('value', 'pause')
            .text('Pause')
            .on('click', (d) => {
                console.log(d.target.value)
                if (d.target.value === 'play') {
                    d3.select(`#play-pause-btn`).attr('value', 'pause')
                        .text('Pause')

                } else if (d.target.value === 'pause') {
                    d3.select(`#play-pause-btn`).attr('value', 'play')
                        .text('Play')
                }
            })

    }, [])

    useEffect(() => {
        // console.log(d3.select(slider).node().clientWidth)
        d3.select(slider).select('svg').remove()

        slider = sliderRef.current;

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
                <Col md='2' ref={el => { buttoneRef.current = el; }}></Col>
                <Col md='1'>Time</Col>
                <Col md='9' ref={el => { sliderRef.current = el; }}></Col>
            </Row>
        </Col>
    )
}