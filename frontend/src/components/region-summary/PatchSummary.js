import React from "react";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Switch } from 'antd';
import "./PatchSummary.css";

export const PatchSummary = ({
  patchData,
  eventData,
  selectedRoi,
  setSelectedRoi,
  samplePropagationData,
}) => {

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

  const [isSwitchChecked, setIsSwitchChecked] = useState(true);

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
  const CircularCurve = (cx, cy, radius, dynamicfrequencyLength, dynamicLength) => {
    const frequencyKeyPositionX = cx - (radius - dynamicfrequencyLength) * Math.cos(45 * Math.PI / 180);
    const frequencyKeyPositionY = cy + (radius - dynamicfrequencyLength) * Math.sin(45 * Math.PI / 180);

    const frequencyEndPositionX = frequencyKeyPositionX;
    const frequencyEndPositionY = cy + Math.sqrt(Math.pow(radius, 2) - Math.pow((radius - dynamicfrequencyLength) * Math.cos(45 * Math.PI / 180), 2));

    const frequencyStartPositionX = cx - Math.sqrt(Math.pow(radius, 2) - Math.pow((radius - dynamicfrequencyLength) * Math.sin(45 * Math.PI / 180), 2));
    const frequencyStartPositionY = frequencyKeyPositionY;


    // target and source arc Bézier curve keypoint
    const target_source_keyPositionX = cx + Math.round(dynamicLength * Math.cos(45 * Math.PI / 180));
    const target_source_keyPositionY = cy - Math.round(dynamicLength * Math.sin(45 * Math.PI / 180));

    const target_source_endPositionX = target_source_keyPositionX;
    const target_source_endPositionY = cy + Math.sqrt(Math.pow(radius, 2) - Math.pow(Math.round(dynamicLength * Math.cos(45 * Math.PI / 180)), 2));

    const target_source_startPositionX = cx - Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(Math.round(dynamicLength * Math.cos(45 * Math.PI / 180)), 2)));
    const target_source_startPositionY = cy - Math.round(dynamicLength * Math.sin(45 * Math.PI / 180));

    return { frequencyStartPositionX, frequencyStartPositionY, frequencyEndPositionX, frequencyEndPositionY, frequencyKeyPositionX, frequencyKeyPositionY, target_source_keyPositionX, target_source_keyPositionY, target_source_endPositionX, target_source_endPositionY, target_source_startPositionX, target_source_startPositionY }
  }

  // find the max frequency number in electrodes
  const maxOccurrence = findMaxInObject(processedPatchData);

  const ratios = samplePropagationData
    .filter(item => item.source_counts !== 0 && item.target_counts !== 0)
    .map(item => item.target_counts / item.source_counts);

  const minSum = samplePropagationData
    .filter(item => item.source_counts !== 0 && item.target_counts !== 0)
    .map(item => item.source_counts + item.target_counts)
    .reduce((min, current) => Math.min(min, current), Infinity);

  const initialMinMax = { minSource: Infinity, maxSource: -Infinity, minTarget: Infinity, maxTarget: -Infinity };

  const { minSource, maxSource, minTarget, maxTarget } = samplePropagationData.reduce((acc, item) => {
    return {
      minSource: Math.min(acc.minSource, item.source_counts),
      maxSource: Math.max(acc.maxSource, item.source_counts),
      minTarget: Math.min(acc.minTarget, item.target_counts),
      maxTarget: Math.max(acc.maxTarget, item.target_counts),
    };
  }, initialMinMax);
  console.log(minSource, maxSource, minTarget, maxTarget);
  // switch to show onset or spread
  const onChangePatchSummary = (checked) => {
    setIsSwitchChecked(checked);
  };

  // max and min ratio(target counts / source counts) for each electrode
  const minTargetRatio = Math.min(...ratios);
  const maxTargetRatio = Math.max(...ratios);

  const source_target_lineScale = d3.scaleLog().domain([minTargetRatio, maxTargetRatio]).range([0.7, 1.3]);
  const frequency_lineScale = d3.scaleLinear().domain([0, maxOccurrence - minSum]).range([0, 1]);

  const circleRadius = 18;
  const dynamicCircleRadius = d3.scaleLinear().domain([0, maxOccurrence]).range([12, 20]);

  // biswajit graph 4A Onset and Spread
  // const dynamicCircleRadius = isSwitchChecked ? d3.scaleLinear().domain([0, maxTarget]).range([2, 20]) : d3.scaleLinear().domain([0, maxSource]).range([2, 20]);

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

    // Update maxima in the object if current values are higher
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

    const fillColor = electrodeColorList[0];

    const setBorderColorOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;
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
          border: `3px solid ${setBorderColorOpacity(electrodeColorList[roiIndex], 0.5)}`,
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
                : { electrode_id: Number(electrodeId), source_counts: 0, target_counts: 0 };

              const electrodeValue = electrodeObj[electrodeId];

              const circleRadius = dynamicCircleRadius(electrodeValue);

              //Biswajit graph 4A Onset and Spread
              // const countForRadius = isSwitchChecked ? propagationCounts.target_counts : propagationCounts.source_counts;
              // const circleRadius = dynamicCircleRadius(countForRadius);

              // adjust each electrode x and y position
              const cx = xOffset + columnIndex * (45 + horizontalSpacing) + 23;
              const cy = yOffset + rowIndex * (45 + verticalSpacing) + 20;

              // frequency and dynamic Bézier curve keypoint
              const dynamicLength = circleRadius * source_target_lineScale(propagationCounts.target_counts / propagationCounts.source_counts)
              // const frequencyLength = circleRadius * frequency_lineScale(electrodeValue - propagationCounts.target_counts - propagationCounts.source_counts);
              const frequencyLength = electrodeValue - propagationCounts.target_counts - propagationCounts.source_counts > 0 ? 2 * circleRadius * frequency_lineScale(electrodeValue - propagationCounts.target_counts - propagationCounts.source_counts) : 0;
              const points = CircularCurve(cx, cy, circleRadius, frequencyLength, dynamicLength);

              return (
                // <g key={`${roiKey}-${rowIndex}-${columnIndex}`}>
                //   <g
                //     onMouseEnter={(e) =>
                //       handleMouseEnter(
                //         electrodeId,
                //         electrodeValue,
                //         propagationCounts,
                //         e
                //       )
                //     }
                //     onMouseLeave={handleMouseLeave}
                //   >
                //     <circle
                //       cx={cx}
                //       cy={cy}
                //       r={circleRadius}
                //       fill={electrodeColorList[roiIndex]}
                //     >
                //     </circle>
                //   </g>
                // </g>

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
                    {/* source counts, target counts, frequency exist */}
                    {propagationCounts.source_counts && propagationCounts.target_counts && frequencyLength > 0 && (
                      <>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              Q ${points.frequencyKeyPositionX} ${points.frequencyKeyPositionY} ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              Z`}
                          fill={fillColor}>
                        </path>
                        <path d={`M ${points.target_source_startPositionX} ${points.target_source_startPositionY} 
                              Q ${points.target_source_keyPositionX} ${points.target_source_keyPositionY} ${points.target_source_endPositionX} ${points.target_source_endPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                              Q ${points.frequencyKeyPositionX} ${points.frequencyKeyPositionY} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
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

                    {/* if only have target counts and frequency exist */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts && frequencyLength > 0 && (
                      <>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              Q ${points.frequencyKeyPositionX} ${points.frequencyKeyPositionY} ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                              A ${circleRadius} ${circleRadius} 0 0 1 ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                              Z`}
                          fill={fillColor}>
                        </path>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${points.frequencyKeyPositionX} ${points.frequencyKeyPositionY} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                          fill="#fdb863"></path>
                      </>

                    )}

                    {/* if only have source counts and frequency exist */}
                    {propagationCounts.source_counts && propagationCounts.target_counts === 0 && frequencyLength > 0 && (
                      <>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${points.frequencyKeyPositionX} ${points.frequencyKeyPositionY} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                          fill="#fdb863"></path>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${points.frequencyKeyPositionX} ${points.frequencyKeyPositionY} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                          fill="#8073ac"></path>
                      </>

                    )}

                    {/* if both counts both not exist but frequency exist */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts === 0 && frequencyLength > 0 && (
                      <>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${cx} ${cy} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                          fill="#fdb863"></path>
                        <path d={`M ${points.frequencyStartPositionX} ${points.frequencyStartPositionY}
                                A ${circleRadius} ${circleRadius} 0 1 1 ${points.frequencyEndPositionX} ${points.frequencyEndPositionY} 
                                Q ${cx} ${cy} ${points.frequencyStartPositionX} ${points.frequencyStartPositionY} 
                                Z`}
                          fill="#A9A9A9"></path>
                      </>
                    )}

                    {/* source counts, target counts, frequency not exist */}
                    {propagationCounts.source_counts && propagationCounts.target_counts && frequencyLength === 0 && (
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

                    {/* if only have target counts and frequency not exist */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts && frequencyLength === 0 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={circleRadius}
                        fill="#fdb863"
                      >
                      </circle>
                    )}

                    {/* if only have source counts and frequency not exist */}
                    {propagationCounts.source_counts && propagationCounts.target_counts === 0 && frequencyLength === 0 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={circleRadius}
                        fill="#8073ac"
                      >
                      </circle>
                    )}

                    {/* if nothing exist */}
                    {propagationCounts.source_counts === 0 && propagationCounts.target_counts === 0 && frequencyLength === 0 && (
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

  const max_legendDynamicLength = circleRadius * source_target_lineScale(maxTargetRatio);
  const min_legendDynamicLength = circleRadius * source_target_lineScale(minTargetRatio);

  const legendMaxPoints = CircularCurve(xCenter, yCenter, circleRadius, 20, max_legendDynamicLength);
  const legendMinPoints = CircularCurve(xCenter, yCenter, circleRadius, 20, min_legendDynamicLength);

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

  const minCircleLegendRadius = 8
  const maxCircleLegendRadius = 15

  // Biswajit graph 4A Onset and Spread legend
  // const minCircleLegendRadius = isSwitchChecked ? dynamicCircleRadius(minTarget) : dynamicCircleRadius(minSource);
  // const maxCircleLegendRadius = isSwitchChecked ? dynamicCircleRadius(maxTarget) : dynamicCircleRadius(maxSource);

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
        0
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
        {maxOccurrence}
        {/* {isSwitchChecked ? maxTarget : maxSource} */}
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
            {/* <Col md="4" className="summary">Patch Summary<Switch style={{ marginLeft: 20, backgroundColor: isSwitchChecked ? '#007ed3' : '#2ca25f' }} checkedChildren="Onset" unCheckedChildren="Spread" onChange={onChangePatchSummary} defaultChecked /></Col> */}
            <Col md="4" className="summary">Patch Summary</Col>
            <Col md="8" className="summary">
              <svg ref={frequencySvgRef} width="50%" height="100%" overflow="visible">
                {/* {frequencyLegend} */}
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
