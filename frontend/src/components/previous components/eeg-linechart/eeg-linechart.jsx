import * as d3 from "d3";
import { useRef, useEffect } from "react";
import { seriesWebglLine } from "@d3fc/d3fc-series";
import { chartCartesian } from "@d3fc/d3fc-chart";
import { extentLinear } from "@d3fc/d3fc-extent";
import { annotationCanvasGridline } from "@d3fc/d3fc-annotation";

/* 
  chart: https://github.com/d3fc/d3fc/blob/master/packages/d3fc-chart/README.md
  lines: https://github.com/d3fc/d3fc/blob/master/packages/d3fc-series/README.md
*/

export const EegLinechart = ({
  chartId,
  data,
  width,
  height,
  showXAxis = false,
}) => {
  const containerRef = useRef(null);

  const xScale = d3
    .scaleLinear()
    // .domain(d3.extent(data, (d) => d.x))
    .domain(extentLinear().accessors([(d) => d.x, (d) => d.x])(data))
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(extentLinear().accessors([(d) => d.y, (d) => d.y])(data))
    .range([height, 0]);

  const lineRenderer = seriesWebglLine()
    .crossValue((d) => d.x)
    .mainValue((d) => d.y)
    .xScale(xScale)
    .yScale(yScale);

  const gridline = annotationCanvasGridline().xScale(xScale).yScale(yScale);

  const chart = chartCartesian(xScale, yScale)
    .webglPlotArea(lineRenderer)
    .canvasPlotArea(gridline)
    .decorate((container) => {
      if (!showXAxis) container.select(".x-axis").style("display", "none");

      const svgPlotArea = container.enter().select(".svg-plot-area").node();
      const canvasPlotArea = container
        .enter()
        .select(".canvas-plot-area")
        .node();
      const webglPlotArea = container.enter().select(".webgl-plot-area").node();
      d3.selectAll([canvasPlotArea, svgPlotArea, webglPlotArea])
        // order the nodes in the DOM by their selection order
        .order();
    });

  useEffect(() => {
    if (!containerRef.current) return null;

    d3.select(containerRef.current).datum(data).call(chart);
    // TODO: not sure if it's better to move chart inside
  }, [data, showXAxis]);

  return (
    <div
      id={`#${chartId}`}
      ref={containerRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    ></div>
  );
};
