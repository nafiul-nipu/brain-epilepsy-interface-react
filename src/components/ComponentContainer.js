import { Container, Row, Col } from "react-bootstrap"
import { BrainNetwork } from "./BrainNetwork"
import { BrainWithElectrode } from "./BrainWithElectrode"
import { ElectrodeDropDown } from "./ElectrodeDropDown"
import { ElectrodeNetworkTumor } from "./ElectrodeNetworkTumor"
import { Transparent } from "./Transparent"

export const ComponentContainer = ({
    electrodeData,
    sampleData,
    brain,
    brainCopy,
    brainCopy2,
    brainCopy3,
    lesion11,
    lesion12,
    lesion13,
    lesion21,
    lesion22,
    lesion23,
    bboxCenter
}) => {
    return (
        <Container fluid >
            <Row>
                <Col md='6'>
                    <Row>
                        <Col md='12' style={{height: '25vh'}}>
                            <ElectrodeDropDown />
                        </Col>
                    </Row>
                    <Row>
                        <Col md='12'>
                            <ElectrodeNetworkTumor
                                brain={brainCopy3}
                                lesion1={lesion21}
                                lesion2={lesion22}
                                lesion3={lesion23}
                                electrodeData={electrodeData}
                                sampleData={sampleData}
                                bboxCenter={bboxCenter}
                            />
                        </Col>
                    </Row>

                </Col>
                <Col md='6'>
                    <Row>
                        <Col md='12'>
                            {/* <Transparent
                                brain={brain}
                                lesion1={lesion11}
                                lesion2={lesion12}
                                lesion3={lesion13}
                            />                 */}
                        </Col>
                    </Row>
                    <Row>
                        <Col md='12'>
                            {/* <BrainWithElectrode
                                brain={brainCopy}
                                electrodeData={electrodeData}
                                bboxCenter={bboxCenter}
                            /> */}
                            {/* <BrainNetwork
                                brain={brainCopy2}
                                electrodeData={electrodeData}
                                sampleData={sampleData}
                                bboxCenter={bboxCenter}
                            /> */}
                            {/* <Transparent
                                brain={brainCopy2}
                                lesion1={lesion21}
                                lesion2={lesion22}
                                lesion3={lesion23}
                            />   */}
                            <ElectrodeNetworkTumor
                                brain={brainCopy2}
                                lesion1={lesion11}
                                lesion2={lesion12}
                                lesion3={lesion13}
                                electrodeData={electrodeData}
                                sampleData={sampleData}
                                bboxCenter={bboxCenter}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}