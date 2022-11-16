import { Container, Row, Col } from "react-bootstrap"
import { BrainNetwork } from "./BrainNetwork"
import { BrainWithElectrode } from "./BrainWithElectrode"
import { Transparent } from "./Transparent"

export const ComponentContainer = ({
    electrodeData,
    sampleData,
    brain,
    brainCopy,
    brainCopy2,
    lesion1,
    lesion2,
    lesion3
}) => {
    return (
        <Container fluid >
            <Row>
                <BrainWithElectrode
                    brain={brainCopy}
                    electrodeData={electrodeData}
                />
                <Transparent
                    brain={brain}
                    lesion1={lesion1}
                    lesion2={lesion2}
                    lesion3={lesion3}
                />
            </Row>
            <Row>
                <BrainNetwork 
                    brain={brainCopy2}
                    electrodeData={electrodeData}
                    sampleData = {sampleData}
                />
            </Row>
        </Container>
    )
}