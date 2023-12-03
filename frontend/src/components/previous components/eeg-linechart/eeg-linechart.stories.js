import React from "react";
import { EegLinechart } from "./eeg-linechart";

export default {
  title: "EEG-Linechart",
  component: EegLinechart,
};

const Template = (args) => {
  let data = [];
  for (let i = 0; i < args.numberPoints; i++) {
    data.push({
      x: i,
      y: Math.floor(Math.random() * 100) * (i % 2 === 0 ? 1 : -1),
    });
  }

  const arr = [...Array(args.numberCharts).keys()];

  return (
    <>
      {arr.map((i) => (
        <EegLinechart
          key={`test-chart-${i}`}
          chartId={`test-chart-${i}`}
          data={data}
          width={args.width}
          height={args.height}
          showXAxis={args.showXAxis}
        />
      ))}
    </>
  );
};

export const EventsStory = Template.bind({});
EventsStory.args = {
  numberPoints: 10000,
  numberCharts: 2,
  width: 1000,
  height: 200,
  showXAxis: false,
};
