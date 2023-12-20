import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";
import './RegionSummary.css'
import { useState } from "react";


const rowSize = 3;

export const RegionSummary = ({
    networks,
    sampleName,
    electrodeData,
    communityData
}) => {

    const [topPercent, setTopPercent] = useState(0.01)
    const [colorTheLine, setColorTheLine] = useState('width')
    const [viewColor, setViewColor] = useState('na')

    const onViewChange = (event) => {
        setViewColor(event.target.value);
    };

    const topOnChange = (event) => {
        setTopPercent(event.target.value)
    }

    const colorOnChange = (event) => {
        setColorTheLine(event.target.value)
    }
    // console.log(networks)
    // console.log(sampleName)
    // console.log(electrodeData)

    // console.log(communityData)

    // const resultObject = Object.assign({}, ...communityData[0].communities.map(({ community, members }) => Object.fromEntries(members.map(value => [value, community]))));

    // console.log(resultObject);

    return (
        <Col
            md="12"
            className="regionSummaryContainer"
            style={{ height: "35vh", backgroundColor: "#FAFBFC" }}
        >
            <div id="viewPatch">
                <label htmlFor="view">View:</label>
                <select id="view" value={viewColor} onChange={onViewChange}>
                    <option value="na"> N/A </option>
                    <option value="patch"> Patch </option>
                    <option value="communities"> Communities </option>
                </select>
            </div>
            {/* Patient dropdown */}
            <div id="region-topPercent">
                <label htmlFor="percent">Top:</label>
                <select id="percent" value={topPercent} onChange={topOnChange}>
                    <option value="0.01"> 1% </option>
                    <option value="0.02"> 2% </option>
                    <option value="0.05"> 5% </option>
                    <option value="0.1"> 10% </option>
                </select>
            </div>

            {/* propagation dropdown */}
            <div id="region-color">
                <label htmlFor="color">Color:</label>
                <select id="color" value={colorTheLine} onChange={colorOnChange}>
                    <option value="width"> width</option>
                    <option value="time"> time </option>
                </select>
            </div>

            <Row>
                <Col md="12" style={{ height: "35vh" }}>
                    <Row>
                        {
                            Object.keys(networks).map((sample, index) => {
                                // console.log(sample)
                                // console.log(index)
                                const rowLength = Object.keys(networks).length;
                                return (
                                    <Col
                                        md={`${12 / rowLength}`}
                                        key={index}
                                        style={{
                                            height: `${34 / Math.ceil((rowLength - 1) / rowSize)}vh`,
                                            backgroundColor: sampleName === sample ? "rgba(202, 204, 202, 0.4)" : "white",
                                        }}
                                    >
                                        <RegionCircles
                                            sample={sample}
                                            data={networks[sample]}
                                            electrodes={electrodeData.map((obj) => obj.electrode_number)}
                                            sampleCount={rowLength}
                                            currsample={sampleName}
                                            topPercent={topPercent}
                                            colorTheLine={colorTheLine}
                                            show={viewColor}
                                            labels={electrodeData.map((obj) => obj.label)}
                                            communityObj={communityData[index] !== undefined ?
                                                Object.assign({}, ...communityData[index].communities.map(({ community, members }) => Object.fromEntries(members.map(value => [value, community]))))
                                                : null
                                            }
                                        />
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Col>
            </Row>
        </Col>

    );
};

