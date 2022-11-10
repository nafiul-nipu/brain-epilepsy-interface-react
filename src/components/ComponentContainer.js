import { Container, Row, Col } from "react-bootstrap"
import { BrainRendering } from "./BrainRendering"
import { Transparent } from "./Transparent"

export const ComponentContainer = ({
    electrodeData,
    brainMesh,
    brain,
    lesion1,
    lesion2,
    lesion3
}) => {
    return (
        <Container fluid >
            <Row>
                <BrainRendering
                    brainMesh={brainMesh}
                    electrodeData={electrodeData}
                />
                <Transparent
                    brain={brain}
                    lesion1={lesion1}
                    lesion2={lesion2}
                    lesion3={lesion3}
                />
            </Row>
        </Container>
    )
}