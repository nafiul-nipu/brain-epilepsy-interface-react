import { useState, useEffect } from "react";
import { parseOBJ } from "./OBJLoader";

import brain from "../models/brain.obj"
export const useOBJData = ({
    electrodeData
}) =>{
    const [data, setData] = useState(null);

    useEffect(() => {

        async function fetchData(){
            const response = await fetch(brain);
            // console.log(response)
            const text = await response.text();
            // console.log(text)
            const obj = parseOBJ(text, electrodeData);
            setData(obj)
        }
       fetchData()

    }, []);
    return data;
}