import { Container, Row, Col } from "react-bootstrap"
import { BrainRendering } from "./BrainRendering"
import { Transparent } from "./Transparent"

export const ComponentContainer = ({
    electrodeData,
    brainMesh,
    brain
}) => {
    return(
        <Container fluid >
            <Row>
                <BrainRendering 
                    brainMesh = {brainMesh}
                    electrodeData={electrodeData}
                />
                <Transparent 
                    brain={brain}
                />
            </Row>
        </Container>
    )
}