import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as d3 from "d3";

const rowSize = 3;

export const PatchSummary = ({
  data,
  patchData,
  eventData,
  eventRange,
  selectedRoi,
  setSelectedRoi,
  roiCount,
  roiFilter,
  setRoiFilter,
  electrodeData,
}) => {
  const colorList = [
    "#3CA7D3",
    "#E7AC5C",
    "#60C95D",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#bfa3a3",
  ];
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  // data is the all electrodes
  console.log(data, eventData, patchData, "????????");
  const numRows = Math.ceil((data.length - 1) / rowSize);

  // tooltip controller
  const handleMouseEnter = (electrodeId, electrodeValue, e) => {
    setTooltip({
      visible: true,
      content: `Electrode ID: ${electrodeId}\n Frequency: ${electrodeValue}`,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // For getting each electrode frequency
  const processedPatchData = {};

  for (const key in patchData) {
    if (patchData.hasOwnProperty(key)) {
      processedPatchData[key] = patchData[key].map((subArray) =>
        subArray.map((num) => {
            const occurrences = eventData.reduce((acc, dataItem) => {
                return acc + dataItem.electrode.filter(x => x === num).length;
              }, 0);
            return { [num]: occurrences };
        })
      );
    }
  }

  function findMaxInObject(obj) {
    let maxVal = -Infinity;
    function recurse(currentObj) {
      Object.values(currentObj).forEach((value) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object, recurse deeper
          recurse(value);
        } else if (typeof value === "number") {
          maxVal = Math.max(maxVal, value);
        }
      });
    }
    recurse(obj);
    return maxVal;
  }

  const maxOccurrence = findMaxInObject(processedPatchData);

  const circleRadius = d3
    .scaleLinear()
    .domain([0, maxOccurrence])
    .range([2, 8]);

  const rows = Object.keys(processedPatchData).map((roiKey, roiIndex) => {
    const roiMatrix = processedPatchData[roiKey];
    // For finding the max columns in one row
    const columnsPerRow = Math.max(...roiMatrix.map((a) => a.length));
    // For finding the rows
    const numRowsInSVG = roiMatrix.length;

    const roiLabelWidth = 20;
    const roiLabelHeight = 10;
    const svgWidth = columnsPerRow * 50;
    const svgHeight = numRowsInSVG * 50 + roiLabelHeight;
    const roiScale = d3
      .scaleLinear()
      .domain([0, d3.max(roiCount)])
      .range([0, svgWidth]);

    const colorIndex = roiIndex % colorList.length;
    const fillColor = colorList[colorIndex];
    return (
      <Col md="4" key={roiKey} style={{ height: `${30 / numRows}vh` }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <g>
            <text x={0} y={10} fontSize={12} fill="black" textAnchor="start">
              {`Roi: ${roiKey}`}
            </text>
            <rect
              x={35}
              y={0}
              width={roiScale(roiCount[roiKey]) - roiLabelWidth}
              height={10}
              opacity={1}
            />
            <title>{`
                    Roi : ${roiKey}\n Frequency : ${roiCount[roiKey]}
                `}</title>
          </g>

          {roiMatrix.map((rowArray, rowIndex) => {
            const shift = columnsPerRow - rowArray.length;
            return rowArray.map((electrodeObj, columnIndex) => {
              const electrodeId = Object.keys(electrodeObj)[0];
              const electrodeValue = electrodeObj[electrodeId];

              const cx = 25 + 50 * (columnIndex + shift);
              const cy = 25 + 50 * rowIndex + roiLabelHeight;

              return (
                <g key={`${roiKey}-${rowIndex}-${columnIndex}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    onMouseEnter={(e) =>
                      handleMouseEnter(electrodeId, electrodeValue, e)
                    }
                    onMouseLeave={handleMouseLeave}
                    r={circleRadius(electrodeValue)}
                    fill={fillColor}
                  />
                </g>
              );
            });
          })}
        </svg>
      </Col>
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
            <Col>Patch Summary</Col>
            <Col>
              <div className="regionLabel">Frequency</div>
            </Col>
            <Col>
              <svg width={100} height={20} overflow="visible">
                {circleLegend}
              </svg>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <>{rows}</>
        {tooltip.visible && (
          <div
            style={{
              width: 150,
              position: "absolute",
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              backgroundColor: "white",
              border: "1px solid black",
              padding: "5px",
              pointerEvents: "none",
            }}
          >
            {tooltip.content}
          </div>
        )}
      </Row>
    </Col>
  );
};
