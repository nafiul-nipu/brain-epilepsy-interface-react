import { Container, Row, Col } from "react-bootstrap"
import { BrainNetwork } from "./BrainNetwork"
import { BrainWithElectrode } from "./BrainWithElectrode"
import { ElectrodeDropDown } from "./ElectrodeDropDown"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { Transparent } from "./Transparent"

export const ComponentContainer = ({
    electrodeData,
    sampleData,
    multiBrain,
    multiLesion1,
    multiLesion2,
    multiLesion3,
    bboxCenter
}) => {
    return (
        <Container fluid >
            <Row>
                <Col md='12'>
                    <Row>
                        <Col md='12' style={{ height: '25vh' }}>
                            <ElectrodeDropDown />
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col md='12'>
                            
                        </Col>
                    </Row> */}

                </Col>
            </Row>
            <Row>
                <Col md='4'>
                    <ElectrodeNetworkTumor
                        brain={multiBrain.obj1}
                        lesion1={multiLesion1.obj1}
                        lesion2={multiLesion2.obj1}
                        lesion3={multiLesion3.obj1}
                        electrodeData={electrodeData}
                        sampleData={sampleData}
                        bboxCenter={bboxCenter}
                    />
                </Col>
                <Col md='4'>
                    <ElectrodeNetworkTumor
                        brain={multiBrain.obj2}
                        lesion1={multiLesion1.obj2}
                        lesion2={multiLesion2.obj2}
                        lesion3={multiLesion3.obj2}
                        electrodeData={electrodeData}
                        sampleData={sampleData}
                        bboxCenter={bboxCenter}
                    />
                </Col>
                <Col md='4'>
                    <ElectrodeNetworkTumor
                        brain={multiBrain.obj3}
                        lesion1={multiLesion1.obj3}
                        lesion2={multiLesion2.obj3}
                        lesion3={multiLesion3.obj3}
                        electrodeData={electrodeData}
                        sampleData={sampleData}
                        bboxCenter={bboxCenter}
                    />
                </Col>
            </Row>
        </Container>
    )
}