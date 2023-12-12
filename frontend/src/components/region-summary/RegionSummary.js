import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";
import * as d3 from 'd3';
import './RegionSummary.css'
const rowSize = 3;

export const RegionSummary = ({
    networks,
    sampleName,
    data,
    eventData,
    eventRange,
    selectedRoi,
    setSelectedRoi,
    roiCount,
    roiFilter,
    setRoiFilter,
    electrodeData
}) => {
    // console.log("eventData",eventData);
    // console.log("eventRange",eventRange);
    // console.log(electrodeData)
    // console.log(data)
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
        const rowStartIndex = rowIndex * rowSize;
        const rowObjects = regionCiclesData.slice(rowStartIndex, rowStartIndex + rowSize);
        // console.log(rowObjects)
        const rowKey = `row-${rowIndex}`;
        // console.log(rowStartIndex, rowObjects, rowKey)
        return (
            <Row key={rowKey}>
                {rowObjects.map((object, i) => (
                    <Col
                        md='4'
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
            <Row>
            </Row>
            <Row>
                <Col md="12" style={{ height: "35vh" }}>
                    <>{rows}</>
                </Col>
            </Row>
        </Col>

    );
};

