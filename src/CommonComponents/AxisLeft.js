export const AxisLeft = ({ yScale }) => yScale.domain().map(tickeValue => (
    <g className='tick' key={tickeValue}>
        <text
            key={tickeValue}
            // y={yScale(tickeValue) + yScale.bandwidth() / 2}
            style={{ textAnchor: 'end' }}
            // x={-3}
            dy={'0.32em'}
            transform={`translate(-3, ${yScale(tickeValue) + yScale.bandwidth() / 2})`}
        >{`E${tickeValue}`}</text>
    </g>
));