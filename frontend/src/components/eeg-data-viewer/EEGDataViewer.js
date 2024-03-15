import { LinePlot } from "../../CommonComponents/LinePlot";
import ChartContainer, { useChartContext } from "../chart-container/chart-container";
import { useRef, useState, useEffect } from 'react';
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import "./eeg-data-viewer.css";
import { AxisBottom } from "../../CommonComponents/AxisBottom";
import { AxisLeft } from "../../CommonComponents/AxisLeft";
import * as d3 from "d3";

const containerProps = {
  useZoom: false,
  ml: 50,
  mr: 25,
  mb: 0,
  mt: 0,
};

const colorslist = [
  '#007ed3',
  '#FF004F',
  '#9F8170',
  '#9400D3',
  '#FFC40C',
  '#59260B',
  '#FE4EDA',
  '#40E0D0',
  '#FF4F00',
  '#006D6F',
  '#C19A6B'
];

const catColor = {
  1: '#1f77b4',
  2: '#ff7f0e',
  3: "#FF96C5",
  4: "#FF5768",
  5: "#FFBF65",
  6: "#9467bd",
  7: "#fdbf6f",
  8: "#ff7f0e",
  9: "#fb9a99",
  10: "#8c564b",
  12: "#9467bd",
  14: "#00A5E3",
}
export const EEGDataViewer = ({
  sampleName,
  eegData,
  xTicks,
  electrodeList,
  electrodeName,
  eegInBrain,
  setEegInBrain,
  timeToFecth,
  timeWindow,
  eegList,
  show,
  patchLabels,
  regionLabels,
  communityObj

}) => {
  // console.log(eegData)
  // console.log(electrodeList)
  // console.log(selectedEventRange)
  // console.log(eegList)
  console.log(patchLabels, regionLabels, communityObj, show)
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const [axisDimensions, setAxisDimensions] = useState(null);

  const extents = Object.keys(eegData.eeg)
    .map(key => [Math.min(...eegData.eeg[key]), Math.max(...eegData.eeg[key])])
    .flat();

  const filteredExtents = extents.filter(el => isFinite(el));

  // console.log(extents)

  const absMax = Math.max(...filteredExtents.map(Math.abs));
  // console.log(absMax)

  const yDomain = [-absMax, absMax];
  // console.log(yDomain)
  // const yDomain = [-2000, 2000];

  const peakIndex = d3.scaleLinear()
    .domain(xTicks)
    .range([0, timeWindow])

  function onEEGClick(el) {
    setEegInBrain(el)
    // stopTimer()
  }

  // let count = 0;

  const sortedElectrodes = eegList !== null ?
    eegList.concat(electrodeList.filter(electrode => !eegList.includes(electrode)))
    : electrodeList;

  // console.log(eegList)
  // console.log(sortedElectrodes)

  let xScale, yLineScale;
  if (axisDimensions) {
    xScale = d3.scaleLinear()
      .domain([0, timeWindow])
      .range([0, axisDimensions.boundedWidth]);

    yLineScale = d3.scaleLinear()
      .domain(yDomain)
      .range([axisDimensions.boundedHeight, 0])
  }

  const startTickText = xTicks[0];
  const endTickText = xTicks[xTicks.length - 1];
  const xTickText = [startTickText, endTickText];
  const xtickvalues = [0, timeWindow];

  return (
    <div className="eeg-container">
      <div className="eeg-title">
        <div title="Previous" onClick={() => timeToFecth('prev')}><TbPlayerTrackPrevFilled /></div>
        <div><strong>EEGs</strong> <span>{sampleName}</span></div>
        <div title="Next" onClick={() => timeToFecth('next')}><TbPlayerTrackNextFilled /></div>
      </div>

      {axisDimensions && (
        <svg x={0}
          y={0}
          width={axisDimensions.width} height="25">
          <g
            transform={`translate(${axisDimensions.marginLeft}, ${axisDimensions.marginTop}) scale(1)`}
          >
            <AxisBottom
              xScale={xScale}
              yScale={yLineScale}
              scaleOffset={5}
              innerHeight={5}
              textPosition={3.85}
              ticks={xtickvalues}
              tickText={xTickText}
            />
          </g>
        </svg>
      )}

      <div className="eeg-list" ref={containerRef}>
        {
          sortedElectrodes.map((el, i) => {
            if (eegData.eeg[el] !== undefined && eegData.eeg[el].length > 0) {
              // count++;
              return (
                <div
                  style={{
                    height: '5vh',
                    boxShadow: eegInBrain === el ? "0 0 10px 5px #000000" : "none"
                  }}
                  ref={el => itemRefs.current[i] = el}
                  key={i}
                  onClick={() => onEEGClick(el)}
                >
                  {/* <div className="electrodeEEGNameDiv">{`E${el}`} </div> */}
                  <ChartContainer {...containerProps} key={i}>
                    <EEGChartWrapper
                      data={eegData.eeg[el]}
                      electrodeList={electrodeList}
                      electrodeName={electrodeName}
                      currenElectrode={el}
                      yDomain={yDomain}
                      xTicks={xTicks}
                      peaks={eegData.peaks[el] ? eegData.peaks[el] : []}
                      peakIndex={peakIndex}
                      timeWindow={timeWindow}
                      axisDimensions={axisDimensions}
                      setAxisDimensions={setAxisDimensions}
                      show={show}
                      patchLabels={patchLabels}
                      regionLabels={regionLabels}
                      communityObj={communityObj}
                    />
                  </ChartContainer>
                </div>
              )
            } else {
              return null
            }
          })
        }
      </div>
    </div>
  );
};


const EEGChartWrapper = ({ data, electrodeList, electrodeName, currenElectrode, yDomain, xTicks, peaks, peakIndex, timeWindow, axisDimensions, setAxisDimensions, show, patchLabels,
  regionLabels, communityObj }) => {
  // console.log(currenElectrode)
  // console.log(electrodeList)
  // console.log(electrodeName[electrodeList.indexOf(currenElectrode)])

  // console.log(data)

  // console.log(xTicks)
  const dimensions = useChartContext();

  useEffect(() => {
    // prevent over rendering
    if (dimensions && JSON.stringify(dimensions) !== JSON.stringify(axisDimensions)) {
      setAxisDimensions(dimensions);
    }
  }, [dimensions]);

  // Function to generate regions from patchLabels
  const generateRegionsFromLabels = (regionLabels) => {
    let regions = {};
    let currentRegion = null;
    Object.entries(regionLabels).forEach(([electrode, label]) => {
      if (label !== currentRegion) {
        currentRegion = label;
      }
      regions[electrode] = currentRegion;
    });
    return regions;
  };

  // Assign colors to each unique region
  const assignColorsToRegions = (regions) => {
    const uniqueRegions = new Set(Object.values(regions));
    const colorMap = new Map();

    let colorIndex = 0;

    uniqueRegions.forEach(region => {
      colorMap.set(region, colorslist[colorIndex % colorslist.length]);
      colorIndex++;
    });

    return colorMap;
  };

  // setting color based on the dropdown value
  const eegLineColor = (() => {
    if (show === 'patch') {
      const labelValue = patchLabels[currenElectrode];
      if (labelValue !== undefined) {
        return colorslist[labelValue];
      }
    }

    if (show === 'regions') {
      const regions = generateRegionsFromLabels(regionLabels);
      const regionColorMap = assignColorsToRegions(regions);

      const region = regions[currenElectrode]; 
      if (region !== undefined) {
        return regionColorMap.get(region);
      }
    }

    if(show === 'communities') {
      const community = communityObj[currenElectrode];
      if (community !== undefined) {
        return catColor[community];
      }
    }

    return "#137B80"; // green
  })();

  const xScale = d3.scaleLinear()
    .domain([0, timeWindow])
    .range([0, dimensions.boundedWidth])

  const yLineScale = d3.scaleLinear()
    .domain(yDomain)
    .range([dimensions.boundedHeight, 0])

  const yTicks = yLineScale.ticks();
  // const tickValues = [yTicks[0], yTicks[yTicks.length - 1]];

  // const xTickText = Array.from({ length: 6 }, (_, i) => xTicks[0] + i * ((xTicks[1] - xTicks[0]) / 5));
  // console.log(xTickText)
  // const xtickvalues = Array.from({ length: 6 }, (_, i) => 0 + i * (timeWindow / 5));



  return (
    <g>
      <text
        x={-containerProps.ml + 12}
        y={dimensions.boundedHeight / 2 + 6}
      >{electrodeName[electrodeList.indexOf(currenElectrode)]}</text>
      <LinePlot
        data={data}
        xScale={xScale}
        yLineScale={yLineScale}
        colorChecker={electrodeList}
        curr={currenElectrode}
        color={eegLineColor}
      />
      {/* <AxisLeft
        xScale={xScale} yScale={yLineScale} scaleOffset={10}
        ticks={tickValues}
        textPosition={2.85}
      /> */}

      {/* <AxisBottom
        xScale={xScale}
        yScale={yLineScale}
        scaleOffset={5}
        innerHeight={dimensions.boundedHeight}
        textPosition={3.85}
        ticks={xtickvalues}
        tickText={xTickText}
      /> */}
      {
        peaks.length > 0 ? peaks.map((el, i) => {
          // console.log("time", el.time)
          // console.log("peak index", peakIndex(el.time))
          // console.log("xScale", xScale(peakIndex(el.time) - 1))
          // console.log("yScale", yLineScale(data[peakIndex(el.time) - 1]))
          const index = Math.round(peakIndex(el.time) - 1)
          // console.log("index", index)
          return (
            <g key={i}>
              <circle
                key={i}
                cx={xScale(index)}
                cy={yLineScale(data[index])}
                r={2}
                fill="red"
              /><title>{`Time: ${el.time}`}</title>
            </g>
          )
        }) : null
      }
    </g>
  )
}
