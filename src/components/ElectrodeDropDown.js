import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
// slider module to create time slider
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
export const ElectrodeDropDown = ({


}) => {
    return (
        <Row>
            <Col md='3'>
                {/* Patient dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal">
                    <Form.Label column sm={4}>Select Patient:</Form.Label>
                    <Col sm={8}>
                        <Form.Select defaultValue="EP187">
                            <option value='EP187'> EP187 </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='3'>
                {/* propagation dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal">
                    <Form.Label column sm={4}>Propagation:</Form.Label>
                    <Col sm={8}>
                        <Form.Select defaultValue="TopPercentile">
                            <option value='TopPercentile'> Top Percentile </option>
                            <option value='ElectrodePair'> Elcetrode Pair </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='3'>
                {/* electrode dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal">
                    <Form.Label column sm={4}>Electrodes:</Form.Label>
                    <Col sm={8}>
                        <Form.Select defaultValue="5">
                            <option value='5'> 5%</option>
                            <option value='10'> 10% </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='3'>
                {/* time slider */}
                Time:
                <Slider min={10} max={30} defaultValue={10} marks={{ 10: 10, 20: 20, 30: 30 }} step={null} onChange={onSliderChange} />
            </Col>
        </Row>
    )
}

function onSliderChange(value) {
    console.log(value)
}