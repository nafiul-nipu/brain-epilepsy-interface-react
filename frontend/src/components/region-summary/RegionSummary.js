import { RegionCircles } from "../../CommonComponents/RegionCircles";
import { Col, Row } from "react-bootstrap";
import * as d3 from 'd3';
import './RegionSummary.css'
import { useEffect, useMemo, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";


const rowSize = 3;

export const RegionSummary = ({
    networks,
    sampleName,
    setSelectedRoi,
    electrodeData
}) => {

    const [topPercent, setTopPercent] = useState(0.01)
    const [colorTheLine, setColorTheLine] = useState('width')

    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setIsVisible((prev) => !prev);
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

    function summaryOnClick(index, rowStartIndex) {
        // console.log('clicked', rowStartIndex + index)
        setSelectedRoi(rowStartIndex + index)
        // setRoiFilter(rowStartIndex + index)
    }

    return (
        <Col
            md="12"
            className="regionSummaryContainer"
            style={{ height: "35vh", backgroundColor: "#FAFBFC" }}
        >
            <div onClick={handleClick} id="viewPatch">
                {isVisible ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
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
                                        onClick={() => summaryOnClick(index, 0)}
                                    >
                                        <RegionCircles
                                            sample={sample}
                                            data={networks[sample]}
                                            electrodes={electrodeData.map((obj) => obj.electrode_number)}
                                            sampleCount={rowLength}
                                            currsample={sampleName}
                                            topPercent={topPercent}
                                            colorTheLine={colorTheLine}
                                            show={isVisible}
                                            labels={electrodeData.map((obj) => obj.label)}
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

