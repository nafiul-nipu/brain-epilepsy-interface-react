import '../App.css';
export const AxisBottom = ({ xScale, innerHeight }) => xScale.ticks().map(tickeValue => (
    <g className="tick" key={tickeValue} transform={`translate(${xScale(tickeValue)},0)`}>
        <line
            y2={innerHeight}
        />
        <text
            y={innerHeight + 5}
            dy={"0.71em"}
            style={{ textAnchor: 'middle' }}
        >{tickeValue}</text>
    </g>
));