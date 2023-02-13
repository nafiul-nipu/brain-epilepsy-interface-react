import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
// slider module to create time slider
// import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRef, useState } from 'react';
export const ElectrodeDropDown = ({
    setNewPatientInfo
}) => {
    const sampleRef = useRef()
    const patientRef = useRef()

    const [sample, selectedSample] = useState('sample1')
    const [patient, selectedPatient] = useState('ep187')
    return (
        <Row>
            <Col md='6'>
                {/* Patient dropdown */}
                <Form.Group as={Row} className='mb-4' controlId="formHorizontal">
                    <Form.Label column sm={5} id='selectPosition'>Select Patient:</Form.Label>
                    <Col sm={7}>
                        <Form.Select value={patient} id='selectPosition' ref={patientRef} onChange={onPatientChange}>
                            <option value='ep187'> EP187 </option>
                            <option value='ep129'> EP129 </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='6'>
                {/* propagation dropdown */}
                <Form.Group as={Row} className='mb-4' controlId="formHorizontal">
                    <Form.Label column sm={4} id='selectPosition'>Sample:</Form.Label>
                    <Col sm={8}>
                        <Form.Select value={sample} onChange={onSampleChange} ref={sampleRef} id='selectPosition'>
                            <option value='sample1'> Sample 1</option>
                            <option value='sample2'> Sample 2 </option>
                            <option value='sample3'> Sample 3 </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
        </Row>
    )


    function onSampleChange(event) {
        // console.log(event.target.value)
        let sampleName = event.target.value;
        // console.log(val)
        let patient = patientRef.current.value;
        selectedSample(event.target.value)

        setNewPatientInfo({ id: patient, sample: sampleName })
    }

    function onPatientChange(event) {
        let patient = event.target.value;
        // console.log(val)
        let sampleName = sampleRef.current.value;
        selectedPatient(event.target.value)

        setNewPatientInfo({ id: patient, sample: sampleName })
    }
}


