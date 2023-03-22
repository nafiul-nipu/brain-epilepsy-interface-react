import React from "react";

import { EventBarViewer } from "../components/event-viewer/EventBarViewer";
import { eventsData } from "./fakeEventData";

export default {
  title: "EventBarViewer",
  component: EventBarViewer,
};

const Template = (args) => (
  <div style={{ width: `${args.width}px`, height: `${args.height}px` }}>
    <EventBarViewer data={eventsData} />
  </div>
);

export const EventsStory = Template.bind({});
EventsStory.args = {
  width: 1500,
  height: 500,
};
