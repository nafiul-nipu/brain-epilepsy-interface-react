import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
// slider module to create time slider
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRef, useState } from 'react';
export const ElectrodeDropDown = ({
    electrodeData,
    setElectrodeNetworkValue
}) => {
    const propaRef = useRef()
    let percentile = [5, 10, 15, 20]
    let electrodeList
    if(electrodeData){
        // console.log(electrodeData)
        electrodeList = [...new Set(electrodeData.map((item) => item.electrode_number))]
        // console.log(electrodeList)
    }
    const [data, setData] = useState(percentile)
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
                        <Form.Select defaultValue="TopPercentile" onChange={propagationOnChange} ref={propaRef}>
                            <option value='TopPercentile'> Top Percentile </option>
                            <option value='ElectrodePair'> Elcetrode Pair </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='3'>
                {/* electrode dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal" >
                    <Form.Label column sm={4}>Electrodes:</Form.Label>
                    <Col sm={8}>
                        <Form.Select defaultValue="5" onChange={electrodOnChange}>
                            {
                                data.map(d =>{
                                    return(
                                        <option value={d} >{d}</option>
                                    )
                                })
                            }
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


    function propagationOnChange(event){
        // console.log(event.target.value)
        let val = event.target.value;
        if(val === 'TopPercentile'){
            setData(percentile)
        }else{
            setData(electrodeList)
        }
    }

    function electrodOnChange(event){
        let propagation = propaRef.current.value
        let electorde = event.target.value;
        setElectrodeNetworkValue([propagation, electorde])
        // console.log(propaRef.current.value)
    }
}

function onSliderChange(value) {
    console.log(value)
}

