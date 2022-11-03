import { useState, useEffect } from "react";
import { parseOBJ } from "./OBJLoader";

import brain from "../models/brain.obj"
export const useOBJData = ({
    electrodeData
}) => {
    // console.log(electrodeData)
    const [data, setData] = useState(null);

    useEffect(() => {

        async function fetchData() {
            const response = await fetch(brain);
            // console.log(response)
            const text = await response.text();
            // console.log(text)
            let obj = parseOBJ(text, electrodeData);

            //color component is 3. our helper library assumes 4 so we need
            //to tell it there are only 3.
            let color = obj.geometries[0].data.color;

            obj.geometries[0].data.color = { numComponents: 3, data: color };
            setData(obj)
        }
        fetchData()

    }, [electrodeData]);
    return data;
}