import { useState } from "react";
const baseUrl =
    "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images";
// // const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images/ep129/sample1/E${eeg}.png`


export const EEGImage = ({ eegEL, patientInfo }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    function handleClick(eeg, index) {
        // console.log(eegEL)
        // console.log('inside mouseover', eeg)
        const referenceDIV = document.getElementsByClassName('referenceDIV');
        referenceDIV[0].id = `${eegEL.id}_${eeg}`;

        setSelectedImage(index);
    }

    return (
        <div className="eeg-list">
            {eegEL.value.map((eeg, index) => {
                const url = `${baseUrl}/${patientInfo.id}/${patientInfo.sample}/E${eeg}.png`;

                return (
                    <img
                        key={index}
                        src={url}
                        alt={`E${eeg}`}
                        style={{ objectFit: "contain", width: "95%", margin: "10px", boxShadow: selectedImage === index ? "0 0 10px 5px #000000" : "none" }}
                        title={`E${eeg}`}
                        onClick={() => handleClick(eeg, index)}
                    />
                );
            })}
        </div>
    )
}