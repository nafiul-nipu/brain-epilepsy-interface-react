import { Container, Row, Col } from "react-bootstrap"
import { EEGDataViewer } from "./EEGDataViewer"
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
    eventData,
    onEventsClicked,
    eegEL
}) => {
    return (
        <Container fluid id="container">
            {/* nav bar */}
            <Row style={{ height: '5vh' }}>
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
            <Row style={{ height: '50vh' }}>
                <Col md='4'>
                    <EEGDataViewer
                        eegEL={eegEL}
                    />
                </Col>
                <Col md='4'></Col>
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
                                    eventData={eventData}
                                />
                            </Row>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row>
                <Col md='12' style={{ height: '45vh' }}>
                    <Row>
                        <EventViewer
                            data={eventData}
                            sliderObj={sliderObj}
                            onEventsClicked={onEventsClicked}
                        />
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}