import React from "react";

export const AxisLeft = ({ xScale, yScale, scaleOffset }) => {
    // console.log(xScale, yScale, scaleOffset)
    const [xStart,] = xScale.range();
    const [yStart, yEnd] = yScale.range();
    const ticks = yScale.ticks();
    // console.log(ticks)
    return (
        <>
            <line className={'axisLine'} x1={xStart} x2={xStart} y1={yEnd} y2={yStart} />
            <g className="ticks">
                {ticks.map((t, i) => {
                    // console.log(t)
                    const y = yScale(t);
                    return (
                        <React.Fragment key={i}>
                            <line x1={xStart} x2={xStart - scaleOffset} y1={y} y2={y} />
                            <text
                                x={xStart - scaleOffset * 4}
                                y={y + scaleOffset * 1.25}
                            >
                                {t}
                            </text>
                        </React.Fragment>
                    );
                })}
            </g>
        </>
    );
};