import { Row, Col } from "react-bootstrap";

import React from 'react';
import ReacECharts from 'echarts-for-react';

const options = {
    title: {
        text: 'Session 1',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 15
        },
    },
    tooltip: {},
    legend: {
        show: false,
    },
    grid: { show: false, },
    radar: {
        indicator: [
            { name: '# Lesions', max: 121000 },
            { name: '# Electrodes', max: 113 },
            { name: '# Events', max: 1000 },
            { name: '# Activation', max: 5000 },
            { name: '# Peaks', max: 2000 },
        ],
        nameGap: 1,
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
                value: [121000, 79, 815, 2150, 1000],
                name: 'Patient Summary'
            }
        ]
    }]
};



export const PatientSummary = (() => {
    return (
        <Col md="12" style={{ height: "20vh", backgroundColor: "#FAFBFC" }}>
            <Row><Col>Patient Summary</Col></Row>
            <Row>
                <Col md="12" style={{ height: "18vh", backgroundColor: "#FAFBFC" }}>
                    <ReacECharts
                        option={options}
                        style={{ height: "18vh", width: "50%" }}
                    />
                </Col>
            </Row>
        </Col>
    )
})