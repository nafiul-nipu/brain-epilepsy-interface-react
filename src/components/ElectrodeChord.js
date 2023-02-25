import ChordDiagram from 'react-chord-diagram'

// const matrix = [
//     [11975, 5871, 8916, 2868],
//     [1951, 10048, 2060, 6171],
//     [8010, 16145, 8090, 8045],
//     [1013, 990, 940, 6907]
// ];

const matrix = [[0, 2, 0, 0, 0],
[2, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
];
export const ElectrodeChord = () => {
    return (
        <ChordDiagram
            matrix={matrix}
            componentId={1}
            width={(window.innerWidth / 3) - 10}
            height={window.innerHeight / 2 - 10}
            style={{ font: '10px sans-serif' }}
            groupLabels={[49, 50, 51, 52, 53]}
            groupColors={["#000000", "#FFDD89", "#957244", "#F26223"]}
            groupOnClick={(idx) => alert('Clicked group: ' + idx)}
            ribbonOnClick={(idx) => alert('Clicked ribbon: ' + idx)}
            disableRibbonHover={false}
            blurOnHover={true}
            ribbonOpacity={'0.8'}
            ribbonBlurOpacity={'0.2'}
            persistHoverOnClick
        />
    )
}