import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
export const ElectrodeDropDown = ({


}) => {
    return(
        <Row>
            <Col md='3'>
                <Form.Group controlId="formGridState" >
                    <Form.Label>Select Patient:</Form.Label>
                    <Form.Select defaultValue="EP187">
                        <option value='EP187'> EP187 </option>
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md='3'>
                <Form.Group controlId="formGridState" >
                    <Form.Label>Select Propagation:</Form.Label>
                    <Form.Select defaultValue="TopPercentile">
                        <option value='TopPercentile'> Top Percentile </option>
                        <option value='ElectrodePair'> Elcetrode Pair </option>
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md='6'>
                Time: 
            <Slider min={10} max={30} defaultValue={10} marks={{ 10: 10, 20: 20, 30: 30 }} step={null} onChange={onSliderChange}/>
            </Col>
        </Row>
    )
}

function onSliderChange(value){
    console.log(value)
}