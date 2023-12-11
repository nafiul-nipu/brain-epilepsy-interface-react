import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";
import * as d3 from 'd3';
import './RegionSummary.css'
const rowSize = 3;

export const RegionSummary = ({
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
    console.log("eventData", eventData);
    // console.log("eventRange",eventRange);
    // console.log(electrodeData)
    const numRows = Math.ceil((data.length - 1) / rowSize);

    const filteredData = eventData.filter((el) => el.time.some(t => t >= eventRange[0] && t <= eventRange[eventRange.length - 1]))

    // console.log(filteredData)
    // console.log("regionsummary", data)
    // console.log(roiCount)

    const regionCiclesData = [];
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
        const rowKey = `row-${rowIndex}`;
        // console.log(rowStartIndex, rowObjects, rowKey)
        return (
            <Row key={rowKey}>
                {rowObjects.map((object, i) => (
                    <Col
                        md='4'
                        key={data[i].roi}
                        style={{
                            height: `${34 / numRows}vh`,
                            backgroundColor: selectedRoi === (i + rowStartIndex) ? "rgba(202, 204, 202, 0.4)" : "white",
                        }}
                        onClick={() => summaryOnClick(i, rowStartIndex)}
                    >
                        <RegionCircles
                            data={object}
                            eventNetworkData={data}
                            roi={i + rowStartIndex}
                            roiCount={roiCount}
                            roiFilter={roiFilter}
                            setRoiFilter={setRoiFilter}
                            electrodeData={electrodeData}
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

