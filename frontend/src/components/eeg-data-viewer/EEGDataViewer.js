import "./eeg-data-viewer.css";

const baseUrl =
  "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images";
// const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images/ep129/sample1/E${eeg}.png`

export const EEGDataViewer = ({ eegEL, patientInfo }) => {
  function handleClick(eeg) {
    // console.log(eegEL)
    // console.log('inside mouseover', eeg)
    const referenceDIV = document.getElementsByClassName('referenceDIV');
    referenceDIV[0].id = `${eegEL.id}_${eeg}`;
  }


  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div>EEGs </div>
        <div className="referenceDIV" id="null"></div>
        <div>Event {!eegEL ? "loading" : eegEL.id}</div>
      </div>

      {eegEL ? (
        <div className="eeg-list">
          {eegEL.value.map((eeg) => {
            const url = `${baseUrl}/${patientInfo.id}/${patientInfo.sample}/E${eeg}.png`;

            return (
              <img
                key={eeg}
                src={url}
                alt={`E${eeg}`}
                style={{ objectFit: "contain", width: "95%", margin: "10px" }}
                title={`E${eeg}`}
                onClick={() => handleClick(eeg)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
