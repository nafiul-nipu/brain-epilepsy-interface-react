import { useState, useEffect } from "react";
import { csv } from "d3";

export const useElectrodeData = ({ url }) => {
    // console.log(url)
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.electrode_number = +d.electrode_number;
            d.position = JSON.parse(d.position)
            d.newPosition = JSON.parse(d.newPosition)
            return d
        }
        csv(url, row).then(setData)
    }, [url])

    return data;
}