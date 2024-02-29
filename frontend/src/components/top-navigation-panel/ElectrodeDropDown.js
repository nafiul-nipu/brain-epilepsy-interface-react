import { Logo } from "../logo/logo";
import "./nav-bar.css";


export const ElectrodeDropDown = ({
  patientInfo,
  setPatientInfo,
  timeRange,
  setTimeRange,
  setSelectedRoi
}) => {
  const { id, sample } = patientInfo;

  return (
    <div className="nav-bar-top">
      <Logo>SpikeXplorer</Logo>

      {/* Patient dropdown */}
      <div className="form-ddl-entry">
        <label htmlFor="patient">Patient:</label>
        <select id="patient" value={id} onChange={onPatientChange}>
          <option value="ep187"> EP187 </option>
          <option value="ep129"> EP129 </option>
          <option value="ep162"> EP162 </option>
          <option value="ep164"> EP164 </option>
          <option value="ep165"> EP165 </option>
        </select>
      </div>

      {/* propagation dropdown */}
      <div className="form-ddl-entry">
        <label htmlFor="sample">Session:</label>
        {id === "ep129" ? (
          <select id="sample" value={sample} onChange={onSampleChange}>
            <option value="sample1">Session 1</option>
            <option value="sample2">Session 2</option>
          </select>
        ) : (
          <select id="sample" value={sample} onChange={onSampleChange}>
            <option value="sample1">Session 1</option>
            <option value="sample2">Session 2</option>
            <option value="sample3">Session 3</option>
          </select>
        )}
      </div>

      {/* propagation dropdown */}
      <div className="form-ddl-entry">
        <label htmlFor="range">Range:</label>
        <select id="range" value={timeRange} onChange={onTimeRangeChange}>
          <option value="50"> 50 ms</option>
          <option value="100"> 100 ms </option>
          <option value="200"> 200 ms </option>
          <option value="500"> 500 ms </option>
          <option value="1000"> 1000 ms </option>
        </select>
      </div>
    </div>
  );

  function onSampleChange(event) {
    // console.log({ ...patientInfo, sample: event.target.value })
    setPatientInfo({ ...patientInfo, sample: event.target.value });
    setSelectedRoi(null);
  }

  function onPatientChange(event) {
    setPatientInfo({ ...patientInfo, id: event.target.value, sample: "sample1" });
    setSelectedRoi(null);
  }

  function onTimeRangeChange(event) {
    setTimeRange(event.target.value);
    setSelectedRoi(null);
  }
};
