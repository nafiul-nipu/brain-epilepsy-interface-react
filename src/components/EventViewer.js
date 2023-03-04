import { Col } from "react-bootstrap"
import * as d3 from 'd3';

import { AxisLeft } from "../CommonComponents/AxisLeft";
import { AxisBottom } from "../CommonComponents/AxisBottom";
import { LinePlot } from "../CommonComponents/LinePlot";

// margin for SVG
const margin = { top: 10, right: 40, bottom: 70, left: 45 }
// offset variable to placement
const scaleOffset = 5

export const EventViewer = ({
    data,
    sliderObj,
    onEventsClicked
}) => {
    if (!data) {
        return (
            <div>loading</div>
        )
    }
    // console.log(data)
    const yMax = Math.max(...data.map(item => item.count))

    // console.log(yMax)
    // const length = data.length
    // const xd = Array.from({ length }, (_, i) => i);
    // console.log(xd)

    // defining width, height, innerwidth and inner height
    const width = window.innerWidth
    const height = window.innerHeight / 2 - 10

    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.right - margin.left

    // scale for xAxis and yAxis
    // const xScale = d3.scaleBand()
    //     .range([0, innerWidth])
    //     .domain(xd)
    //     .padding(0.1)
    //     ;
    const xScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([0, data[data.length - 1].index])
        .nice()
        ;

    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([innerHeight, 0])
        .nice()

    const xAxisScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([0, data[data.length - 1].index]).nice();

    function circleOnClick(values) {
        // console.log(values)
        let startTime = values.time[0]
        let endTime = values.time[values.time.length - 1]

        let index = data.findIndex(x => x.index === values.index);

        d3.select('.referenceCircle').attr('id', `${index}`)

        d3.selectAll('.eventCircle').attr('fill', 'green')
        d3.selectAll(`#ev_${values.index}`).attr('fill', 'red')
        // d3.selectAll(`#ev_${values.index}`).raise()
        // console.log(d3.select(`#ev_${values.index}`).node().parentNode)
        d3.select(d3.select(`#ev_${values.index}`).node().parentNode).raise()


        d3.select(`#play-pause-btn`).attr('value', 'play')
            .text('Play')

        sliderObj.value([startTime, endTime]);
        onEventsClicked(values.electrode)
    }


    return (
        <Col md='12' style={{ height: '95vh' }}>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* creating bottom axis */}
                    <AxisBottom
                        xScale={xAxisScale}
                        yScale={yScale}
                        scaleOffset={scaleOffset}
                        innerHeight={innerHeight}
                    />
                    <text
                        className='axis-label'
                        textAnchor='middle'
                        transform={`translate(${innerWidth / 2}, ${innerHeight + 30} )`}
                    >{'Event ID'}</text>

                    {/* creating left axis */}
                    <AxisLeft
                        xScale={xScale}
                        yScale={yScale}
                        scaleOffset={scaleOffset}
                    />

                    <text
                        className='axis-label'
                        textAnchor='middle'
                        transform={`translate(${-33}, ${innerHeight / 2} )rotate(-90)`}
                    >{'Count'}</text>

                    <g>
                        {
                            data.map((d, i) => {
                                // console.log(d)
                                return (
                                    <g>
                                        {
                                            d.electrode.map((value, index) => {
                                                // console.log(index)
                                                return (
                                                    <circle
                                                        className="eventCircle"
                                                        id={`ev_${d.index}`}
                                                        cx={xScale(i)}
                                                        cy={yScale(index)}
                                                        r={3}
                                                        fill={'green'}
                                                        onClick={() => circleOnClick(d)}
                                                    >
                                                        <title>{`
                                                        Event Id : ${d.index}\nElectrode: ${value}\n Timepoint : ${d.time[index]} ms
                                                        \nCount : ${d.count}
                                                        `}</title>
                                                    </circle>
                                                )
                                            })
                                        }
                                    </g>
                                )
                            })

                        }
                        <circle
                            className="referenceCircle"
                            id="null"
                            cx={innerWidth}
                            cy={innerHeight}
                            r={0}
                            fill={'red'}
                        ></circle>
                    </g>

                    {/* <LinePlot
                        data={data}
                        xScale={xScale}
                        yLineScale={yAxisScale}
                    /> */}

                </g>
            </svg>
        </Col>
    )
}