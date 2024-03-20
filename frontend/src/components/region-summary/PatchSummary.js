import React from "react";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Switch } from 'antd';
import "./PatchSummary.css";

const electrodeColorList = [
  '#007ed3',
  '#FF004F',
  '#9F8170',
  '#9400D3',
  '#FFC40C',
  '#59260B',
  '#FE4EDA',
  '#40E0D0',
  '#FF4F00',
  '#006D6F',
  '#C19A6B'
]

export const PatchSummary = ({
  patchData,
  eventData,
  selectedRoi,
  setSelectedRoi,
  samplePropagationData,
  electrodeData
}) => {

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
    propagationCounts,
    e
  ) => {
    setTooltip({
      visible: true,
      content: `Electrode\u00A0ID: ${electrodeId}\n Total\u00A0Spikes: ${propagationCounts.propagation + propagationCounts.nonPropagation}\n Propagation\u00A0Counts: ${propagationCounts.propagation}\n Non\u00A0propagation\u00A0Counts: ${propagationCounts.nonPropagation}`,
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

  const patchLabels = electrodeData.reduce((result, obj) =>
    ({ ...result, [obj.electrode_number]: obj.label }), {});
  const regiionLabels = electrodeData.reduce((result, obj) =>
    ({ ...result, [obj.electrode_number]: obj.region }), {});

  const regions = [...new Set(electrodeData.map(obj => obj.region))];

  // getting each electrode frequency
  const processedPatchData = {};

  for (const key in patchData) {
    if (patchData.hasOwnProperty(key)) {
      const matrix = patchData[key].matrix;
      processedPatchData[key] = {
        ...patchData[key],
        matrix: matrix.map((row) =>
          row.map((num) => {
            if (num === null) return null;
            const occurrences = eventData.reduce((acc, dataItem) => {
              return acc + (dataItem.electrode.includes(num) ? 1 : 0);
            }, 0);
            return { [num]: occurrences };
          })
        ),
      };
    }
  }

  // target and source arc Bézier curve points function
  const CircularCurve = (cx, cy, radius, dynamicfrequencyLength) => {
    const propagationKeyPositionX = cx - (radius - dynamicfrequencyLength) * Math.cos(45 * Math.PI / 180);
    const propagationKeyPositionY = cy + (radius - dynamicfrequencyLength) * Math.sin(45 * Math.PI / 180);

    const propagationEndPositionX = propagationKeyPositionX;
    const propagationEndPositionY = cy + Math.sqrt(Math.pow(radius, 2) - Math.pow((radius - dynamicfrequencyLength) * Math.cos(45 * Math.PI / 180), 2));

    const propagationStartPositionX = cx - Math.sqrt(Math.pow(radius, 2) - Math.pow((radius - dynamicfrequencyLength) * Math.sin(45 * Math.PI / 180), 2));
    const propagationStartPositionY = propagationKeyPositionY;

    return { propagationStartPositionX, propagationStartPositionY, propagationEndPositionX, propagationEndPositionY, propagationKeyPositionX, propagationKeyPositionY }
  }

  const minPropagation = samplePropagationData
    .map(item => item.propagation)
    .reduce((min, current) => Math.min(min, current), Infinity);

  const maxPropagation = samplePropagationData
    .map(item => item.propagation)
    .reduce((max, current) => Math.max(max, current), -Infinity);

  const minSpikesSum = samplePropagationData
    .map(item => item.propagation + item.nonPropagation)
    .reduce((min, current) => Math.min(min, current), Infinity);

  const maxSpikesSum = samplePropagationData
    .map(item => item.propagation + item.nonPropagation)
    .reduce((max, current) => Math.max(max, current), -Infinity);

  const propagation_lineScale = d3.scaleLinear().domain([minPropagation, maxPropagation]).range([0.5, 0.95]);
  const dynamicCircleRadius = d3.scaleLinear().domain([minSpikesSum, maxSpikesSum]).range([10, 20]);

  // find max columns and rows in all patches
  const maxDimensions = {
    columnsPerRow: 0,
    numRowsInSVG: 0
  };

  Object.keys(processedPatchData).forEach((roiKey) => {
    const roiMatrix = processedPatchData[roiKey].matrix;
    // For finding the max columns in one row
    const columnsPerRow = Math.max(...roiMatrix.map((a) => a.length));
    // For finding the rows
    const numRowsInSVG = roiMatrix.length;

    // Update maximum in the object if current values are higher
    if (columnsPerRow > maxDimensions.columnsPerRow) {
      maxDimensions.columnsPerRow = columnsPerRow;
    }
    if (numRowsInSVG > maxDimensions.numRowsInSVG) {
      maxDimensions.numRowsInSVG = numRowsInSVG;
    }
  });

  const rows = Object.keys(processedPatchData).map((roiKey, roiIndex) => {
    const roiMatrix = processedPatchData[roiKey].matrix;

    // For finding the max columns in one row
    const columnsPerRow = Math.max(...roiMatrix.map((a) => a.length));

    // For finding the rows
    const numRowsInSVG = roiMatrix.length;

    const minSpace = 0;

    const svgWidth = maxDimensions.columnsPerRow * 45;
    const svgHeight = maxDimensions.numRowsInSVG * 45;

    const totalAvailableWidth = svgWidth - (columnsPerRow * 45);
    const totalAvailableHeight = svgHeight - (numRowsInSVG * 45);

    let horizontalSpacing, verticalSpacing;

    if (columnsPerRow > 1) {
      horizontalSpacing = Math.max(minSpace, totalAvailableWidth / (columnsPerRow - 1));
    } else {
      horizontalSpacing = 0;
    }

    if (numRowsInSVG > 1) {
      verticalSpacing = Math.max(minSpace, totalAvailableHeight / (numRowsInSVG - 1));
    } else {
      verticalSpacing = 0;
    }

    const totalMatrixWidth = (columnsPerRow - 1) * horizontalSpacing + columnsPerRow * 45;
    const totalMatrixHeight = (numRowsInSVG - 1) * verticalSpacing + numRowsInSVG * 45;

    const xOffset = (svgWidth - totalMatrixWidth) / 2;
    const yOffset = (svgHeight - totalMatrixHeight) / 2;

    const setBorderColorOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;
    // console.log(Number(roiKey), electrodeColorList[Number(roiKey)])
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
          border: isNaN(Number(roiKey)) ?
            `3px solid ${setBorderColorOpacity(electrodeColorList[regions.indexOf(roiKey)], 0.5)}` :
            `3px solid ${setBorderColorOpacity(electrodeColorList[parseInt(roiKey)], 0.5)}`,
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
            return rowArray.map((electrodeObj, columnIndex) => {
              if (electrodeObj === null) {
                return null;
              }

              const electrodeId = Object.keys(electrodeObj)[0];
              const electrodePropagation = samplePropagationData.find(
                (e) => e.electrode_id === Number(electrodeId)
              );

              const propagationCounts = electrodePropagation
                ? electrodePropagation
                : { electrode_id: Number(electrodeId), propagation: 0, nonPropagation: 0, sourceCount: 0, targetCount: 0 };

              const circleRadius = dynamicCircleRadius(propagationCounts.propagation + propagationCounts.nonPropagation);

              // adjust each electrode x and y position
              const cx = xOffset + columnIndex * (45 + horizontalSpacing) + 23;
              const cy = yOffset + rowIndex * (45 + verticalSpacing) + 20;

              // dynamic Bézier curve keypoint
              const dynamicLength = 2 * circleRadius * propagation_lineScale(propagationCounts.nonPropagation)
              const points = CircularCurve(cx, cy, circleRadius, dynamicLength);

              return (
                <g key={`${roiKey}-${rowIndex}-${columnIndex}`}>
                  <g
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        electrodeId,
                        propagationCounts,
                        e
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* propagation and nonPropagation exist */}
                    {propagationCounts.propagation && propagationCounts.nonPropagation && (
                      <>
                        <path d={`M ${points.propagationStartPositionX} ${points.propagationStartPositionY} 
                              Q ${points.propagationKeyPositionX} ${points.propagationKeyPositionY} ${points.propagationEndPositionX} ${points.propagationEndPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.propagationStartPositionX} ${points.propagationStartPositionY} 
                              Z`}
                          fill="#8073ac">
                        </path>

                        {dynamicLength < 2 * circleRadius ? (
                          <path d={`M ${points.propagationStartPositionX} ${points.propagationStartPositionY} 
                              A ${circleRadius} ${circleRadius} 0 1 1 ${points.propagationEndPositionX} ${points.propagationEndPositionY} 
                              Q ${points.propagationKeyPositionX} ${points.propagationKeyPositionY} ${points.propagationStartPositionX} ${points.propagationStartPositionY} 
                              Z`}
                            fill="#fdb863">
                          </path>) : (
                          <path d={`M ${points.propagationStartPositionX} ${points.propagationStartPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.propagationEndPositionX} ${points.propagationEndPositionY} 
                              Q ${points.propagationKeyPositionX} ${points.propagationKeyPositionY} ${points.propagationStartPositionX} ${points.propagationStartPositionY} 
                              Z`}
                            fill="#fdb863">
                          </path>
                        )}
                      </>
                    )}

                    {/* if only have nonPropagation counts exist */}
                    {propagationCounts.propagation === 0 && propagationCounts.nonPropagation && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={circleRadius}
                        fill="#8073ac"
                      >
                      </circle>
                    )}

                    {/* if only propagation counts exist */}
                    {propagationCounts.propagation && propagationCounts.nonPropagation === 0 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={circleRadius}
                        fill="#fdb863"
                      >
                      </circle>
                    )}

                    {/* if nothing exist */}
                    {propagationCounts.propagation === 0 && propagationCounts.nonPropagation === 0 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={circleRadius}
                        fill="#A9A9A9"
                      >
                      </circle>
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
  const circleRadius = 18;


  const legendCirclePoints = CircularCurve(xCenter, yCenter, circleRadius, circleRadius);

  const circleLegend = (
    <g ref={circleGRef}>
      {/* legend non propagation area */}
      <path d={`M ${legendCirclePoints.propagationStartPositionX} ${legendCirclePoints.propagationStartPositionY} 
                Q ${legendCirclePoints.propagationKeyPositionX} ${legendCirclePoints.propagationKeyPositionY} ${legendCirclePoints.propagationEndPositionX} ${legendCirclePoints.propagationEndPositionY} 
                A ${circleRadius} ${circleRadius} 0 0 1 ${legendCirclePoints.propagationStartPositionX} ${legendCirclePoints.propagationStartPositionY} 
                Z`}
        fill="#8073ac"
        stroke="black"
        transform="translate(-1.5,1.5)"
        strokeWidth={0.5}
      >
      </path>

      {/* legend propagation area */}
      <path d={`M ${legendCirclePoints.propagationStartPositionX} ${legendCirclePoints.propagationStartPositionY} 
                A ${circleRadius} ${circleRadius} 0 1 1 ${legendCirclePoints.propagationEndPositionX} ${legendCirclePoints.propagationEndPositionY} 
                Q ${legendCirclePoints.propagationKeyPositionX} ${legendCirclePoints.propagationKeyPositionY} ${legendCirclePoints.propagationStartPositionX} ${legendCirclePoints.propagationStartPositionY} 
                Z`}
        fill="#fdb863"
        stroke="black"
        transform="translate(1.5, -1.5)"
        strokeWidth={0.5}
      >
      </path>

      {/* non propagation area line */}
      <line
        x1={(legendCirclePoints.propagationStartPositionX + legendCirclePoints.propagationEndPositionX) / 2}
        x2={(legendCirclePoints.propagationStartPositionX + legendCirclePoints.propagationEndPositionX) / 2 - 50}
        y1={(legendCirclePoints.propagationStartPositionY + legendCirclePoints.propagationEndPositionY) / 2}
        y2={(legendCirclePoints.propagationStartPositionY + legendCirclePoints.propagationEndPositionY) / 2}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* propagation area line */}
      <line
        x1={(legendCirclePoints.propagationStartPositionX + legendCirclePoints.propagationEndPositionX) / 2 + 10}
        x2={(legendCirclePoints.propagationStartPositionX + legendCirclePoints.propagationEndPositionX) / 2 + 50}
        y1={(legendCirclePoints.propagationStartPositionY + legendCirclePoints.propagationEndPositionY) / 2 - 11}
        y2={(legendCirclePoints.propagationStartPositionY + legendCirclePoints.propagationEndPositionY) / 2 - 11}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />

      {/* non propagation area */}
      <text
        x={(legendCirclePoints.propagationStartPositionX + legendCirclePoints.propagationEndPositionX) / 2 - 100}
        y={(legendCirclePoints.propagationStartPositionY + legendCirclePoints.propagationEndPositionX) / 2}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Non Propagation
      </text>

      {/* propagation area text */}
      <text
        x={(legendCirclePoints.propagationStartPositionX + legendCirclePoints.propagationEndPositionX) / 2 + 40}
        y={(legendCirclePoints.propagationStartPositionY + legendCirclePoints.propagationEndPositionX) / 2 - 10}
        fontSize={10}
        alignmentBaseline="middle"
      >
        Propagation
      </text>
    </g>
  )

  const minCircleLegendRadius = dynamicCircleRadius(minSpikesSum) - 4
  const maxCircleLegendRadius = dynamicCircleRadius(maxSpikesSum) - 8

  const sizeLegend = (
    <g ref={frequencyGRef}>
      <circle cx={xCenter} cy={yCenter + maxCircleLegendRadius - minCircleLegendRadius} r={minCircleLegendRadius} fill="none" stroke="black" strokeWidth={0.5}></circle>
      <line
        x1={xCenter}
        x2={xCenter + maxCircleLegendRadius + 30}
        y1={yCenter + maxCircleLegendRadius - 2 * minCircleLegendRadius}
        y2={yCenter + maxCircleLegendRadius - 2 * minCircleLegendRadius}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />
      <text
        x={xCenter + maxCircleLegendRadius + 30}
        y={yCenter + maxCircleLegendRadius - 2 * minCircleLegendRadius}
        fontSize={10}
        alignmentBaseline="middle"
      >
        {minSpikesSum}
      </text>
      <circle cx={xCenter} cy={yCenter} r={maxCircleLegendRadius} fill="none" stroke="black" strokeWidth={0.5}></circle>
      <line
        x1={xCenter}
        x2={xCenter + maxCircleLegendRadius + 30}
        y1={yCenter - maxCircleLegendRadius}
        y2={yCenter - maxCircleLegendRadius}
        stroke="black"
        strokeWidth={1}
        strokeDasharray={"1,1"}
      />
      <text
        x={xCenter + maxCircleLegendRadius + 30}
        y={yCenter - maxCircleLegendRadius}
        fontSize={10}
        alignmentBaseline="middle"
      >
        {maxSpikesSum}
      </text>
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
            <Col md="4" className="summary">Patch Summary</Col>
            <Col md="8" className="summary">
              <svg ref={frequencySvgRef} width="50%" height="100%" overflow="visible">
                {sizeLegend}
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
              width: 200,
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
