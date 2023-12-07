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
// console.log("eventData",eventData);
// console.log("eventRange",eventRange);
    // console.log(electrodeData)
    const numRows = Math.ceil((data.length - 1) / rowSize);

    const filteredData = eventData.filter((el) => el.time.some(t => t >= eventRange[0] && t <= eventRange[eventRange.length - 1]))

    // console.log(filteredData)
    console.log("regionsummary",data)
    // console.log(roiCount)

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

    const circleRadius = d3.scaleLinear()
        .domain([0, d3.max(radiusDomain) === 0 ? 1 : d3.max(radiusDomain)])
        .range([2, 8])

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
        // console.log(rowObjects)
        return (
            <Row key={rowKey}>
                {rowObjects.map((object, i) => (
                    <Col
                        md='4'
                        key={data[i].roi}
                        style={{
                            height: `${30 / numRows}vh`,
                            backgroundColor: selectedRoi === (i + rowStartIndex) ? "rgba(202, 204, 202, 0.4)" : "white",
                        }}
                        onClick={() => summaryOnClick(i, rowStartIndex)}
                    >
                        <RegionCircles
                            data={object}
                            eventNetworkData={data}
                            circleRadius={circleRadius}
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

    const tickList = circleRadius.ticks();
    const ticks = [tickList[0], tickList[tickList.length - 1]];
    // console.log(ticks)
    const maxValue = ticks[ticks.length - 1];
    const dimension = circleRadius(maxValue) * 2; // height and width of the biggest circle
    const DASH_WIDTH = 50;

    const circleLegend = ticks.map((tick, i) => {
        const xCenter = dimension / 2;
        const yCircleTop = dimension - 2 * circleRadius(tick);
        const yCircleCenter = dimension - circleRadius(tick);

        return (
            <g key={i} transform="translate(5,5)">
                <circle
                    cx={xCenter}
                    cy={yCircleCenter}
                    r={circleRadius(tick)}
                    fill="none"
                    stroke="black"
                />
                <line
                    x1={xCenter}
                    x2={xCenter + DASH_WIDTH}
                    y1={yCircleTop}
                    y2={yCircleTop}
                    stroke="black"
                    strokeDasharray={"2,2"}
                />
                <text
                    x={xCenter + DASH_WIDTH + 4}
                    y={yCircleTop}
                    fontSize={10}
                    alignmentBaseline="middle"
                >
                    {tick}
                </text>
            </g>
        );
    });

    return (
        <Col
            md="12"
            className="regionSummaryContainer"
            style={{ height: "35vh", backgroundColor: "#FAFBFC" }}
        >
            <Row>
                <Col md="12" style={{ height: "4vh" }}>
                    <Row>
                        <Col>Region Summary</Col>
                        <Col><div className="regionLabel">Frequency</div></Col>
                        <Col>
                            <svg width={100} height={20} overflow='visible'>
                                {circleLegend}
                            </svg>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md="12" style={{ height: "30vh" }}>
                    <>{rows}</>
                </Col>
            </Row>
        </Col>

    );
};

