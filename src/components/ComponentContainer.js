import { Container, Row, Col } from "react-bootstrap"
import { BrainNetwork } from "./BrainNetwork"
import { BrainWithElectrode } from "./BrainWithElectrode"
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
                <BrainWithElectrode
                    brain={brainCopy}
                    electrodeData={electrodeData}
                    bboxCenter={bboxCenter}
                />
                <Transparent
                    brain={brain}
                    lesion1={lesion11}
                    lesion2={lesion12}
                    lesion3={lesion13}
                />
            </Row>
            <Row>
                <BrainNetwork
                    brain={brainCopy2}
                    electrodeData={electrodeData}
                    sampleData={sampleData}
                    bboxCenter={bboxCenter}
                />
                <ElectrodeNetworkTumor
                    brain={brainCopy3}
                    lesion1={lesion21}
                    lesion2={lesion22}
                    lesion3={lesion23}
                    electrodeData={electrodeData}
                    sampleData={sampleData}
                    bboxCenter={bboxCenter}
                />
            </Row>
        </Container>
    )
}