import React from "react";

export const AxisBottom = ({ xScale, yScale, scaleOffset, innerHeight }) => {
    const [xStart, xEnd] = xScale.range();
    const [, yEnd] = yScale.range();
    const ticks = xScale.ticks();
    return (
        <g>
            <line className='axisLine' x1={xStart} x2={xEnd} y1={yEnd} y2={yEnd} />
            <g className="ticks">
                {ticks.map((t, i) => {
                    if(i % 3 === 0){
                        const x = xScale(t);
                        return (
                            <React.Fragment key={i}>
                                <line x1={x} x2={x} y1={yEnd} y2={yEnd + scaleOffset} />
                                <text
                                    x={x}
                                    y={yEnd + scaleOffset * 5}
                                >
                                    {t}
                                </text>
                            </React.Fragment>
                        );                        
                    }
                })}
            </g>
        </g>
    );
};