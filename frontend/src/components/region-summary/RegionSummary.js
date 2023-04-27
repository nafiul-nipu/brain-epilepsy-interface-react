import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";
import * as d3 from 'd3';
const rowSize = 3;

export const RegionSummary = ({ data, eventData, eventRange, setSelectedRoi }) => {
    const numRows = Math.ceil((data.length - 1) / rowSize);

    const filteredData = eventData.filter((el) => el.time.some(t => t >= eventRange[0] && t <= eventRange[1]))

    console.log(filteredData)
    // console.log(data)

    const regionCiclesData = [];
    let radiusDomain = [];
    for (let i = 0; i < data.length - 1; i++) {
        const arr = data[i].electrodes;
        const result = arr.reduce((acc, curr) => {
            const frequency = filteredData.reduce((freq, obj) => {
                if (obj.electrode.includes(curr)) {
                    freq++;
                }
                return freq;
            }, 0);

            acc.activeElectrode.push(curr);
            acc.frequency.push(frequency);
            return acc;
        }, { activeElectrode: [], frequency: [] });

        regionCiclesData.push(result);
        radiusDomain.push(...d3.extent(result.frequency))
    }

    console.log(regionCiclesData)
    // console.log(radiusDomain)

    function summaryOnClick(index, rowStartIndex) {
        // console.log('clicked', rowStartIndex + index)
        setSelectedRoi(rowStartIndex + index)
    }
    const rows = [...Array(numRows)].map((_, rowIndex) => {
        const rowStartIndex = rowIndex * rowSize;
        const rowObjects = regionCiclesData.slice(rowStartIndex, rowStartIndex + rowSize);
        const rowKey = `row-${rowIndex}`;
        // console.log(rowStartIndex)
        return (
            <Row key={rowKey}>
                {rowObjects.map((object, i) => (
                    <Col md='4' key={data[i].roi} style={{ height: `${30 / numRows}vh` }} onClick={() => summaryOnClick(i, rowStartIndex)}>
                        <RegionCircles
                            data={object}
                            radiusDomain={d3.extent(radiusDomain)}
                        />
                    </Col>
                ))}
            </Row>
        );
    });

    return (
        <>{rows}</>
    );
};

