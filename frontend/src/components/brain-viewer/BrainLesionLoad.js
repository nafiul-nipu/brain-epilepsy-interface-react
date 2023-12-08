import CustomOBJModel from "./ModelLoader";
const partURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/convert-to-siyuan-interface/frontend/src/models/'

export function BrainLesionLoad(props) {
    return (
        <group>
            {props.lesionArray.map((lesion, index) => {
                return (
                    <CustomOBJModel
                        key={index}
                        url={`${partURL}${props.patientInformation.id}/${props.patientInformation.id}_lesion${lesion}.obj`}
                        color="#505050"
                        opacity={1}
                        transparent={false}
                        type="lesion"
                    />);
            })}
            {props.brainPartition === true ? (
                <CustomOBJModel
                    url={`${partURL}${props.patientInformation.id}/${props.patientInformation.id}_brain_left.obj`}
                    color="#F6D5A2"
                    opacity={props.leftBrainOpacity}
                    transparent={true}
                    type={"left"}
                    renderOrer={1}
                />

            ) : null}

            {props.brainPartition === true ? (
                <CustomOBJModel
                    url={`${partURL}${props.patientInformation.id}/${props.patientInformation.id}_brain_right.obj`}
                    color="#D6D0BA"
                    opacity={props.rightBrainOpacity}
                    transparent={true}
                    type={"right"}
                    renderOrer={2}

                />

            ) : null}

            <CustomOBJModel
                url={`${partURL}${props.patientInformation.id}/${props.patientInformation.id}_brain.obj`}
                color="#505050"
                opacity={0.15}
                transparent={true}
                type="brain"
                renderOrer={3}
            />
        </group>
    );
}
