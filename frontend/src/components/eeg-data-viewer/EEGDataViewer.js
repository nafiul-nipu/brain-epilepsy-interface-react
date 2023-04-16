import "./eeg-data-viewer.css";
import { EEGImage } from './eeg-image';

export const EEGDataViewer = ({ eegEL, patientInfo }) => {
  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div>EEGs </div>
        <div className="referenceDIV" id="null"></div>
        <div>Event {!eegEL ? "loading" : eegEL.id}</div>
      </div>

      {eegEL ? (
        <EEGImage
          eegEL={eegEL}
          patientInfo={patientInfo}

        />
      ) : null}
    </div>
  );
};
