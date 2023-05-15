import React from "react";

export const AxisBottom = ({ xScale, yScale, scaleOffset, innerHeight, textPosition, ticks = xScale.ticks(), tickText = null }) => {
    const [xStart, xEnd] = xScale.range();
    const [, yEnd] = yScale.range();
    // const ticks = xScale.ticks();
    return (
        <g transform={`translate(0, ${innerHeight})`}>
            <line className='axisLine' x1={xStart} x2={xEnd} y1={yEnd} y2={yEnd} />
            <g className="ticks">
                {ticks.map((t, i) => {
                    const x = xScale(t);
                    return (
                        <React.Fragment key={i}>
                            <line x1={x} x2={x} y1={yEnd} y2={yEnd + scaleOffset} />
                            <text
                                x={x}
                                y={yEnd + scaleOffset * textPosition}
                            >
                                {tickText ? tickText[i] : t}
                            </text>
                        </React.Fragment>
                    );
                })}
            </g>
        </g>
    );
};