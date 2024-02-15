import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import * as d3 from "d3";
import "./PatchSummary.css";

export const PatchSummary = ({
  patchData,
  eventData,
  selectedRoi,
  setSelectedRoi,
  roiCount,
  samplePropagationData,
}) => {
  const electrodeColorList = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#bfa3a3",
    "#00A5E3",
    "#8DD7BF",
    "#FF96C5",
  ];

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
      x: e.clientX - 150,
      y: e.clientY + 50,
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

  // max frequency number for each electrode
  const maxOccurrence = findMaxInObject(processedPatchData);

  // max ratio(target counts / total counts) for each electrode
  const maxTargetRatio = Math.max(...samplePropagationData
    .filter(item => item.source_counts !== 0 && item.target_counts !== 0)
    .map(item => item.target_counts / (item.target_counts + item.source_counts)));

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

    const colorIndex = roiIndex % electrodeColorList.length;
    const fillColor = electrodeColorList[colorIndex];
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

              const source_target_lineScale = d3.scaleLinear().domain([0, maxTargetRatio]).range([8, circleRadius]);
              const frequency_opacityScale = d3.scaleLinear().domain([0, maxOccurrence]).range([0.3, 1]);
              const electrodeFrequencyOpacity = frequency_opacityScale(electrodeValue);


              // frequency arc(fixed arc) start and end position x and y
              const frequencyAngle = 180;
              const frequencyStartPositionX = cx + circleRadius * Math.cos(frequencyAngle * Math.PI / 180);
              const frequencyStartPositionY = cy - circleRadius * Math.sin(frequencyAngle * Math.PI / 180);
              const frequencyEndPositionX = cx;
              const frequencyEndPositionY = cy + circleRadius;

              // target and source(dynamtic arc) start, end, and Bézier curve keypoint
              const dynamicLength = source_target_lineScale(propagationCounts.target_counts / (propagationCounts.target_counts + propagationCounts.source_counts))
              
              // target and source arc Bézier curve keypoint
              const target_source_keyPositionX = cx + dynamicLength * Math.cos(45 * Math.PI / 180);
              const target_source_keyPositionY = cy - dynamicLength * Math.sin(45 * Math.PI / 180);

              const target_source_endPositionX = target_source_keyPositionX
              const target_source_endPositionY = cy + Math.sqrt(Math.pow(circleRadius, 2) - Math.pow(dynamicLength * Math.cos(45 * Math.PI / 180), 2))

              const target_source_startPositionX = cx - Math.sqrt(Math.pow(circleRadius, 2) - Math.pow(dynamicLength * Math.cos(45 * Math.PI / 180), 2))
              const target_source_startPositionY = cy - dynamicLength * Math.sin(45 * Math.PI / 180);


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
                    <path d={`M ${frequencyStartPositionX} ${frequencyStartPositionY} 
                              Q ${cx} ${cy} ${frequencyEndPositionX} ${frequencyEndPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${frequencyStartPositionX} ${frequencyStartPositionY} 
                              Z`}
                      fill={fillColor}
                      opacity={electrodeFrequencyOpacity}></path>
                    {/* source counts and target counts both exist */}
                    {propagationCounts.source_counts && propagationCounts.target_counts && (
                      <>
                        <path d={`M ${target_source_startPositionX} ${target_source_startPositionY} 
                              Q ${target_source_keyPositionX} ${target_source_keyPositionY} ${target_source_endPositionX} ${target_source_endPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${frequencyEndPositionX} ${frequencyEndPositionY} 
                              Q ${cx} ${cy} ${frequencyStartPositionX} ${frequencyStartPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${target_source_startPositionX} ${target_source_startPositionY}
                              Z`}
                          fill="#762a83">
                        </path>
                        <path d={`M ${target_source_startPositionX} ${target_source_startPositionY} 
                            A ${circleRadius} ${circleRadius} 0 1 1 ${target_source_endPositionX} ${target_source_endPositionY} 
                            Q ${target_source_keyPositionX} ${target_source_keyPositionY} ${target_source_startPositionX} ${target_source_startPositionY} 
                            Z`}
                          fill="#fee090">
                        </path>
                      </>
                    )}
                    {/* if only have target counts */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts && (
                      <path d={`M ${frequencyStartPositionX} ${frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${frequencyEndPositionX} ${frequencyEndPositionY} 
                                Q ${cx} ${cy} ${frequencyStartPositionX} ${frequencyStartPositionY} 
                                Z`}
                        fill="#fee090"></path>
                    )}
                    {/* if only have source counts */}
                    {propagationCounts.source_counts && propagationCounts.target_counts === 0 && (
                      <path d={`M ${frequencyStartPositionX} ${frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${frequencyEndPositionX} ${frequencyEndPositionY} 
                                Q ${cx} ${cy} ${frequencyStartPositionX} ${frequencyStartPositionY} 
                                Z`}
                        fill="#762a83"></path>
                    )}
                    {/* if both counts both not exist */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts === 0 && (
                      <path d={`M ${frequencyStartPositionX} ${frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${frequencyEndPositionX} ${frequencyEndPositionY} 
                                Q ${cx} ${cy} ${frequencyStartPositionX} ${frequencyStartPositionY} 
                                Z`}
                        fill="#C0C0C0"></path>
                    )}

                    {/* <path d={`M ${target_source_startPositionX} ${target_source_startPositionY} 
                            A ${circleRadius} ${circleRadius} 0 1 1 ${target_source_endPositionX} ${target_source_endPositionY} 
                            Q ${target_source_keyPositionX} ${target_source_keyPositionY} ${target_source_startPositionX} ${target_source_startPositionY} 
                            Z`}
                      fill="#fee090"></path> */}
                  </g>
                </g>
              );
            });
          })}
        </svg>
      </Col>
    );
  });

  // const customTicks = [0, maxOccurrence];
  // const tickList = circleRadius.ticks().concat(customTicks);
  // const ticks = [tickList[0], tickList[tickList.length - 1]];
  // const maxValue = ticks[ticks.length - 1];
  // const dimension = circleRadius(maxValue) * 2;
  // const DASH_WIDTH = 50;

  // const circleLegend = ticks.map((tick, i) => {
  //   const xCenter = dimension;
  //   const yCircleTop = dimension - 2 * circleRadius(tick);
  //   const yCircleCenter = dimension - circleRadius(tick);

  //   return (
  //     <g key={i}>
  //       <circle
  //         cx={xCenter}
  //         cy={yCircleCenter}
  //         r={circleRadius(tick)}
  //         fill="none"
  //         stroke="black"
  //       />
  //       <line
  //         x1={xCenter}
  //         x2={xCenter + DASH_WIDTH}
  //         y1={yCircleTop}
  //         y2={yCircleTop}
  //         stroke="black"
  //         strokeDasharray={"2,2"}
  //       />
  //       <text
  //         x={xCenter + DASH_WIDTH + 4}
  //         y={yCircleTop}
  //         fontSize={10}
  //         alignmentBaseline="middle"
  //       >
  //         {tick}
  //       </text>
  //     </g>
  //   );
  // });

  return (
    <Col
      md="12"
      className="patchSummaryContainer"
      style={{ height: "89.5vh", backgroundColor: "#FAFBFC" }}
    >
      <Row>
        <Col md="12" style={{ height: "4vh" }}>
          <Row style={{ height: "100%", margin: 0 }}>
            <Col className="summary">Patch Summary</Col>
            {/* <Col className="summary">
              <svg width="100%" height="100%" overflow="visible">
                <text
                  x={dimension - 80}
                  y={10}
                  fontSize={11}
                  alignmentBaseline="middle"
                >
                  Frequency:
                </text>
                {circleLegend}
                <g>
                  <rect
                    x={dimension + 100}
                    y={0}
                    fill="#fee090"
                    width={10}
                    height={10}
                  />
                  <text
                    x={dimension + 120}
                    y={5}
                    fontSize={10}
                    alignmentBaseline="middle"
                  >
                    Source counts
                  </text>
                  <rect
                    x={dimension + 100}
                    y={15}
                    fill="#762a83"
                    width={10}
                    height={10}
                  />
                  <text
                    x={dimension + 120}
                    y={20}
                    fontSize={10}
                    alignmentBaseline="middle"
                  >
                    Target counts
                  </text>
                </g>
              </svg>
            </Col> */}
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
