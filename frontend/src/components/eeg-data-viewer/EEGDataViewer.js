import "./eeg-data-viewer.css";
import { useState } from "react";
import { EEGImage } from "./eeg-image";
import Form from "react-bootstrap/Form";
import { Col, Row, InputGroup, Button, FormControl } from "react-bootstrap";


export const EEGDataViewer = ({ eegEL, patientInfo, baseUrl, setBaseUrl }) => {
  const [spikeAlgorithm, setSpikeAlgorithm] = useState("bandpass");

  function onSpikeAlgorithmChange(e) {
    setSpikeAlgorithm(e.target.value);
  }

  const [inputValue, setInputValue] = useState(1000);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleButtonOnClick = () => {
    console.log(spikeAlgorithm, inputValue)
  }


  return (
    <div className="eeg-container">
      <Row>
        <Col md='6'>
          <Form.Group controlId="formHorizontal" className="flex-form-entry">
            <Form.Label id="selectPosition">Spike_Alg:</Form.Label>
            <Form.Select
              value={spikeAlgorithm}
              id="selectPosition"
              onChange={onSpikeAlgorithmChange}
            >
              <option value="bandpass"> Bandpass </option>
              <option value="localMaxima"> Local Maxima </option>
              <option value="wavelt"> Wavelet </option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md='6'>
          <InputGroup size="sm" id="inputs">
            <InputGroup.Text id="basic-addon1">Threshold</InputGroup.Text>
            <FormControl
              aria-label="lower"
              aria-describedby="basic-addon1"
              defaultValue={inputValue}
              onBlur={handleInputChange}
            />
            <Button variant="outline-secondary" id="button-addon2" onClick={handleButtonOnClick}>
              See Spike
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <div className="eeg-title">
        <div>EEGs </div>
        <div className="referenceDIV" id="null"></div>
        <div>Event {!eegEL ? "loading" : eegEL.id}</div>
      </div>

      {eegEL ? (
        <EEGImage
          eegEL={eegEL}
          patientInfo={patientInfo}
          baseUrl={baseUrl}
        />
      ) : null}
    </div>
  );
};
