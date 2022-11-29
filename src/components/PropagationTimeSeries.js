// creating line plots for propagations
import { Col } from 'react-bootstrap'
import { CreateTimePlot } from './CreateTimePlots'

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
            <>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={first}
                        electrodeData={[sample1, sample2, sample3]}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={second}
                        electrodeData={[sample1, sample2, sample3]}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={third}
                        electrodeData={[sample1, sample2, sample3]}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={fourth}
                        electrodeData={[sample1, sample2, sample3]}
                    />
                </Col>
            </>
        )

    } else {
        return (
            <div>loading</div>
        )
    }
}