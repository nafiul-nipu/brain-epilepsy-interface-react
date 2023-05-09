import { Row, Col } from "react-bootstrap";
import dataRegistry from "../../data/dataRegistry.json";

import React from 'react';
import ReacECharts from 'echarts-for-react';


export const PatientSummary = (({
    patient,
    events
}) => {
    // console.log(events)
    return (
        <Col md="12" style={{ height: "20vh", backgroundColor: "#FAFBFC" }}>
            <Row><Col>Patient Summary</Col></Row>
            <Row>
                {
                    events.map((e, i) => {

                        const options = {
                            title: {
                                text: `Session ${i + 1}`,
                                left: 0,
                                top: 10,
                                textStyle: {
                                    fontWeight: 'bold',
                                    fontSize: 10
                                },
                            },
                            tooltip: {},
                            legend: {
                                show: false,
                            },
                            grid: { show: false, },
                            radar: {
                                indicator: [
                                    { name: '# Lesions', max: dataRegistry.maxLesions },
                                    { name: '# Electrodes', max: dataRegistry.maxElectrodes },
                                    { name: '# Events', max: dataRegistry.maxEvents },
                                    { name: '# Peaks', max: dataRegistry.maxPeaks },
                                    { name: '# Rois', max: dataRegistry.maxRois },
                                ],
                                axisName: {
                                    left: 15,
                                    textStyle: {
                                        fontSize: 8,
                                    },
                                },
                                axisNameGap: 1,
                                splitArea: {
                                    show: false
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: 'black'
                                    }
                                },
                                splitLine: {
                                    show: false,
                                    lineStyle: {
                                        color: 'black'
                                    }
                                }

                            },
                            series: [{
                                name: 'Patient Summary',
                                type: 'radar',
                                areaStyle: {},
                                data: [
                                    {
                                        value: [
                                            dataRegistry[patient.id][e].lesions,
                                            dataRegistry[patient.id][e].totalElectrodes,
                                            dataRegistry[patient.id][e].totalEvents,
                                            dataRegistry[patient.id][e].peaks,
                                            dataRegistry[patient.id][e].totalrois
                                        ],
                                        name: 'Patient Summary'
                                    }
                                ]
                            }]
                        };

                        return (
                            <Col key={i} md={12 / events.length} style={{ height: "18vh", backgroundColor: "#FAFBFC" }}>
                                <ReacECharts
                                    option={options}
                                    style={{ height: "18vh", width: "100%" }}
                                />
                            </Col>
                        )

                    })
                }

            </Row>
        </Col>
    )
})