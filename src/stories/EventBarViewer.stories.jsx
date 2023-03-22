import React from "react";

import { EventBarViewer } from "../components/event-viewer/EventBarViewer";
import { eventsData } from "./fakeEventData";

export default {
  title: "EventBarViewer",
  component: EventBarViewer,
};

const onClickEvent = (eventDatum) => {
  console.log(eventDatum);
};

const Template = (args) => (
  <div style={{ width: `${args.width}px`, height: `${args.height}px` }}>
    <EventBarViewer
      data={eventsData}
      threshold={args.threshold}
      onClickEvent={onClickEvent}
    />
  </div>
);

export const EventsStory = Template.bind({});
EventsStory.args = {
  width: 1500,
  height: 500,
  threshold: 0,
};
