import { Logo } from "../logo/logo";
import "./nav-bar.css";

const globalTimelineRectWidth = 10000;
const localTimelineRectWidth = 500;

export const ElectrodeDropDown = ({
  patientInfo,
  setPatientInfo,
  timeRange,
  setTimeRange,
  direction = "column",
  setRoiFilter,
  setSelectedRoi,
  setSimilarRegionEvent,
  setExploration
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
        </select>
      </div>

      {/* propagation dropdown */}
      <div className="form-ddl-entry">
        <label htmlFor="sample">Session:</label>
        <select id="sample" value={sample} onChange={onSampleChange}>
          <option value="sample1"> Session 1</option>
          <option value="sample2"> Session 2 </option>
          <option value="sample3"> Session 3 </option>
        </select>
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
    setRoiFilter(null);
    setSelectedRoi(0);
    setSimilarRegionEvent(null);
    setExploration(null);
  }

  function onPatientChange(event) {
    setPatientInfo({ ...patientInfo, id: event.target.value });
    setRoiFilter(null);
    setSelectedRoi(0);
    setSimilarRegionEvent(null);
    setExploration(null);
  }

  function onTimeRangeChange(event) {
    setTimeRange(event.target.value);
    setRoiFilter(null);
    setSelectedRoi(0);
    setSimilarRegionEvent(null);
    // setExploration(null);
  }
};
