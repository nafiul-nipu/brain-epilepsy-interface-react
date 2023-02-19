import { Container, Row, Col } from "react-bootstrap"
import { ElectrodeDropDown } from "./ElectrodeDropDown"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { EventViewer } from "./EventViewer"
// import { PropagationTimeSeries } from "./PropagationTimeSeries"
import { TimeSliderButton } from "./TimeSliderButton"

export const ComponentContainer = ({
    electrodeData,
    sampleData,
    multiBrain,
    bboxCenter,
    setNewPatientInfo,
    sliderObj,
    timeRange,
    lesions,
    eventData
}) => {
    return (
        <Container fluid id="container">
            {/* nav bar */}
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
            {/* vis */}
            <Row>
                <Col md='8'>
                    <Row>
                        <EventViewer
                            data={eventData}
                        />
                    </Row>
                    <Row></Row>
                </Col>
                <Col md='4'>
                    {/* top view - electrode and brain 3D model */}
                    <Row>
                        <Col>
                            <Row>
                                <Col id="titleBrain1">Propagation Over Time</Col>
                            </Row>
                            <Row>
                                <ElectrodeNetworkTumor
                                    brain={multiBrain.obj1}
                                    electrodeData={electrodeData}
                                    sampleData={sampleData}
                                    bboxCenter={bboxCenter}
                                    sliderObj={sliderObj}
                                    timeRange={timeRange}
                                    lesions={lesions}
                                />
                            </Row>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}