import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// slider module to create time slider
// import Slider from 'rc-slider';
import "rc-slider/assets/index.css";
import { useRef, useState } from "react";

export const ElectrodeDropDown = ({
  setNewPatientInfo,
  direction = "column",
}) => {
  const sampleRef = useRef();
  const patientRef = useRef();
  const timeRef = useRef();

  const [sample, selectedSample] = useState("sample1");
  const [patient, selectedPatient] = useState("ep129");
  const [timerange, selectTimeRange] = useState(1000);
  return (
    <div className="container-flex" style={{ flexDirection: direction }}>
      {/* Patient dropdown */}
      <Form.Group controlId="formHorizontal" className="flex-form-entry">
        <Form.Label id="selectPosition">Patient:</Form.Label>
        <Form.Select
          value={patient}
          id="selectPosition"
          ref={patientRef}
          onChange={onPatientChange}
        >
          <option value="ep187"> EP187 </option>
          <option value="ep129"> EP129 </option>
        </Form.Select>
      </Form.Group>

      {/* propagation dropdown */}
      <Form.Group controlId="formHorizontal" className="flex-form-entry">
        <Form.Label id="selectPosition">Sample:</Form.Label>
        <Form.Select
          value={sample}
          onChange={onSampleChange}
          ref={sampleRef}
          id="selectPosition"
        >
          <option value="sample1"> Sample 1</option>
          <option value="sample2"> Sample 2 </option>
          <option value="sample3"> Sample 3 </option>
        </Form.Select>
      </Form.Group>

      {/* propagation dropdown */}
      <Form.Group controlId="formHorizontal" className="flex-form-entry">
        <Form.Label id="selectPosition">Range:</Form.Label>
        <Form.Select
          value={timerange}
          onChange={ontimerangeUpdate}
          ref={timeRef}
          id="selectPosition"
        >
          <option value="50"> 50 ms</option>
          <option value="100"> 100 ms </option>
          <option value="200"> 200 ms </option>
          <option value="500"> 500 ms </option>
          <option value="1000"> 1000 ms </option>
        </Form.Select>
      </Form.Group>
    </div>
  );

  function onSampleChange(event) {
    // console.log(event.target.value)
    let sampleName = event.target.value;
    // console.log(val)
    let patient = patientRef.current.value;
    selectedSample(event.target.value);

    let time = timeRef.current.value;
    setNewPatientInfo({ id: patient, sample: sampleName, range: time });
  }

  function onPatientChange(event) {
    let patient = event.target.value;
    // console.log(val)
    let sampleName = sampleRef.current.value;
    selectedPatient(event.target.value);

    let time = timeRef.current.value;
    setNewPatientInfo({ id: patient, sample: sampleName, range: time });
  }

  function ontimerangeUpdate(event) {
    let time = event.target.value;
    selectTimeRange(event.target.value);

    let sampleName = sampleRef.current.value;
    let patient = patientRef.current.value;
    setNewPatientInfo({ id: patient, sample: sampleName, range: time });
  }
};
