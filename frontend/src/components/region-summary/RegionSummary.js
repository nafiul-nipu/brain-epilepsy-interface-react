import { RegionCircles } from "../previous components/archived/RegionCircles";
import { Col, Row } from "react-bootstrap";
import './RegionSummary.css'
import { Create2DNetwork } from "../../CommonComponents/Create2DNetwork";


const rowSize = 3;

export const RegionSummary = ({
    networks,
    sampleName,
    electrodeData,
    communityData,
    viewColor,
    topPercent,
    colorTheLine,
}) => {
    return (
        <Col
            md="12"
            className="regionSummaryContainer"
            style={{ height: "35vh", backgroundColor: "#FAFBFC" }}
        >

            <Row>
                <Col md="12" style={{ height: "35vh" }}>
                    <Row>
                        {
                            Object.keys(networks).map((sample, index) => {
                                // console.log(sample)
                                // console.log(index)
                                const rowLength = Object.keys(networks).length;
                                // console.log("rowLength", rowLength)
                                return (
                                    <Col
                                        md={`${12 / rowLength}`}
                                        key={index}
                                        style={{
                                            height: `${34 / Math.ceil((rowLength - 1) / rowSize)}vh`,
                                            backgroundColor: sampleName === sample ? "rgba(202, 204, 202, 0.4)" : "white",
                                        }}
                                    >
                                        <Create2DNetwork
                                            sample={sample}
                                            data={networks[sample]}
                                            patchOrder={null}
                                            electrodes={electrodeData.map((obj) => obj.electrode_number)}
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

