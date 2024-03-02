import React from "react";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./PatchSummary.css";

export const PatchSummary = ({
  patchData,
  eventData,
  selectedRoi,
  setSelectedRoi,
  samplePropagationData,
}) => {
  // increace the color contrast
  const electrodeColorList = [
    "hsl(205, 100%, 41%)",
    "hsl(28, 100%, 53%)",
    "hsl(120, 70%, 40%)",
    "hsl(360, 100%, 50%)",
    "hsl(271, 100%, 57%)",
    "hsl(10, 100%, 42%)",
    "hsl(318, 100%, 68%)",
    "hsl(0, 100%, 69%)",
    "hsl(196, 100%, 45%)",
    "hsl(161, 48%, 70%)",
    "hsl(333, 100%, 79%)",
  ];
  // frequency area opacity list
  const legendOpacity = [0.3, 0.5, 0.7, 1];

  // circle legend svg and g ref
  const circleSvgRef = useRef(null);
  const circleGRef = useRef(null);

  // frequency legend svg and g ref
  const frequencySvgRef = useRef(null);
  const frequencyGRef = useRef(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // dynamic move circle legend in the center of svg vertically
  useEffect(() => {
    // circle legend observer
    const circleObserver = new ResizeObserver(() => {
      if (circleSvgRef.current && circleGRef.current) {
        const svgBox = circleSvgRef.current.getBoundingClientRect();
        const gBox = circleGRef.current.getBBox();

        // circle legend align end of the svg
        const svgRightX = svgBox.width;
        const svgCenterY = svgBox.height / 2;
        const gRightX = gBox.x + gBox.width;
        const gCenterY = gBox.y + gBox.height / 2;

        const shiftX = svgRightX - gRightX;
        const shiftY = svgCenterY - gCenterY;

        circleGRef.current.setAttribute('transform', `translate(${shiftX}, ${shiftY})`);
      }
    });

    // frequency legend observer
    const frequencyObserver = new ResizeObserver(() => {
      if (frequencySvgRef.current && frequencyGRef.current) {
        const svgBox = frequencySvgRef.current.getBoundingClientRect();
        const gBox = frequencyGRef.current.getBBox();

        // frequency legend align center
        const svgRightX = svgBox.width;
        const svgCenterY = svgBox.height / 2;
        const gRightX = gBox.x + gBox.width;
        const gCenterY = gBox.y + gBox.height / 2;

        const shiftX = svgRightX - gRightX;
        const shiftY = svgCenterY - gCenterY;

        frequencyGRef.current.setAttribute('transform', `translate(${shiftX}, ${shiftY})`);
      }
    });

    if (circleSvgRef.current) {
      circleObserver.observe(circleSvgRef.current);
    }
    if (frequencySvgRef.current) {
      frequencyObserver.observe(frequencySvgRef.current);
    }

    return () => {
      circleObserver.disconnect();
      frequencyObserver.disconnect();
    }
  }, []);

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
      x: e.clientX - 150,
      y: e.clientY + 50,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // connect each patch to the corresponding patch network
  function patchOnClick(roi) {
    setSelectedRoi(Number(roi));
  }

  // getting each electrode frequency
  const processedPatchData = {};

  for (const key in patchData) {
    if (patchData.hasOwnProperty(key)) {
      const matrix = patchData[key].matrix;
      processedPatchData[key] = {
        ...patchData[key],
        matrix: matrix.map((row) =>
          row.map((num) => {
            if (num === null) return null; // Handle null values directly
            const occurrences = eventData.reduce((acc, dataItem) => {
              return acc + (dataItem.electrode.includes(num) ? 1 : 0);
            }, 0);
            return { [num]: occurrences };
          })
        ),
      };
    }
  }

  function findMaxInObject(obj) {
    let maxVal = -Infinity;
    function recurse(currentObj) {
      Object.values(currentObj).forEach((value) => {
        if (typeof value === "object" && value !== null) {
          recurse(value);
        } else if (typeof value === "number") {
          maxVal = Math.max(maxVal, value);
        }
      });
    }
    recurse(obj);
    return maxVal;
  }

  // target and source arc Bézier curve points function
  const CircularCurve = (cx, cy, radius, dynamicLength) => {
    // frequency area start and end position x and y
    const frequencyAngle = 180;
    const frequencyStartPositionX = cx + radius * Math.cos(frequencyAngle * Math.PI / 180);
    const frequencyStartPositionY = cy - radius * Math.sin(frequencyAngle * Math.PI / 180);
    const frequencyEndPositionX = cx;
    const frequencyEndPositionY = cy + radius;

    // target and source arc Bézier curve keypoint
    const target_source_keyPositionX = cx + Math.round(dynamicLength * Math.cos(45 * Math.PI / 180));
    const target_source_keyPositionY = cy - Math.round(dynamicLength * Math.sin(45 * Math.PI / 180));

    const target_source_endPositionX = target_source_keyPositionX;
    const target_source_endPositionY = cy + Math.sqrt(Math.pow(radius, 2) - Math.pow(Math.round(dynamicLength * Math.cos(45 * Math.PI / 180)), 2));

    const target_source_startPositionX = cx - Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(Math.round(dynamicLength * Math.cos(45 * Math.PI / 180)), 2)));
    const target_source_startPositionY = cy - Math.round(dynamicLength * Math.sin(45 * Math.PI / 180));

    return { frequencyStartPositionX, frequencyStartPositionY, frequencyEndPositionX, frequencyEndPositionY, target_source_keyPositionX, target_source_keyPositionY, target_source_endPositionX, target_source_endPositionY, target_source_startPositionX, target_source_startPositionY }
  }

  // find the max frequency number in electrodes
  const maxOccurrence = findMaxInObject(processedPatchData);

  const ratios = samplePropagationData
    .filter(item => item.source_counts !== 0 && item.target_counts !== 0)
    .map(item => item.target_counts / item.source_counts);

  // max and min ratio(target counts / source counts) for each electrode
  const minTargetRatio = Math.min(...ratios);
  const maxTargetRatio = Math.max(...ratios);

  const source_target_lineScale = d3.scaleLog().domain([minTargetRatio, maxTargetRatio]).range([0.7, 1.3]);
  const frequency_opacityScale = d3.scaleLinear().domain([0, maxOccurrence]).range([0.3, 1]);

  const circleRadius = 15;

  const rows = Object.keys(processedPatchData).map((roiKey, roiIndex) => {
    const roiMatrix = processedPatchData[roiKey].matrix;

    // For finding the max columns in one row
    const columnsPerRow = Math.max(...roiMatrix.map((a) => a.length));
    // For finding the rows
    const numRowsInSVG = roiMatrix.length;

    const roiLabelHeight = 10;
    const svgWidth = columnsPerRow * 45;
    const svgHeight = numRowsInSVG * 45 + roiLabelHeight;

    const fillColor = electrodeColorList[roiIndex];
    return (
      <Col
        md="4"
        key={roiKey}
        style={{
          height: "25vh",
          padding: 0,
          backgroundColor:
            selectedRoi === Number(roiKey)
              ? "rgba(202, 204, 202, 0.4)"
              : "white",
          border: `3px solid ${electrodeColorList[roiIndex]}`,
        }}
        onClick={() => patchOnClick(roiKey)}
      >
        <svg width="100%" height={10}>
          <g>
            <text x={10} y={10} fontSize={12} fill="black" textAnchor="start">
              {`Patch: ${roiKey}`}
            </text>
          </g>
        </svg>
        <svg
          width="100%"
          height="calc(100% - 10px)"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {roiMatrix.map((rowArray, rowIndex) => {
            const shift = columnsPerRow - rowArray.length;
            return rowArray.map((electrodeObj, columnIndex) => {
              if (electrodeObj === null) {
                return null;
              }

              const electrodeId = Object.keys(electrodeObj)[0];
              const electrodePropagation = samplePropagationData.find(
                (e) => e.electrode_id == electrodeId
              );

              const propagationCounts = electrodePropagation
                ? electrodePropagation
                : { electrode_id: Number(electrodeId), source_counts: 0, target_counts: 0 };

              const electrodeValue = electrodeObj[electrodeId];

              // adjust each electrode x and y position
              const cx = 28 + 42 * (columnIndex + shift);
              const cy = 20 + 42 * rowIndex + roiLabelHeight;

              const electrodeFrequencyOpacity = frequency_opacityScale(electrodeValue);

              // frequency and dynamic Bézier curve keypoint
              const dynamicLength = circleRadius * source_target_lineScale(propagationCounts.target_counts / propagationCounts.source_counts)
              const points = CircularCurve(cx, cy, circleRadius, dynamicLength);

              return (
                <g key={`${roiKey}-${rowIndex}-${columnIndex}`}>
                  <g
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
                    {/* frequency area */}
                    <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              Q ${cx} ${cy} ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              Z`}
                      fill={fillColor}
                      opacity={electrodeFrequencyOpacity}></path>

                    {/* source counts and target counts both exist */}
                    {propagationCounts.source_counts && propagationCounts.target_counts && (
                      <>
                        <path d={`M ${points.target_source_startPositionX} ${points.target_source_startPositionY} 
                              Q ${points.target_source_keyPositionX} ${points.target_source_keyPositionY} ${points.target_source_endPositionX} ${points.target_source_endPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                              Q ${cx} ${cy} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.target_source_startPositionX} ${points.target_source_startPositionY}
                              Z`}
                          fill="#8073ac">
                        </path>
                        {dynamicLength >= circleRadius ? (
                          <path d={`M ${points.target_source_startPositionX} ${points.target_source_startPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.target_source_endPositionX} ${points.target_source_endPositionY} 
                              Q ${points.target_source_keyPositionX} ${points.target_source_keyPositionY} ${points.target_source_startPositionX} ${points.target_source_startPositionY} 
                              Z`}
                            fill="#fdb863">
                          </path>
                        ) :
                          <path d={`M ${points.target_source_startPositionX} ${points.target_source_startPositionY} 
                              A ${circleRadius} ${circleRadius} 0 1 1 ${points.target_source_endPositionX} ${points.target_source_endPositionY} 
                              Q ${points.target_source_keyPositionX} ${points.target_source_keyPositionY} ${points.target_source_startPositionX} ${points.target_source_startPositionY} 
                              Z`}
                            fill="#fdb863">
                          </path>}
                      </>
                    )}

                    {/* if only have target counts */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts && (
                      <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${cx} ${cy} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                        fill="#fdb863"></path>
                    )}

                    {/* if only have source counts */}
                    {propagationCounts.source_counts && propagationCounts.target_counts === 0 && (
                      <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${cx} ${cy} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                        fill="#8073ac"></path>
                    )}

                    {/* if both counts both not exist */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts === 0 && (
                      <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${cx} ${cy} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                        fill="#A9A9A9"></path>
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

  // legend area setting
  const xCenter = 0;
  const yCenter = 0;

  const max_legendDynamicLength = circleRadius * source_target_lineScale(maxTargetRatio);
  const min_legendDynamicLength = circleRadius * source_target_lineScale(minTargetRatio);

  const legendMaxPoints = CircularCurve(xCenter, yCenter, circleRadius, max_legendDynamicLength);
  const legendMinPoints = CircularCurve(xCenter, yCenter, circleRadius, min_legendDynamicLength);

  const circleLegend = (
    <g ref={circleGRef}>
      {/* legend frequency area */}
      <path d={`M ${legendMaxPoints.frequencyStartPositionX} ${legendMaxPoints.frequencyStartPositionY} 
                Q ${xCenter} ${yCenter} ${legendMaxPoints.frequencyEndPositionX} ${legendMaxPoints.frequencyEndPositionY} 
                A ${circleRadius} ${circleRadius} 0 0 1 ${legendMaxPoints.frequencyStartPositionX} ${legendMaxPoints.frequencyStartPositionY} 
                Z`}
        fill={electrodeColorList[0]}
        stroke="black"
        transform="translate(-1.5,1.5)"
        strokeWidth={0.5}
      >
      </path>

      {/* legend source area */}
      <path d={`M ${legendMaxPoints.target_source_startPositionX} ${legendMaxPoints.target_source_startPositionY} 
                A ${circleRadius} ${circleRadius} 0 0 1 ${legendMaxPoints.target_source_endPositionX} ${legendMaxPoints.target_source_endPositionY} 
                Q ${legendMaxPoints.target_source_keyPositionX} ${legendMaxPoints.target_source_keyPositionY} ${legendMaxPoints.target_source_startPositionX} ${legendMaxPoints.target_source_startPositionY} 
                Z`}
        fill="#fdb863"
        stroke="black"
        transform="translate(1.5, -1.5)"
        strokeWidth={0.5}
      >
      </path>

      {/* max legend target area */}
      <path d={`M ${legendMaxPoints.target_source_startPositionX} ${legendMaxPoints.target_source_startPositionY} 
                Q ${legendMaxPoints.target_source_keyPositionX} ${legendMaxPoints.target_source_keyPositionY} ${legendMaxPoints.target_source_endPositionX} ${legendMaxPoints.target_source_endPositionY} 
                A ${circleRadius} ${circleRadius} 0 0 1 ${legendMaxPoints.frequencyEndPositionX} ${legendMaxPoints.frequencyEndPositionY} 
                Q ${xCenter} ${yCenter} ${legendMaxPoints.frequencyStartPositionX} ${legendMaxPoints.frequencyStartPositionY} 
                A ${circleRadius} ${circleRadius} 0 0 1 ${legendMaxPoints.target_source_startPositionX} ${legendMaxPoints.target_source_startPositionY}
                Z`}
        stroke="black"
        strokeWidth={0.5}
        fill="#8073ac">
      </path>

      {/* min target arc */}
      <path d={`M ${legendMinPoints.target_source_startPositionX} ${legendMinPoints.target_source_startPositionY}
                Q ${legendMinPoints.target_source_keyPositionX} ${legendMinPoints.target_source_keyPositionY} ${legendMinPoints.target_source_endPositionX} ${legendMinPoints.target_source_endPositionY}`}
        fill="none"
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      ></path>

      {/* frequency area line */}
      <line
        x1={(legendMaxPoints.frequencyStartPositionX + legendMaxPoints.frequencyEndPositionX) / 2}
        x2={(legendMaxPoints.frequencyStartPositionX + legendMaxPoints.frequencyEndPositionX) / 2 - 50}
        y1={(legendMaxPoints.frequencyStartPositionY + legendMaxPoints.frequencyEndPositionY) / 2}
        y2={(legendMaxPoints.frequencyStartPositionY + legendMaxPoints.frequencyEndPositionY) / 2}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* target area line */}
      <line
        x1={(legendMaxPoints.target_source_startPositionX + legendMaxPoints.target_source_endPositionX) / 2 - 15}
        x2={(legendMaxPoints.target_source_startPositionX + legendMaxPoints.target_source_endPositionX) / 2 - 50}
        y1={(legendMaxPoints.target_source_startPositionY + legendMaxPoints.target_source_endPositionY) / 2}
        y2={(legendMaxPoints.target_source_startPositionY + legendMaxPoints.target_source_endPositionY) / 2}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* max target area line */}
      <line
        x1={legendMaxPoints.target_source_endPositionX}
        x2={legendMaxPoints.target_source_endPositionX + 50}
        y1={legendMaxPoints.target_source_endPositionY}
        y2={legendMaxPoints.target_source_endPositionY}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* min target area line */}
      <line
        x1={legendMinPoints.target_source_endPositionX}
        x2={legendMinPoints.target_source_endPositionX + 50}
        y1={legendMinPoints.target_source_endPositionY}
        y2={legendMinPoints.target_source_endPositionY}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* source area line */}
      <line
        x1={(legendMaxPoints.target_source_startPositionX + legendMaxPoints.target_source_endPositionX) / 2}
        x2={(legendMaxPoints.target_source_startPositionX + legendMaxPoints.target_source_endPositionX) / 2 - 50}
        y1={(legendMaxPoints.target_source_startPositionY + legendMaxPoints.target_source_endPositionY) / 2 - 11}
        y2={(legendMaxPoints.target_source_startPositionY + legendMaxPoints.target_source_endPositionY) / 2 - 11}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* frequency area text */}
      <text
        x={(legendMaxPoints.frequencyStartPositionX + legendMaxPoints.frequencyEndPositionX) / 2 - 103}
        y={(legendMaxPoints.frequencyStartPositionY + legendMaxPoints.frequencyEndPositionY) / 2}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Frequency
      </text>

      {/* target area text */}
      <text
        x={(legendMaxPoints.target_source_startPositionX + legendMaxPoints.target_source_endPositionX) / 2 - 85}
        y={(legendMaxPoints.target_source_startPositionY + legendMaxPoints.target_source_endPositionY) / 2}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Target
      </text>

      {/* max target area text */}
      <text
        x={legendMaxPoints.target_source_endPositionX + 52}
        y={legendMaxPoints.target_source_endPositionY - 2}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Ratio:{maxTargetRatio.toFixed(1)}
      </text>

      {/* min target area text */}
      <text
        x={legendMinPoints.target_source_endPositionX + 52}
        y={legendMinPoints.target_source_endPositionY}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Ratio: {minTargetRatio.toFixed(1)}
      </text>

      {/* source area text */}
      <text
        x={(legendMaxPoints.frequencyStartPositionX + legendMaxPoints.frequencyEndPositionX) / 2 - 75}
        y={(legendMaxPoints.target_source_startPositionY + legendMaxPoints.target_source_endPositionY) / 2 - 11}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Source
      </text>
    </g>
  )

  // frequency legend area setting
  const frequencyLegend = (
    <g ref={frequencyGRef}>
      {legendOpacity.map((item, index) => {
        let frequencyLegendXPosition = xCenter + index * 25;
        let frequencyLegendItemPoints = CircularCurve(frequencyLegendXPosition, yCenter, circleRadius, circleRadius * source_target_lineScale(maxTargetRatio));
        return (
          <React.Fragment key={index}>
            <path d={`M ${frequencyLegendItemPoints.frequencyStartPositionX} ${frequencyLegendItemPoints.frequencyStartPositionY} 
                    Q ${frequencyLegendXPosition} ${yCenter} ${frequencyLegendItemPoints.frequencyEndPositionX} ${frequencyLegendItemPoints.frequencyEndPositionY} 
                    A ${circleRadius} ${circleRadius} 0 0 1 ${frequencyLegendItemPoints.frequencyStartPositionX} ${frequencyLegendItemPoints.frequencyStartPositionY} 
                    Z`}
              key={index}
              fill={electrodeColorList[0]}
              opacity={item}
            >
            </path>
            <text className="frequencyLegendText" x={(frequencyLegendItemPoints.frequencyStartPositionX + frequencyLegendItemPoints.frequencyEndPositionX) / 2 - 8} y={yCenter + circleRadius + 12}>{Math.round(maxOccurrence * item)}</text>
          </React.Fragment>
        )
      })}
    </g>
  )

  return (
    <Col
      md="12"
      className="patchSummaryContainer"
      style={{ height: "89.5vh", backgroundColor: "#FAFBFC" }}
    >
      <Row>
        <Col md="12" style={{ height: "5vh" }}>
          <Row style={{ height: "100%", margin: 0, display: 'flex' }}>
            <Col md="3" className="summary">Patch Summary</Col>
            <Col md="9" className="summary">
              <svg ref={frequencySvgRef} width="50%" height="100%" overflow="visible">
                {frequencyLegend}
              </svg>
              <svg ref={circleSvgRef} width="50%" height="100%" overflow="visible">
                {circleLegend}
              </svg>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row
        style={{
          height: "92%",
          overflowY: "auto",
          width: "100%",
          margin: 0,
          alignContent: "flex-start",
        }}
      >
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
              zIndex: 1000,
            }}
          >
            {tooltip.content}
          </div>
        )}
      </Row>
    </Col>
  );
};
