import { useState, useEffect } from "react";
import { json } from "d3";

export const usePatternBoundaryPoints = ({ patientID }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (patientID) {
      const url = `https://raw.githubusercontent.com/nafiul-nipu/brain-epilepsy-interface-react/refs/heads/master/frontend/src/data/pattern_boundary_points/${patientID}_boundary_points_quantiles.json`;

      json(url)
        .then((jData) => {
          setData(jData);
        })
        .catch((err) => {
          console.log("error", err);
          setData(null);
        });
    }
  }, [patientID]);

  return data;
};
