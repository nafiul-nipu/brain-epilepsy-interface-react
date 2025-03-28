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
    rowLength,
    selectedRoi,
    setSelectedRoi,
    eegList,
    setEegList,
    networkType
}) => {
    // console.log(electrodeData)
    // console.log(rowLength)

    const numRows = Math.ceil((rowLength.length) / rowSize);
    // console.log('rowLength', rowLength.length)
    // console.log('numRows', numRows)

    const patchOnClick = (object) => {
        // console.log(object)
        setSelectedRoi(object)
    }
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
                                // console.log(typeof rowObjects[0])

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
                                                        electrodes={typeof object === 'string' ?
                                                            electrodeData.filter((obj) => obj.region === object).map((obj) => obj.electrode_number)
                                                            :
                                                            electrodeData.filter((obj) => obj.label === object).map((obj) => obj.electrode_number)
                                                        }
                                                        electrodeName={typeof object === 'string' ?
                                                            electrodeData.filter((obj) => obj.region === object).map((obj) => obj.E_Brain)
                                                            :
                                                            electrodeData.filter((obj) => obj.label === object).map((obj) => obj.E_Brain)
                                                        }
                                                        networkType={networkType === 'patch' ? 'patch' : 'region'}
                                                        topPercent={topPercent}
                                                        show={viewColor}
                                                        regions={[...new Set(electrodeData.map(obj => obj.region))]}
                                                        patchLabels={
                                                            electrodeData.reduce((result, obj) =>
                                                                ({ ...result, [obj.electrode_number]: obj.label }), {})
                                                        }
                                                        regionLabels={electrodeData.reduce((result, obj) => ({ ...result, [obj.electrode_number]: obj.region }), {})}
                                                        communityObj={communityData[topPercent][samples.indexOf(sampleName)] !== undefined ?
                                                            Object.assign({}, ...communityData[topPercent][samples.indexOf(sampleName)].communities.map(({ community, members }) => Object.fromEntries(members.map(value => [value, community]))))
                                                            : null
                                                        }
                                                        eegList={eegList}
                                                        setEegList={setEegList}
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