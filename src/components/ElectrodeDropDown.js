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
    const eRef = useRef()
    let electrodeList
    if (electrodeData) {
        // console.log(electrodeData)
        electrodeList = [...new Set(electrodeData.map((item) => item.electrode_number))]
        // console.log(electrodeList)
    }
    let data = [
        { name: 'TopPercentile', values: [5, 10, 15, 20] },
        { name: 'ElectrodePair', values: electrodeList }
    ]
    const [propagation, selectedPropagation] = useState('TopPercentile')
    return (
        <Row>
            <Col md='3'>
                {/* Patient dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal">
                    <Form.Label column sm={4} id='selectPosition'>Select Patient:</Form.Label>
                    <Col sm={8}>
                        <Form.Select defaultValue="EP187" id='selectPosition'>
                            <option value='EP187'> EP187 </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='3'>
                {/* propagation dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal">
                    <Form.Label column sm={4} id='selectPosition'>Propagation:</Form.Label>
                    <Col sm={8}>
                        <Form.Select value={propagation} onChange={propagationOnChange} ref={propaRef} id='selectPosition'>
                            <option value='TopPercentile'> Top Percentile </option>
                            <option value='ElectrodePair'> Elcetrode Pair </option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md='3'>
                {/* electrode dropdown */}
                <Form.Group as={Row} className='mb-3' controlId="formHorizontal" >
                    <Form.Label column sm={4} id='selectPosition'>Electrodes:</Form.Label>
                    <Col sm={8}>
                        <Form.Select onChange={electrodOnChange} ref={eRef} id='selectPosition'>
                            {
                                data.filter(d => {
                                    return d.name === propagation;
                                })[0].values.map((d, i) => {
                                    return (
                                        <option value={d} key={i}>{d}</option>
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


    function propagationOnChange(event) {
        // console.log(event.target.value)
        let val = event.target.value;
        // console.log(val)
        if (val === 'TopPercentile') {
            let evalue = +eRef.current.value;
            // console.log(evalue)
            let index
            // console.log(data[1].values)
            if (data[1].values.includes(evalue)) {
                index = data[1].values.indexOf(evalue)
            } else {
                index = 0;
            }

            if (index >= data[0].values.length) {
                index = 0;
            }
            // console.log(index)
            let electrode = data[0].values[index]
            // console.log(electrode)
            setElectrodeNetworkValue(['TopPercentile', electrode])


            selectedPropagation(event.target.value)
            // setData(percentile)
        } else {
            let val = +eRef.current.value;
            let index
            if (data[0].values.includes(val)) {
                index = data[0].values.indexOf(val)
            } else {
                index = 0;
            }
            let electrode = data[1].values[index]
            setElectrodeNetworkValue(['ElectrodePair', electrode])
            // // setData(electrodeList)
            // console.log(propaRef.current.value)
            selectedPropagation(event.target.value)
        }
    }

    function electrodOnChange(event) {
        let propagation = propaRef.current.value
        let electrode = event.target.value;
        setElectrodeNetworkValue([propagation, electrode])
        console.log(propaRef.current.value)
    }
}

function onSliderChange(value) {
    console.log(value)
}

