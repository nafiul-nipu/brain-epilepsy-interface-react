import { Col, Row } from "react-bootstrap";
import { PatchCircles } from "./PatchCircles";

const samples = ['sample1', 'sample2', 'sample3']
const rowSize = 3;
// Use regular expression to extract the numeric part
export const PatchNetwork = ({
    networks,
    sampleName,
    electrodeData,
    communityData,
    viewColor,
    topPercent,
    colorTheLine,
    rowLength,
}) => {
    // console.log(networks)
    // console.log(sampleName)
    // console.log(electrodeData)
    // console.log(communityData)
    // console.log(rowLength)

    const numRows = Math.ceil((rowLength.length - 1) / rowSize);

    // console.log(numRows)
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
                            [...Array(numRows)].map((_, rowIndex) => {
                                const rowStartIndex = rowIndex * rowSize;
                                const rowObjects = rowLength.slice(rowStartIndex, rowStartIndex + rowSize);
                                const rowKey = `row-${rowIndex}`;
                                // console.log(rowObjects)
                                // console.log("rowStartIndex", rowStartIndex)
                                // console.log("rowObjects", rowObjects)
                                // console.log("rowKey", rowKey)
                                return (
                                    <Row key={rowKey}>
                                        {rowObjects.map((object, i) => (
                                            <Col
                                                md='4'
                                                // key={data[i].roi}
                                                style={{
                                                    height: `${33 / numRows}vh`,
                                                    // backgroundColor: selectedRoi === (i + rowStartIndex) ? "rgba(202, 204, 202, 0.4)" : "white",
                                                    // border: "1px solid #E2E8F0",
                                                }}

                                            >
                                                <PatchCircles
                                                    sample={object}
                                                    data={networks}
                                                    electrodes={electrodeData.filter((obj) => obj.label === object).map((obj) => obj.electrode_number)}
                                                    topPercent={topPercent}
                                                    colorTheLine={colorTheLine}
                                                    show={viewColor}
                                                    communityObj={communityData[samples.indexOf(sampleName)] !== undefined ?
                                                        Object.assign({}, ...communityData[samples.indexOf(sampleName)].communities.map(({ community, members }) => Object.fromEntries(members.map(value => [value, community]))))
                                                        : null
                                                    }
                                                />
                                            </Col>

                                        ))
                                        }
                                    </Row >
                                );
                            })
                        }
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}