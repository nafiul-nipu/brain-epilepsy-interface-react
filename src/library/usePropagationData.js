import { useState, useEffect } from "react";
import { csv } from "d3";

export const usePropagationData = ({ url }) => {
    // console.log(url)
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.start = +d.start;
            d.end = +d.end;
            d.frequency = +d.frequency;
            d.startPosition = JSON.parse(d.startPosition);
            d.endPosition = JSON.parse(d.endPosition);
            return d;
        }
        csv(url, row).then(setData);
    }, [url])

    return data;
}