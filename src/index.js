import React, { unstable_Profiler as Profiler } from "react";
import addons, { makeDecorator } from "@storybook/addons";

const withProfiler = makeDecorator({
  name: "withProfiler",
  parameterName: "profiler",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context) => {
    function onRender(id, phase, actualTime, baseTime, startTime, commitTime) {
      const channel = addons.getChannel();
      channel.emit("REACTPROFILERADDON/updateProfilerInfo", {
        data: commitTime
      });
    }
    console.log("here");
    channel.emit("REACTPROFILERADDON/updateProfilerInfo", {
      data: "fuckfuckfuck"
    });
    return <Profiler key="profiler" onRender={onRender}>{getStory(context)}</Profiler>;
  }
});

export default withProfiler;