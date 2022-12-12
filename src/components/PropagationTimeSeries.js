// creating line plots for propagations
import { Row, Col } from 'react-bootstrap'
import { CreateTimePlot } from './CreateTimePlots'
import * as d3 from 'd3'

// margin for SVG
const margin = { top: 0, right: 30, bottom: 100, left: 40 }
// offset variable to placement
const scaleOffset = 5

export const PropagationTimeSeries = ({
    sample1,
    sample2,
    sample3
}) => {
    // if samples are loaded return line plot else return loading
    if (sample1 && sample2 && sample3) {
        // getting the list of electrodes from each sample
        let electrodeList = [...new Set(sample1.map((item) => item.start))]
        let electrodeList2 = [...new Set(sample2.map((item) => item.start))]
        let electrodeList3 = [...new Set(sample3.map((item) => item.start))]

        // ccreating the list of electrodes with unique values, sorting smaller to larger
        const uniques = [...new Set(electrodeList.concat(electrodeList2, electrodeList3))]
            .sort(function (a, b) { return a - b })

        // getting frequency values
        let dom1 = d3.extent([...new Set(sample1.map((item) => item.frequency))])
        let dom2 = d3.extent([...new Set(sample2.map((item) => item.frequency))])
        let dom3 = d3.extent([...new Set(sample3.map((item) => item.frequency))])

        let domains = [...dom1, ...dom2, ...dom3]
        // console.log(domains)
        // gettign the domain
        let domain = d3.extent(domains)
        console.log(d3.extent(domains))

        // dividing the array into four sub arrays
        // first divide the array into two
        let half = uniques.length / 2
        const firstHalf = uniques.slice(0, half)
        const secondHalf = uniques.slice(half)

        // divide the two array into four
        const first = firstHalf.slice(0, firstHalf.length / 2)
        const second = firstHalf.slice(firstHalf.length / 2)
        const third = secondHalf.slice(0, secondHalf.length / 2)
        const fourth = secondHalf.slice(secondHalf.length / 2)

        return (
            <Row>
                <Col md='6' style={{ height: '95vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={firstHalf}
                        electrodeData={[sample1, sample2, sample3]}
                        domain={domain}
                    />
                </Col>
                <Col md='6' style={{ height: '95vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={secondHalf}
                        electrodeData={[sample1, sample2, sample3]}
                        domain={domain}
                    />
                </Col>
                {/* <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={third}
                        electrodeData={[sample1, sample2, sample3]}
                        domain={domain}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={fourth}
                        electrodeData={[sample1, sample2, sample3]}
                        domain={domain}
                    />
                </Col> */}
            </Row>
        )

    } else {
        return (
            <div>loading</div>
        )
    }
}