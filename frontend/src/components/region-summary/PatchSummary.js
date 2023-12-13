import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./PatchSummary.css";

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
  const electrodeColorList = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bfa3a3', '#00A5E3', '#8DD7BF', '#FF96C5'];

  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // tooltip controller
  const handleMouseEnter = (
    electrodeId,
    electrodeValue,
    propagationCounts,
    e
  ) => {
    setTooltip({
      visible: true,
      content: `Electrode ID: ${electrodeId}\n Frequency: ${electrodeValue}\n Source\u00A0counts: ${propagationCounts.source_counts}\n Target\u00A0counts: ${propagationCounts.target_counts}`,
      x: e.clientX + 20,
      y: e.clientY - 20,
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
    .range([2, 12]);

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
    console.log(svgWidth, '????')
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
          height: "30vh",
          padding: 0,
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
              {`Patch: ${roiKey}`}
            </text>
            <rect
              x={50}
              y={0}
              width={roiScale(roiCount[roiKey]) - roiLabelWidth}
              height={10}
              opacity={1}
            />
            <title>
              {`
                Patch : ${roiKey}\n Frequency : ${roiCount[roiKey]}
            `}
            </title>
          </g>
        </svg>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {roiMatrix.map((rowArray, rowIndex) => {
            const shift = columnsPerRow - rowArray.length;
            return rowArray.map((electrodeObj, columnIndex) => {
              const electrodeId = Object.keys(electrodeObj)[0];
              const electrodePropagation = samplePropagationData.find(
                (e) => e.electrode_id == electrodeId
              );
              const propagationCounts = electrodePropagation
                ? electrodePropagation
                : { source_counts: 0, target_counts: 0 };

              const electrodeValue = electrodeObj[electrodeId];

              const cx = 25 + 50 * (columnIndex + shift);
              const cy = 25 + 50 * rowIndex + roiLabelHeight;
              const sourceRatio =
                propagationCounts.source_counts +
                  propagationCounts.target_counts ===
                0
                  ? 0
                  : propagationCounts.source_counts /
                    (propagationCounts.source_counts +
                      propagationCounts.target_counts);
              const targetRatio =
                propagationCounts.source_counts +
                  propagationCounts.target_counts ===
                0
                  ? 0
                  : propagationCounts.target_counts /
                    (propagationCounts.source_counts +
                      propagationCounts.target_counts);
              return (
                <g key={`${roiKey}-${rowIndex}-${columnIndex}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={circleRadius(electrodeValue)}
                    fill={fillColor}
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        electrodeId,
                        electrodeValue,
                        propagationCounts,
                        e
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                  />
                  <g
                    transform={`translate(${cx},${cy})`}
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        electrodeId,
                        electrodeValue,
                        propagationCounts,
                        e
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <circle
                      r={circleRadius(electrodeValue) + 5}
                      fill="none"
                      stroke={
                        sourceRatio === 0 && targetRatio === 0
                          ? "grey"
                          : "#5e4fa2"
                      }
                      strokeWidth="10"
                    />
                    {sourceRatio > 0 && (
                      <circle
                        r={circleRadius(electrodeValue) + 5}
                        fill="none"
                        stroke="#9e0142"
                        strokeWidth="10"
                        strokeDasharray={`${
                          sourceRatio.toFixed(2) *
                          3.14 *
                          2 *
                          (circleRadius(electrodeValue) + 5)
                        } 100`}
                        transform={`rotate(-90)`}
                      />
                    )}
                    {targetRatio > 0 && sourceRatio == 0 && (
                      <circle
                        r={circleRadius(electrodeValue) + 5}
                        fill="none"
                        stroke="#5e4fa2"
                        strokeWidth="10"
                        strokeDasharray={`${
                          targetRatio.toFixed(2) *
                          3.14 *
                          2 *
                          (circleRadius(electrodeValue) + 5)
                        } 100`}
                        transform={`rotate(-90)`}
                      />
                    )}
                  </g>
                </g>
              );
            });
          })}
        </svg>
      </Col>
    );
  });

  const customTicks = [0, maxOccurrence];
  const tickList = circleRadius.ticks().concat(customTicks);
  const ticks = [tickList[0], tickList[tickList.length - 1]];
  const maxValue = ticks[ticks.length - 1];
  const dimension = circleRadius(maxValue) * 2;
  const DASH_WIDTH = 50;

  const circleLegend = ticks.map((tick, i) => {
    const xCenter = 14 * dimension;
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
        <Col md="12" style={{ height: "4vh"}}>
          <Row style={{ height: "100%" }}>
            <Col className="summary">Patch Summary</Col>
            <Col className="summary">
              <svg width="100%" height="100%" overflow="visible">
                <text
                  x={11 * dimension}
                  y={18}
                  fontSize={11}
                  alignmentBaseline="middle"
                >
                  Frequency:
                </text>
                {circleLegend}
                <g>
                  <rect
                    x={14 * dimension + 100}
                    y={0}
                    fill="#9e0142"
                    width={10}
                    height={10}
                  />
                  <text
                    x={14 * dimension + 120}
                    y={5}
                    fontSize={10}
                    alignmentBaseline="middle"
                  >
                    Source counts
                  </text>
                  <rect
                    x={14 * dimension + 100}
                    y={20}
                    fill="#5e4fa2"
                    width={10}
                    height={10}
                  />
                  <text
                    x={14 * dimension + 120}
                    y={25}
                    fontSize={10}
                    alignmentBaseline="middle"
                  >
                    Target counts
                  </text>
                </g>
              </svg>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ height: "35vh", overflowY: "auto", width: "100%" }}>
        <>{rows}</>
        {tooltip.visible && (
          <div
            style={{
              width: 180,
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
