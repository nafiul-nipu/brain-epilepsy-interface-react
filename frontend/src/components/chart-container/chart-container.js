import { createContext, useContext, useRef, useState, useEffect } from "react";
import { useChartDimensions } from "./useChartDimensions";
import { select } from "d3-selection";
import { zoom as d3Zoom } from "d3-zoom";
import PropTypes from "prop-types";

const style = { width: "100%", height: "100%" };

const ChartContext = createContext();

const ChartContainer = ({ useZoom, ml, mr, mt, mb, children }) => {
  // Every children should assume its being translated by the first <g>
  const [ref, dimensions] = useChartDimensions({
    marginLeft: ml,
    marginRight: mr,
    marginTop: mt,
    marginBottom: mb,
  });
  const [{ x, y, k }, setTransform] = useState({ x: 0, y: 0, k: 1 });

  const svgRef = useRef(null);
  const [svg, setSVG] = useState(null);
  useEffect(() => setSVG(svgRef.current), []);

  useEffect(() => {
    if (!svg || !useZoom) return;
    const selection = select(svg);
    const zoom = d3Zoom()
      .scaleExtent([1, Infinity])
      .on("zoom", function (event, datum) {
        setTransform(event.transform);
      });
    selection.call(zoom);

    return () => selection.on(".zoom", null);
  }, [svg, useZoom]);

  return (
    <div ref={ref} style={style}>
      <ChartContext.Provider value={dimensions}>
        <svg
          x={0}
          y={0}
          width={dimensions.width}
          height={dimensions.height}
          ref={svgRef}
        >
          <g
            transform={`translate(${x + dimensions.marginLeft},  ${y + dimensions.marginTop
              }) scale(${k})`}
          >
            {children}
          </g>
        </svg>
      </ChartContext.Provider>
    </div>
  );
};

ChartContainer.propTypes = {
  ml: PropTypes.number,
  mr: PropTypes.number,
  mt: PropTypes.number,
  mb: PropTypes.number,
};

ChartContainer.defaultProps = {
  ml: 0,
  mr: 0,
  mt: 0,
  mb: 0,
  useZoom: false,
};

export const useChartContext = () => useContext(ChartContext);
export default ChartContainer;
