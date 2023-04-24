import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";

const rowSize = 3;

export const RegionSummary = ({ data }) => {
    // console.log(data)
    const numRows = Math.ceil((data.length - 1) / rowSize);


    const rows = [...Array(numRows)].map((_, rowIndex) => {
        const rowStartIndex = rowIndex * rowSize;
        const rowObjects = data.slice(rowStartIndex, rowStartIndex + rowSize);
        const rowKey = `row-${rowIndex}`;
        console.log(rowObjects)
        return (
            <Row key={rowKey}>
                {rowObjects.map((object) => (
                    <Col md='4' key={object.roi} style={{ height: `${30 / numRows}vh` }}>
                        <RegionCircles
                            data={{
                                "activeElectrode": data[0].electrodes,
                                "frequency": Array.from({ length: data[0].electrodes.length }, () => Math.floor(Math.random() * 40) + 1)
                            }}
                        />
                    </Col>
                ))}
            </Row>
        );
    });

    return (
        <>{rows}</>
    );
};

