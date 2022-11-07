import { useState, useEffect } from "react";
import { csv } from "d3";

export const useElectrodeData = ({ url }) => {
    console.log(url)
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.electrode_number = +d.electrode_number;
            d.position = +d.position
            return d
        }
        csv(url, row).then(setData)
    }, [url])

    return data;
}