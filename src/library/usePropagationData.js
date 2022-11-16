import { useState, useEffect } from "react";
import { csv } from "d3";

export const useElectrodeData = ({ url }) => {
    // console.log(url)
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.from = +d.from;
            d.to = +d.to;
            d.frequrncy = +d.frequrncy;
            return d
        }
        csv(url, row).then(setData)
    }, [url])

    return data;
}