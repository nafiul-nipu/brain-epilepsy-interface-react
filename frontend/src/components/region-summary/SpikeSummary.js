import React from "react";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Switch } from 'antd';
import "./PatchSummary.css";

export const SpikeSummary = ({
    patchData,
    regionData,
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



    // frequency legend svg and g ref
    const frequencySvgRef = useRef(null);
    const frequencyGRef = useRef(null);

    const [tooltip, setTooltip] = useState({
        visible: false,
        content: "",
        x: 0,
        y: 0,
    });
    const [isSwitchChecked, setIsSwitchChecked] = useState(true);
    const [patchRegionToggle, setPatchRegionToggle] = useState("Patch");
    
    // dynamic move circle legend in the center of svg vertically
    useEffect(() => {
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

        if (frequencySvgRef.current) {
            frequencyObserver.observe(frequencySvgRef.current);
        }

        return () => {
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
            content: `Electrode ID: ${electrodeId}\n Frequency: ${electrodeValue}\n Onset\u00A0counts: ${propagationCounts.source_counts}\n Spread\u00A0counts: ${propagationCounts.target_counts}`,
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

    const changePatchRegion = (event) => {
        setPatchRegionToggle(event.target.value)
    }
    // getting each electrode frequency
    const processedPatchData = {};
    const toggleData = patchRegionToggle === "Patch" ? patchData : regionData;
    for (const key in toggleData) {
        if (toggleData.hasOwnProperty(key)) {
            const matrix = toggleData[key].matrix;
            processedPatchData[key] = {
                ...toggleData[key],
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

    // switch to show onset or spread
    const onChangePatchSummary = (checked) => {
        setIsSwitchChecked(checked);
    };

    // max and min ratio(target counts / source counts) for each electrode
    const minTargetRatio = Math.min(...ratios);
    const maxTargetRatio = Math.max(...ratios);

    const source_target_lineScale = d3.scaleLog().domain([minTargetRatio, maxTargetRatio]).range([0.7, 1.3]);
    const frequency_lineScale = d3.scaleLinear().domain([0, maxOccurrence - minSum]).range([0, 1]);

    const dynamicCircleRadius = isSwitchChecked ? d3.scaleLinear().domain([minSource, maxSource]).range([2, 20]) : d3.scaleLinear().domain([minTarget, maxTarget]).range([2, 20]);

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
                            const countForRadius = isSwitchChecked ? propagationCounts.target_counts : propagationCounts.source_counts;
                            const circleRadius = dynamicCircleRadius(countForRadius);

                            // adjust each electrode x and y position
                            const cx = xOffset + columnIndex * (45 + horizontalSpacing) + 23;
                            const cy = yOffset + rowIndex * (45 + verticalSpacing) + 20;

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
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={circleRadius}
                                            fill={electrodeColorList[roiIndex]}
                                        >
                                        </circle>
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

    // Biswajit graph 4A Onset and Spread legend
    const minCircleLegendRadius = isSwitchChecked ? dynamicCircleRadius(minTarget) : dynamicCircleRadius(minSource);
    const maxCircleLegendRadius = isSwitchChecked ? dynamicCircleRadius(maxTarget) - 5 : dynamicCircleRadius(maxSource) - 5;

    const sizeLegend = (
        <g ref={frequencyGRef}>
            <text
                x={xCenter - 65}
                y={yCenter}
                fontSize={12}
                alignmentBaseline="middle"
            >
                {isSwitchChecked ? "Onset :" : "Spread :"}
            </text>
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
                {isSwitchChecked ? maxSource : maxTarget}
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
                        <Col md="5" className="summary">Patch Summary
                            <Switch style={{ marginLeft: 20, backgroundColor: isSwitchChecked ? '#007ed3' : '#2ca25f' }} checkedChildren="Onset" unCheckedChildren="Spread" onChange={onChangePatchSummary} defaultChecked />
                            <select id="percent" style={{marginLeft: 20}} value={patchRegionToggle} onChange={changePatchRegion}>
                                <option value="Patch"> Patch </option>
                                <option value="Region"> Region </option>
                            </select>
                        </Col>
                        <Col md="7" className="summary">
                            <svg ref={frequencySvgRef} width="100%" height="100%" overflow="visible">
                                {sizeLegend}
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