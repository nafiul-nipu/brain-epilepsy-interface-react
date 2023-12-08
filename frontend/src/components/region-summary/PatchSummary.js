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
  samplePropagationData,
  roiFilter,
  setRoiFilter,
  electrodeData,
}) => {
  const roiBackgroundColor = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#bfa3a3",
  ];

  const electrodeColorList = [
    "#57B4DB",
    "#E7AC5C",
    "#7BD370",
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
  const numRows = Math.ceil((data.length - 1) / rowSize);

  // tooltip controller
  const handleMouseEnter = (
    electrodeId,
    electrodeValue,
    propagationCounts,
    e
  ) => {
    setTooltip({
      visible: true,
      content: `Electrode ID: ${electrodeId}\n Frequency: ${electrodeValue} \n Propagation: ${propagationCounts}`,
      x: e.clientX,
      y: e.clientY,
    });
  };
  function patchOnClick(roi) {
    setSelectedRoi(Number(roi));
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // For getting each electrode frequency
  const processedPatchData = {};
  const maxPropagationCounts = samplePropagationData.reduce((max, current) => {
    return current.propagation > max ? current.propagation : max;
  }, 0);

  for (const key in patchData) {
    if (patchData.hasOwnProperty(key)) {
      processedPatchData[key] = patchData[key].map((subArray) =>
        subArray.map((num) => {
          const occurrences = eventData.reduce((acc, dataItem) => {
            return acc + dataItem.electrode.filter((x) => x === num).length;
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
    .range([2, 15]);

  const propagationRadius = d3
    .scaleLinear()
    .domain([0, maxPropagationCounts])
    .range([2, 5]);

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
      .range([0, svgWidth - roiLabelWidth]);

    const colorIndex = roiIndex % electrodeColorList.length;
    const fillColor = electrodeColorList[colorIndex];
    return (
      <Col
        md="4"
        key={roiKey}
        style={{
          height: `${30 / numRows}vh`,
          backgroundColor:
            selectedRoi === Number(roiKey)
              ? "rgba(202, 204, 202, 0.4)"
              : "white",
        }}
        onClick={() => patchOnClick(roiKey)}
      >
        <svg width="100%" height={10}>
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
            <title>
              {`
                Roi : ${roiKey}\n Frequency : ${roiCount[roiKey]}
            `}
            </title>
          </g>
        </svg>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          //   style={{ backgroundColor: roiBackgroundColor[Number(roiKey)], opacity: 1 }}
        >
          {roiMatrix.map((rowArray, rowIndex) => {
            const shift = columnsPerRow - rowArray.length;
            return rowArray.map((electrodeObj, columnIndex) => {
              const electrodeId = Object.keys(electrodeObj)[0];
              const electrodePropagation = samplePropagationData.find(
                (e) => e.electrode_id == electrodeId
              );
              const propagationCounts = electrodePropagation
                ? electrodePropagation.propagation
                : 0;

              const electrodeValue = electrodeObj[electrodeId];

              const cx = 25 + 50 * (columnIndex + shift);
              const cy = 25 + 50 * rowIndex + roiLabelHeight;

              return (
                <g key={`${roiKey}-${rowIndex}-${columnIndex}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={circleRadius(electrodeValue)}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth="1"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        electrodeId,
                        electrodeValue,
                        propagationCounts,
                        e
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                    r={propagationRadius(propagationCounts)}
                    fill={fillColor}
                    // fill="red"
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
              top: `${tooltip.y - 20}px`,
              backgroundColor: "white",
              border: "1px solid black",
              padding: "5px",
              pointerEvents: "none",
              fontSize: "14px",
            }}
          >
            {tooltip.content}
          </div>
        )}
      </Row>
    </Col>
  );
};
