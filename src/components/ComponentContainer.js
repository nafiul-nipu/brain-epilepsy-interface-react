import { Container, Row, Col } from "react-bootstrap"
import { BrainOBJRendering } from "./BrainOBJRendering"
import { BrainRendering } from "./BrainRendering"
import { BrainWithElectrode } from "./BrainWithElectrode"
import { Transparent } from "./Transparent"

export const ComponentContainer = ({
    electrodeData,
    brain,
    brainCopy,
    lesion1,
    lesion2,
    lesion3
}) => {
    return (
        <Container fluid >
            <Row>
                {/* <BrainRendering
                    brainMesh={brainMesh}
                    electrodeData={electrodeData}
                /> */}
                <BrainWithElectrode
                    brain={brainCopy}
                    electrodeData={electrodeData}
                />
                {/* <BrainOBJRendering
                    brain={brain}
                    pointLightIntensity={0.2}
                    brainOpacity={1}
                    brainTransparency={false}
                    brainColor={0Xdae2e3}
                    electrodeData={electrodeData}
                    withTumor={false}
                /> */}
                <Transparent
                    brain={brain}
                    lesion1={lesion1}
                    lesion2={lesion2}
                    lesion3={lesion3}
                />
                {/* <BrainOBJRendering
                    brain={brain}
                    lesion1={lesion1}
                    lesion2={lesion2}
                    lesion3={lesion3}
                    lesionOpacity={1}
                    lesionTranparency={false}
                    lesionColor={0XFF0000}
                    pointLightIntensity={1.5}
                    brainOpacity={0.2}
                    brainTransparency={true}
                    brainColor={0X111111}
                    withTumor={true}
                /> */}
            </Row>
        </Container>
    )
}