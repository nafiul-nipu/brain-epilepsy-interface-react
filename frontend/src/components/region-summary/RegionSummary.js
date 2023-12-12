import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";
import * as d3 from 'd3';
import './RegionSummary.css'
import { useState } from "react";
const rowSize = 3;

export const RegionSummary = ({
    networks,
    sampleName,
    setSelectedRoi,
    electrodeData
}) => {

    const [topPercent, setTopPercent] = useState(0.01)
    const [colorTheLine, setColorTheLine] = useState('width')

    const topOnChange = (event) => {
        setTopPercent(event.target.value)
    }

    const colorOnChange = (event) => {
        setColorTheLine(event.target.value)
    }

    // data - data to show
    // numRows how many views to show
    const samples = Object.keys(networks);
    const rowLength = samples.length;
    const numRows = Math.ceil((rowLength - 1) / rowSize);
    // console.log(rowLength)

    const electrodes = electrodeData.map((obj) => obj.electrode_number);

    // console.log(filteredData)
    // console.log("regionsummary", data)
    // console.log(roiCount)

    const regionCiclesData = [];
    for (let i = 0; i < rowLength; i++) {
        const result = networks[samples[i]]
        regionCiclesData.push(result);
    }

    // console.log(regionCiclesData)
    // console.log(radiusDomain)

    function summaryOnClick(index, rowStartIndex) {
        // console.log('clicked', rowStartIndex + index)
        setSelectedRoi(rowStartIndex + index)
        // setRoiFilter(rowStartIndex + index)
    }
    const rows = [...Array(numRows)].map((_, rowIndex) => {
        const rowStartIndex = rowIndex * rowLength;
        const rowObjects = regionCiclesData.slice(rowStartIndex, rowStartIndex + rowLength);
        // console.log(rowObjects)
        const rowKey = `row-${rowIndex}`;
        // console.log(rowStartIndex, rowObjects, rowKey)
        return (
            <Row key={rowKey}>
                {rowObjects.map((object, i) => (
                    <Col
                        md={`${12 / rowLength}`}
                        key={i}
                        style={{
                            height: `${34 / numRows}vh`,
                            backgroundColor: sampleName === samples[i] ? "rgba(202, 204, 202, 0.4)" : "white",
                        }}
                        onClick={() => summaryOnClick(i, rowStartIndex)}
                    >
                        <RegionCircles
                            sample={samples[i]}
                            colorIndex={i}
                            data={object}
                            electrodes={electrodes}
                            sampleCount={rowLength}
                            currsample={sampleName}
                            topPercent={topPercent}
                            colorTheLine={colorTheLine}
                        />
                    </Col>

                ))
                }
            </Row >
        );
    });


    return (
        <Col
            md="12"
            className="regionSummaryContainer"
            style={{ height: "35vh", backgroundColor: "#FAFBFC" }}
        >
            {/* Patient dropdown */}
            <div id="region-topPercent">
                <label htmlFor="percent">Top:</label>
                <select id="percent" value={topPercent} onChange={topOnChange}>
                    <option value="0.01"> 1% </option>
                    <option value="0.02"> 2% </option>
                    <option value="0.05"> 5% </option>
                    <option value="0.1"> 10% </option>
                </select>
            </div>

            {/* propagation dropdown */}
            <div id="region-color">
                <label htmlFor="color">Color:</label>
                <select id="color" value={colorTheLine} onChange={colorOnChange}>
                    <option value="width"> width</option>
                    <option value="time"> time </option>
                </select>
            </div>

            <Row>
                <Col md="12" style={{ height: "35vh" }}>
                    <>{rows}</>
                </Col>
            </Row>
        </Col>

    );
};

