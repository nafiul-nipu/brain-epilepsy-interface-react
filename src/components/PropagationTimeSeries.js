import * as d3 from 'd3'
export const PropagationTimeSeries = ({
    sample1,
    sample2,
    sample3
}) => {

    if (sample1 && sample2 && sample3) {
        let domain = d3.extent(sample1.map((item) => {
            return item.frequency
        }))
        let electrodeList = [...new Set(sample1.map((item) => item.start))]
        let electrodeList2 = [...new Set(sample2.map((item) => item.start))]
        let electrodeList3 = [...new Set(sample3.map((item) => item.start))]
        // console.log(sample1)
        // console.log(domain)
        console.log(electrodeList)
        console.log(electrodeList2)
        console.log(electrodeList3)
    }
    return (
        <div>time series</div>
    )
}