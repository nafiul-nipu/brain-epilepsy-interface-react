import "./eeg-data-viewer.css";

const baseUrl =
  "https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images";
// const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/seizurePropagationPrototype/src/data/EEG%20Images/ep187/sample1/E${eeg}.png`

export const EEGDataViewer = ({ eegEL, patientInfo }) => {
  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div>EEGs </div>
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
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
