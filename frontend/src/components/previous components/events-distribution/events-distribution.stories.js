import React from "react";

import { EventsDistribution } from "./events-distribution.js";
import { eventsData } from "../../stories/fakeEventData";

export default {
  title: "EventDistribution",
  component: EventsDistribution,
};

const Template = (args) => (
  <div style={{ width: `${args.width}px`, height: `${args.height}px` }}>
    <EventsDistribution data={eventsData} />
  </div>
);

export const EventsStory = Template.bind({});
EventsStory.args = {
  width: 400,
  height: 200,
};
