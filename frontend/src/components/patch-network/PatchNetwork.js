import { Col, Row } from "react-bootstrap";
import { Create2DNetwork } from "../../CommonComponents/Create2DNetwork";

const samples = ['sample1', 'sample2', 'sample3']
const rowSize = 3;
// Use regular expression to extract the numeric part
export const PatchNetwork = ({
    networks,
    patchData,
    sampleName,
    electrodeData,
    communityData,
    viewColor,
    topPercent,
    colorTheLine,
    rowLength,
    selectedRoi,
    setSelectedRoi
}) => {
    // console.log(patchData)

    const numRows = Math.ceil((rowLength.length - 1) / rowSize);

    const patchOnClick = (object) => {
        // console.log(object)
        setSelectedRoi(object)
    }

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
                                                key={i}
                                                style={{
                                                    height: `${35 / numRows}vh`,
                                                    backgroundColor: selectedRoi === (object)
                                                        ? "rgba(202, 204, 202, 0.4)"
                                                        : "white",
                                                }}
                                                onClick={() => patchOnClick(object)}

                                            >
                                                {patchData[object] ?
                                                    (<Create2DNetwork
                                                        sample={object}
                                                        data={networks}
                                                        patchOrder={patchData[object].matrix}
                                                        electrodes={electrodeData.filter((obj) => obj.label === object).map((obj) => obj.electrode_number)}
                                                        topPercent={topPercent}
                                                        colorTheLine={colorTheLine}
                                                        show={viewColor}
                                                        labels={null}
                                                        communityObj={communityData[samples.indexOf(sampleName)] !== undefined ?
                                                            Object.assign({}, ...communityData[samples.indexOf(sampleName)].communities.map(({ community, members }) => Object.fromEntries(members.map(value => [value, community]))))
                                                            : null
                                                        }
                                                    />)
                                                    : null}
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