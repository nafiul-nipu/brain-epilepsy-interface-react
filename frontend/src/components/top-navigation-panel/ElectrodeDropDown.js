import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Logo } from "../logo/logo";

export const ElectrodeDropDown = ({
  patientInfo,
  setPatientInfo,
  timeRange,
  setTimeRange,
  direction = "column",
}) => {

  return (
    <Row>
      <Col md='2'>
        <Logo>SpikeXplorer</Logo>
      </Col>
      <Col md='3'>
        {/* Patient dropdown */}
        <Form.Group controlId="formHorizontal" className="flex-form-entry">
          <Form.Label id="selectPosition">Patient:</Form.Label>
          <Form.Select
            value={patientInfo.id}
            id="selectPosition"
            onChange={onPatientChange}
          >
            <option value="ep187"> EP187 </option>
            <option value="ep129"> EP129 </option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md='3'>
        {/* propagation dropdown */}
        <Form.Group controlId="formHorizontal" className="flex-form-entry">
          <Form.Label id="selectPosition">Session:</Form.Label>
          <Form.Select
            value={patientInfo.sample}
            onChange={onSampleChange}
            id="selectPositionSession"
          >
            <option value="sample1"> Session 1</option>
            <option value="sample2"> Session 2 </option>
            <option value="sample3"> Session 3 </option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md='3'>
        {/* propagation dropdown */}
        <Form.Group controlId="formHorizontal" className="flex-form-entry">
          <Form.Label id="selectPosition">Range:</Form.Label>
          <Form.Select
            value={timeRange}
            onChange={ontimerangeUpdate}
            id="selectPosition"
          >
            <option value="50"> 50 ms</option>
            <option value="100"> 100 ms </option>
            <option value="200"> 200 ms </option>
            <option value="500"> 500 ms </option>
            <option value="1000"> 1000 ms </option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );

  function onSampleChange(event) {
    // console.log({ ...patientInfo, sample: event.target.value })
    setPatientInfo({ ...patientInfo, sample: event.target.value });

  }

  function onPatientChange(event) {
    setPatientInfo({ ...patientInfo, id: event.target.value });
  }

  function ontimerangeUpdate(event) {
    setTimeRange(event.target.value);
  }
};
