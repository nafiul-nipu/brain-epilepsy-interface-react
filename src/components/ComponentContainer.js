import { Container, Row, Col } from "react-bootstrap"
import { ElectrodeDropDown } from "./ElectrodeDropDown"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { PropagationTimeSeries } from "./PropagationTimeSeries"

export const ComponentContainer = ({
    electrodeData,
    sampleData,
    sampleData2,
    sampleData3,
    multiBrain,
    multiLesion1,
    multiLesion2,
    multiLesion3,
    bboxCenter,
    electrodeNetworkValue,
    setElectrodeNetworkValue
}) => {
    return (
        <Container fluid >
            <Row>
                <Col md='12' style={{ height: '5vh' }}>
                    {/* dropdown menues */}
                    <ElectrodeDropDown 
                        electrodeData={electrodeData}
                        setElectrodeNetworkValue={setElectrodeNetworkValue}
                    />
                </Col>
            </Row>
            <Row>
                {/* propagation time series */}
                <PropagationTimeSeries
                    sample1={sampleData}
                    sample2={sampleData2}
                    sample3={sampleData3}
                />
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