import { Container, Row, Col } from "react-bootstrap"
import { BrainRendering } from "./BrainRendering"

export const ComponentContainer = ({
    electrodeData,
    brainMesh
}) => {
    return(
        <Container fluid >
            <Row>
                <BrainRendering 
                    brainMesh = {brainMesh}
                    electrodeData={electrodeData}
                />
            </Row>
        </Container>
    )
}