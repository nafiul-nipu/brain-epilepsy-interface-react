import { Container, Row, Col } from "react-bootstrap"
import { ElectrodeDropDown } from "./ElectrodeDropDown"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
// import { PropagationTimeSeries } from "./PropagationTimeSeries"
import { TimeSliderButton } from "./TimeSliderButton"

export const ComponentContainer = ({
    electrodeData,
    sampleData,
    multiBrain,
    multiLesion1,
    multiLesion2,
    multiLesion3,
    bboxCenter,
    setNewPatientInfo,
    sliderObj,
    tickValues
}) => {
    return (
        <Container fluid id="container">
            <Row>
                <Col md='6' style={{ height: '5vh' }}>
                    {/* dropdown menues */}
                    <ElectrodeDropDown
                        setNewPatientInfo={setNewPatientInfo}
                    />
                </Col>
                <Col md='6' style={{ height: '5vh' }}>
                    <TimeSliderButton
                        sliderObj={sliderObj}
                    />
                </Col>
            </Row>
            <Row>
                <Col md='8'>
                    {/* propagation time series */}
                    {/* <PropagationTimeSeries
                        sample1={sampleData}
                        sample2={sampleData2}
                        sample3={sampleData3}
                    /> */}
                </Col>
                <Col md='4'>
                    {/* <Row>
                        <TimeSliderButton
                            sliderObj={sliderObj}
                            tickValues={tickValues}
                        />
                    </Row> */}
                    <Row>
                        <Col>
                            <Row>
                                <Col id="titleBrain1">Propagation Over Time</Col>
                            </Row>
                            <Row>
                                <ElectrodeNetworkTumor
                                    brain={multiBrain.obj1}
                                    lesion1={multiLesion1.obj1}
                                    lesion2={multiLesion2.obj1}
                                    lesion3={multiLesion3.obj1}
                                    electrodeData={electrodeData}
                                    sampleData={sampleData}
                                    bboxCenter={bboxCenter}
                                    sliderObj={sliderObj}
                                    tickValues={tickValues}
                                />
                            </Row>
                        </Col>
                    </Row>

                </Col>

            </Row>
            {/* three brain model with propagation and  network and tumors*/}
            {/* <Row>
                <Col md='4'>
                    <div id="titleBrain1">0 min - 10 min</div>
                    <ElectrodeNetworkTumor
                        brain={multiBrain.obj1}
                        lesion1={multiLesion1.obj1}
                        lesion2={multiLesion2.obj1}
                        lesion3={multiLesion3.obj1}
                        electrodeData={electrodeData}
                        sampleData={sampleData}
                        bboxCenter={bboxCenter}
                        electrodeNetworkValue={electrodeNetworkValue}
                    />
                </Col>
                <Col md='4'>
                    <div id="titleBrain2">10 min - 20 min</div>
                    <ElectrodeNetworkTumor
                        brain={multiBrain.obj2}
                        lesion1={multiLesion1.obj2}
                        lesion2={multiLesion2.obj2}
                        lesion3={multiLesion3.obj2}
                        electrodeData={electrodeData}
                        sampleData={sampleData2}
                        bboxCenter={bboxCenter}
                        electrodeNetworkValue={electrodeNetworkValue}
                    />
                </Col>
                <Col md='4'>
                    <div id="titleBrain3">20 min - 30 min</div>
                    <ElectrodeNetworkTumor
                        brain={multiBrain.obj3}
                        lesion1={multiLesion1.obj3}
                        lesion2={multiLesion2.obj3}
                        lesion3={multiLesion3.obj3}
                        electrodeData={electrodeData}
                        sampleData={sampleData3}
                        bboxCenter={bboxCenter}
                        electrodeNetworkValue={electrodeNetworkValue}
                    />
                </Col>
            </Row> */}
        </Container>
    )
}