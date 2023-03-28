// module that has common functions

import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import circle from '../models/disc.png'
import * as d3 from 'd3'
// import networkdata from '../data/electrodes/ep187/ep187_full_network.json'

let width = (window.innerWidth / 3) - 10;
let height = window.innerHeight / 2 - 10;
let angle = 40;
let aspect = width / height;
let near = 1;
let far = 2000;

// creating renderer
export function createRenderer(canvas, autoClear = false) {
    let renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0Xfafbfc, 1);
    renderer.autoClear = autoClear;

    renderer.outputEncoding = THREE.sRGBEncoding;

    return renderer
}

// creating scene
export function createScene() {
    return new THREE.Scene();
}

// creating camera
export function createCamera() {
    let camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
    camera.position.set(-250, -50, -50);
    camera.up.set(0, 0, 1);

    return camera;
}

// create controls
export function createTrackballControls(camera, renderer) {
    let controls = new TrackballControls(camera, renderer.domElement);
    // controls.addEventListener( 'change', render );

    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    return controls;
}

// window resize handler
export function setOnWindowResize(renderer, camera, controls, scenes, clock, mixer) {

    renderer.setSize((window.innerWidth / 2) - 10, window.innerHeight / 2);

    camera.aspect = ((window.innerWidth / 2) - 10) / (window.innerHeight / 2);
    camera.updateProjectionMatrix();

    controls.handleResize();

    render(renderer, scenes, camera, clock, mixer);

}

// render function
export function render(renderer, scenes, camera) {

    if (scenes.length === 2) {
        renderer.clear();
        renderer.render(scenes[0], camera);
        renderer.clearDepth();
        renderer.render(scenes[1], camera);

    } else {
        renderer.render(scenes[0], camera);
    }

}

// return bboxcenter
export function getbbox(obj) {
    console.log("changing box center");
    let objBbox = new THREE.Box3().setFromObject(obj);
    let bboxCenter = objBbox.getCenter(new THREE.Vector3()).clone();
    bboxCenter.multiplyScalar(-1);

    // return [bboxCenter, objBbox];
    // console.log(bboxCenter)
    return bboxCenter;
}

// change material's trancparency, color etc
export function objMaterialManipulation(obj, color, opacity, transparency, bboxCenter) {
    // console.log(obj)
    obj.children.forEach((child) => {

        if (child instanceof THREE.Mesh) {
            child.material.color.setHex(color);
            child.material.opacity = opacity;
            child.material.transparent = transparency;
            // child.material.vertexColors = true;
            // child.geometry.center();
            // child.material.side = THREE.DoubleSide;

            child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
        }
    });

    return obj
}

// create electrodes using point material and sprite
export function populateElectrodes(electrodeData, bboxCenter, sampleData = null, propagation) {
    // console.log(sampleData)
    // console.log(electrodeData)
    let vertices = []
    let colors = []
    const color = new THREE.Color();
    let pointGeometry = new THREE.BufferGeometry();
    // 55,126,184
    if (propagation[0] === 'TopPercentile') {
        // do nothing
        let sortedData = structuredClone(sampleData) //
        sortedData.sort((a, b) => b.frequency - a.frequency);
        let percent = +propagation[1] / 100;

        // console.log(Math.round(sortedData.length * percent))
        let startElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.start))]

        let endElec = [...new Set(sortedData.slice(0, Math.round(sortedData.length * percent)).map(item => item.end))]
        // console.log(sortedData)
        for (let top = 0; top < electrodeData.length; top++) {
            // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
            // console.log(top)
            vertices.push(electrodeData[top].position[0], electrodeData[top].position[1], electrodeData[top].position[2])
            if (startElec.includes(electrodeData[top].electrode_number) && endElec.includes(electrodeData[top].electrode_number)) {
                // both start and end 
                // console.log('both')
                color.setRGB(255 / 255, 255 / 255, 51 / 255);
                colors.push(color.r, color.g, color.b);
            }
            else if (startElec.includes(electrodeData[top].electrode_number)) {
                // start electrodes
                // console.log("start")
                color.setRGB(217 / 255, 95 / 255, 2 / 255);
                // console.log(color.r, color.g, color.b)
                colors.push(color.r, color.g, color.b);
            } else if (endElec.includes(electrodeData[top].electrode_number)) {
                //  end electrodes
                // console.log('ends')
                color.setRGB(27 / 255, 158 / 255, 119 / 255);
                colors.push(color.r, color.g, color.b);
            } else {
                // rest electrodes
                color.setRGB(160 / 255, 160 / 255, 160 / 255);
                colors.push(color.r, color.g, color.b);
            }
        }

        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    } else {
        var result = sampleData.filter(obj => {
            return obj.start === +propagation[1];
        });
        // console.log(result)
        let electrodeList = [...new Set(result.map((item) => item.end))]
        // console.log(electrodeList)
        for (let i = 0; i < electrodeData.length; i++) {
            // vertices.push(electrodeData[i].newPosition[0], electrodeData[i].newPosition[1], electrodeData[i].newPosition[2]);
            vertices.push(electrodeData[i].position[0], electrodeData[i].position[1], electrodeData[i].position[2]);
            if (electrodeData[i].electrode_number === +propagation[1]) {
                // console.log("start")
                color.setRGB(217 / 255, 95 / 255, 2 / 255);
                // console.log(color.r, color.g, color.b)
                colors.push(color.r, color.g, color.b);
            } else if (electrodeList.includes(electrodeData[i].electrode_number)) {
                // console.log('ends')
                color.setRGB(27 / 255, 158 / 255, 119 / 255);
                colors.push(color.r, color.g, color.b);
            } else {
                color.setRGB(160 / 255, 160 / 255, 160 / 255);
                colors.push(color.r, color.g, color.b);
            }
        }

        // let pointGeometry = new THREE.BufferGeometry()
        // pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    }


    const sprite = new THREE.TextureLoader().load(circle);
    const material = new THREE.PointsMaterial({
        size: 10,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        vertexColors: true
    });
    // material.color.setHSL(0.0, 1.0, 0.5);
    const points = new THREE.Points(pointGeometry, material);
    points.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);

    return points
}

// creating brain network using axedhelper
export function createBrainPropagation(sampleData, bboxCenter, propagation) {
    // console.log(sampleData)
    // console.log(propagation)
    const group = new THREE.Group();
    if (propagation[0] === 'TopPercentile') { //top 10%
        // reverse sort - large to small
        let sortedData = structuredClone(sampleData) //
        sortedData.sort((a, b) => b.frequency - a.frequency);
        // console.log(sortedData)
        // plotting top %
        let percent = +propagation[1] / 100;
        // console.log(sortedData.length * percent)
        for (let top = 0; top < Math.round(sortedData.length * percent); top++) {
            let vertices = []
            vertices.push(new THREE.Vector3(sortedData[top].startPosition[0], sortedData[top].startPosition[1], sortedData[top].startPosition[2])); //x, y, z
            vertices.push(new THREE.Vector3(sortedData[top].endPosition[0], sortedData[top].endPosition[1], sortedData[top].endPosition[2]));

            const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

            let material = new THREE.LineBasicMaterial({ color: 0X004D40 });
            let line = new THREE.Line(geometry, material);
            group.add(line);

        }

    } else { // electrode wise
        sampleData.forEach(sample => {
            if (sample.start === +propagation[1]) {
                let vertices = []
                vertices.push(new THREE.Vector3(sample.startPosition[0], sample.startPosition[1], sample.startPosition[2])); //x, y, z
                vertices.push(new THREE.Vector3(sample.endPosition[0], sample.endPosition[1], sample.endPosition[2]));

                const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

                let material = new THREE.LineBasicMaterial({ color: 0X004D40 });
                let line = new THREE.Line(geometry, material);
                group.add(line);

            }
        })

    }

    // console.log(group)
    group.position.set(bboxCenter.x, bboxCenter.y, bboxCenter.z);

    return group;
}


export const ChordContainer = () => {
    let data = Object.assign([
        [.096899, .008859, .000554, .004430, .025471, .024363, .005537, .025471],
        [.001107, .018272, .000000, .004983, .011074, .010520, .002215, .004983],
        [.000554, .002769, .002215, .002215, .003876, .008306, .000554, .003322],
        [.000554, .001107, .000554, .012182, .011628, .006645, .004983, .010520],
        [.002215, .004430, .000000, .002769, .104097, .012182, .004983, .028239],
        [.011628, .026024, .000000, .013843, .087486, .168328, .017165, .055925],
        [.000554, .004983, .000000, .003322, .004430, .008859, .017719, .004430],
        [.002215, .007198, .000000, .003322, .016611, .014950, .001107, .054264]
    ], {
        names: ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
        colors: ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
    })

    const names = data.names === undefined ? d3.range(data.length) : data.names
    const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors

    const chordHeight = 500;
    const chordWidth = 500;
    const outerRadius = Math.min(chordWidth, chordHeight) * 0.5 - 60;
    const innerRadius = outerRadius - 10
    const color = d3.scaleOrdinal(names, colors)
    const ribbon = d3.ribbon()
        .radius(innerRadius - 1)
        .padAngle(1 / innerRadius)

    const chordArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const chord = d3.chord()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)


    const chords = chord(data)

    // console.log(chords.groups)

    return (
        <svg width={chordWidth} height={chordHeight}>
            <g transform={`translate(${chordWidth / 2}, ${chordHeight / 2})`}>
                {chords.groups.map((each) => {
                    // console.log(color(names[each.index]))
                    return (
                        <g key={each.index}>
                            <path
                                fill={color(names[each.index])}
                                d={chordArc(each)}
                            /><title>{`${names[each.index]}
                                ${(each.value)}`}</title>

                            {/* <text
                                    x={8}
                                    dy='0.35em'
                                    fontWeight={'bold'}
                                    textAnchor={'end'}
                                >
                                    ${names[each.index]}
                                </text> */}
                        </g>
                    )
                })}
                {chords.map((each) => {
                    return (
                        <g fillOpacity={0.8} key={each.source.index}>
                            <path
                                style={{ mixBlendMode: 'multiply' }}
                                fill={color(names[each.source.index])}
                                d={ribbon(each)}
                            /><title>{`${(each.source.value)} ${names[each.target.index]} → ${names[each.source.index]}${each.source.index === each.target.index ? ""
                                : `\n${(each.target.value)} ${names[each.source.index]} → ${names[each.target.index]}`}`}</title>
                        </g>
                    )
                })}
            </g>
        </svg>
    )
}


export const MultipleChordContainer = ({ networkdata, rois }) => {

    // const rois = [100, 101, 201, 300, 301, 400, 401, 501]

    // console.log(networkdata)["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]
    // const colorList = ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
    // const colorList = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
    // const colorList = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

    const colorList = ["#a6cee3", "#1f78b4", "#fb9a99", "#e31a1c", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928", "#773344", "#e3b5a4", "#f5e9e2", "#0b0014", "#d44d5c"]
    const height = 350;
    const width = 350;
    const outerRadius = Math.min(width, height) * 0.5 - 60;
    const innerRadius = outerRadius - 10

    const ribbon = d3.ribbonArrow()
        .radius(innerRadius - 1)
        .padAngle(0 / innerRadius)

    const chordArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const chord = d3.chordDirected()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)

    const textPadding = 1.2

    // console.log(chords)
    const base = width / 2
    const hB = height / 2
    // console.log(base, hB)
    /*
    100	R. Frontal Lobe 0 okay
    101	L. Frontal Lobe 1 okay
    201	L. Parietal Lobe 2 okay
    300	R. Temporal Lobe 3 okay
    301	L. Temporal Lobe 4 okay
    400	R. Occipital Lobe 5 okay
    401	L. Occipital Lobe 6 okay
    501	L. Insula 7 okay
*/
    //              0 RFL  1LFL   2LPL    3RTL      4LTL           5ROL       6LOL       7LI
    let x = [base - 200, base, base, base + 250, base + 350, base + 200, base + 350, base + 120]
    //          0       1           2           3           4           5       6       7
    let y = [hB + 250, hB + 100, hB + 550, hB, hB + 250, hB + 700, hB + 500, hB + 350]

    if (rois.length < 4) {
        // x = [base, base + 300, base]
        // //          0       1           2           3           4           5       6       7
        // y = [hB + 100, hB + 150, hB + 450]

        x = [base, base + 300, base]
        y = [hB + 450, hB + 150, hB + 100]
    }


    return (
        <svg width={window.innerWidth} height={window.innerHeight} className='top-svg'>
            {
                networkdata.map((nd, i) => {
                    // console.log(nd)
                    if (nd.roi !== 'rest' && nd.network.length !== 0) {
                        // console.log(nd)
                        let data = Object.assign(nd.matrix, { names: nd["electrodes"], colors: colorList })
                        const chords = chord(data)
                        const names = data.names === undefined ? d3.range(data.length) : data.names
                        const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors
                        const color = d3.scaleOrdinal(names, colors)
                        return (
                            // <svg width={width} height={height}>
                            <g transform={`translate(${x[i]}, ${y[i]})`} id={`roi_${nd.roi}`}>
                                {chords.groups.map((each) => {
                                    // console.log(each)
                                    let textTransform = chordArc.centroid(each);
                                    return (
                                        <g key={each.index}>
                                            <path
                                                fill={color(names[each.index])}
                                                d={chordArc(each)}
                                            /><title>{`${names[each.index]}
                                                ${(each.value)}`}</title>
                                            <text
                                                transform={`translate(${textTransform[0] * textPadding}, ${textTransform[1] * textPadding})`}
                                                // x={2}
                                                dy='0.35em'
                                                // fontWeight={'bold'}
                                                fontSize='0.75em'
                                                textAnchor={'middle'}
                                            >
                                                {names[each.index]}
                                            </text>

                                        </g>
                                    )
                                })}
                                {chords.map((each, i) => {
                                    return (
                                        <g fillOpacity={0.8} key={i} >
                                            <path
                                                style={{ mixBlendMode: 'multiply' }}
                                                fill={color(names[each.source.index])}
                                                d={ribbon(each)}
                                            /><title>{`E${names[each.source.index]} → E${names[each.target.index]} = ${(each.source.value)}`}</title>
                                        </g>
                                    )
                                })}
                            </g>

                            // </svg>

                        )
                    }
                    else if (nd.roi !== 'rest') {
                        let defaultValue = 10
                        // let data = nd.electrodes.map((e)=> )
                        const obj = nd.electrodes.reduce((acc, val) => {
                            acc[val] = defaultValue;
                            return acc;
                        }, {});
                        // console.log(obj) 
                        var color = d3.scaleOrdinal()
                            .domain(Object.keys(obj))
                            .range(colorList)

                        var pie = d3.pie()
                            .value(function (d) { return d[1]; })
                        var data_ready = pie(Object.entries(obj))
                        // console.log(Object.entries(obj))
                        // console.log(data_ready)

                        const donArc = d3.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .padAngle(0.08)

                        return (
                            // <svg width={width} height={height}>
                            <g transform={`translate(${x[i]}, ${y[i]})`} id={`roi_${nd.roi}`}>
                                {data_ready.map((each, i) => {
                                    // console.log(each)
                                    let textTransform = donArc.centroid(each);
                                    return (
                                        <g key={i}>
                                            <path
                                                fill={color(each.index)}
                                                d={donArc(each)}
                                            /><title>{`E${+each.data[0]}`}</title>
                                            <text
                                                transform={`translate(${textTransform[0] * textPadding}, ${textTransform[1] * textPadding})`}
                                                // x={2}
                                                dy='0.35em'
                                                fontSize='0.85em'
                                                // fontWeight={'bold'}
                                                textAnchor={'middle'}
                                            >
                                                E{+each.data[0]}
                                            </text>

                                        </g>
                                    )
                                })}
                            </g>
                            // </svg>
                        )
                    } else {
                        const uniqueNames = [...new Set(nd.roiWithCount.map(item => item.count))];
                        uniqueNames.sort((a, b) => a - b);
                        // console.log(uniqueNames)
                        const strokeRange = Array.from({ length: uniqueNames.length }, (_, i) => 1 + i * 0.5);
                        // console.log(strokeRange)
                        const strokeWidthScale = d3.scaleOrdinal()
                            .domain(uniqueNames)
                            .range(strokeRange)

                        // console.log(d3.select(`#roi_100`).node().getBBox());
                        return (
                            nd['roiWithCount'].map((each) => {
                                // console.log(d3.select(`#roi_${each.source}`).node().getBBox())
                                let source = rois.indexOf(each.source)
                                let target = rois.indexOf(each.target)
                                // console.log(source, target)
                                return (
                                    <g className='aGroup'>
                                        <defs>
                                            <marker
                                                id="arrow"
                                                markerWidth="10"
                                                markerHeight="10"
                                                refX="0"
                                                refY="3"
                                                orient="auto"
                                                markerUnits="strokeWidth"

                                            >
                                                <path d="M0,0 L0,6 L9,3 z" fill="black" opacity={0.5} />
                                            </marker>
                                        </defs>
                                        <line
                                            x1={x[source]}
                                            y1={y[source]}
                                            x2={x[target]}
                                            y2={y[target]}
                                            stroke="black" strokeWidth={strokeWidthScale(each.count)} markerEnd="url(#arrow)" strokeOpacity={0.4}
                                        ></line><title>{`${+each.source} -> ${+each.target} = ${+each.count}`}</title>
                                    </g>
                                )
                            })
                        )
                    }
                })
            }

        </svg>
    )
}


export const AdjacencyContainer = ({ networkdata, rois }) => {
    // const rois = [100, 101, 201, 300, 301, 400, 401, 501]
    const height = 350;
    const width = 350;
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };

    const xScale = d3.scaleBand()
        // .domain(categories)
        .range([margin.left, width - margin.right])

    const yScale = d3.scaleBand()
        // .domain([...categories].reverse())
        .range([height - margin.bottom, margin.top])

    const color = d3.scaleSequential()
        .interpolator(d3.interpolateReds)


    const base = width / 2
    const hB = height / 2
    // console.log(base, hB)
    // const rois = [100, 101, 201, 300, 301, 400, 401, 501]
    //              0 RFL  1LFL   2LPL    3RTL      4LTL           5ROL       6LOL       7LI
    let netx = [base - 200, base, base, base + 250, base + 350, base + 200, base + 350, base + 120]
    //          0       1           2           3           4           5       6       7
    let nety = [hB + 250, hB + 100, hB + 550, hB, hB + 250, hB + 700, hB + 500, hB + 350]

    //        0 RFL ok  1LFL ok       2LPL ok    3RTL ok       4LTL ok   5ROL ok   6LOL ok       7LI ok
    let x = [base - 350, base - 175, base - 175, base + 75, base + 175, base + 25, base + 175, base - 50]
    //          0    1        2      3         4          5       6       7
    let y = [hB, hB - 75, hB + 350, hB - 175, hB + 75, hB + 500, hB + 325, hB + 175]

    if (rois.length < 4) {
        // x = [base, base + 300, base]
        // //          0       1           2           3           4           5       6       7
        // y = [hB + 100, hB + 150, hB + 450]

        x = [base - 150, -base + 100, base + 150]
        y = [hB - 180, hB + 150, hB - 80]

        netx = [base - 75, base + 325, base + 25]
        nety = [hB + 350, hB + 100, hB]
    }

    return (
        <svg width={window.innerWidth / 2} height={window.innerHeight - 20} className='top-svg'>
            {
                networkdata.map((nd, i) => {
                    // console.log(nd)
                    if (nd.roi !== 'rest') {
                        // console.log(nd)
                        let matrix = nd.matrix;
                        let max_val = d3.max(matrix, d => d3.max(d))
                        color.domain([0, max_val])
                        const categories = [...Array(nd.electrodes.length).keys()];
                        xScale.domain(categories);
                        yScale.domain([...categories].reverse());
                        return (

                            <g transform={`translate(${x[i]}, ${y[i]})`} id={`roi_${nd.roi}`}>
                                {
                                    matrix.map((row, index) => {
                                        // console.log(row)
                                        return (
                                            row.map((col, j) => {
                                                // console.log(col)
                                                return (
                                                    <g>
                                                        <rect
                                                            key={index + "-" + j}
                                                            x={xScale(index)}
                                                            y={yScale(j)}
                                                            width={xScale.bandwidth()}
                                                            height={yScale.bandwidth()}
                                                            fill={d3.interpolatePurples(col)} //{d3.interpolateReds(col)}
                                                            rx={4}
                                                            ry={4}
                                                        />
                                                    </g>
                                                )
                                            })
                                        )
                                    })
                                }
                            </g>


                        )
                    }
                    else {
                        const uniqueNames = [...new Set(nd.roiWithCount.map(item => item.count))];
                        uniqueNames.sort((a, b) => a - b);
                        // console.log(uniqueNames)
                        const strokeRange = Array.from({ length: uniqueNames.length }, (_, i) => 1 + i * 0.25);
                        // console.log(strokeRange)
                        const strokeWidthScale = d3.scaleOrdinal()
                            .domain(uniqueNames)
                            .range(strokeRange)

                        // console.log(d3.select(`#roi_100`).node().getBBox());
                        return (
                            nd['roiWithCount'].map((each) => {
                                // console.log(d3.select(`#roi_${each.source}`).node().getBBox())
                                let source = rois.indexOf(each.source)
                                let target = rois.indexOf(each.target)
                                return (
                                    <g className='aGroup'>
                                        <defs>
                                            <marker
                                                id="arrow"
                                                markerWidth="10"
                                                markerHeight="10"
                                                refX="0"
                                                refY="3"
                                                orient="auto"
                                                markerUnits="strokeWidth"

                                            >
                                                <path d="M0,0 L0,6 L9,3 z" fill="black" opacity={0.5} />
                                            </marker>
                                        </defs>
                                        <line
                                            x1={netx[source]}
                                            y1={nety[source]}
                                            x2={netx[target]}
                                            y2={nety[target]}
                                            stroke="black" strokeWidth={strokeWidthScale(each.count)} markerEnd="url(#arrow)" strokeOpacity={0.4}
                                        ></line><title>{`${+each.source} -> ${+each.target} = ${+each.count}`}</title>
                                    </g>
                                )
                            })
                        )
                    }

                })
            }

        </svg>

    )

}
