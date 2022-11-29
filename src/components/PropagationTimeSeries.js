import { Col } from 'react-bootstrap'
import { CreateTimePlot } from './CreateTimePlots'

const margin = { top: 20, right: 30, bottom: 65, left: 40 }
const scaleOffset = 5
export const PropagationTimeSeries = ({
    sample1,
    sample2,
    sample3
}) => {

    if (sample1 && sample2 && sample3) {

        let electrodeList = [...new Set(sample1.map((item) => item.start))]
        let electrodeList2 = [...new Set(sample2.map((item) => item.start))]
        let electrodeList3 = [...new Set(sample3.map((item) => item.start))]

        // let domain1 = [...new Set(sample1.map((item) => item.frequency))]
        // console.log(domain1)
        const uniques = [...new Set(electrodeList.concat(electrodeList2, electrodeList3))]
            .sort(function (a, b) { return a - b })
        // console.log(electrodeList)
        // console.log(sample1)

        // console.log(uniques.length / 2)
        let half = uniques.length / 2
        const firstHalf = uniques.slice(0, half)
        const secondHalf = uniques.slice(half)

        const first = firstHalf.slice(0, firstHalf.length / 2)
        const second = firstHalf.slice(firstHalf.length / 2)
        const third = secondHalf.slice(0, secondHalf.length / 2)
        const fourth = secondHalf.slice(secondHalf.length / 2)

        // console.log(first.length, second.length, third.length, fourth.length)

        return (
            <>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={first}
                        electrodeData={sample1}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={second}
                        electrodeData={sample1}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={third}
                        electrodeData={sample1}
                    />
                </Col>
                <Col md='3' style={{ height: '45vh' }}>
                    <CreateTimePlot
                        margin={margin}
                        scaleOffset={scaleOffset}
                        electrodeListData={fourth}
                        electrodeData={sample1}
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