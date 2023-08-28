import CustomOBJModel from "./ModelLoader";
const partURL = 'https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/master/frontend/src/models/'

export function BrainLesionLoad(props) {
    return (
        <group>
            <CustomOBJModel
                url={`${partURL}${props.patientInformation.id}/${props.patientInformation.id}_brain.obj`}
                color="#505050"
                opacity={0.15}
                transparent={true}
                type="brain"
            />
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
        </group>
    );
}
