import React, { unstable_Profiler as Profiler } from "react";
import addons, { makeDecorator } from "@storybook/addons";
import prettyMS from "pretty-ms";

function cacheProfiles() {
  const profiles = {};
  return function getProfiles(id, profile) {
    if (profiles[id]) {
      profiles[id].unshift(profile);
    } else {
      profiles[id] = [profile];
    }
    return profiles[id];
  };
}
const getProfiles = cacheProfiles();
export const withProfiler = makeDecorator({
  name: "withProfiler",
  parameterName: "profiler",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context) => {
    const channel = addons.getChannel();
    function onRender(id, phase, actualTime, baseTime, startTime, commitTime) {
      channel.emit(
        "REACTPROFILERADDON/updateProfilerInfo",
        getProfiles(id, {
          id,
          time: prettyMS(actualTime),
          isInitialMount: phase !== "update",
          timeBetweenStartAndCommit: prettyMS(commitTime - startTime)
        })
      );
    }
    return (
      <Profiler
        id={`${context.parameters.fileName}${context.story}`}
        key="profiler"
        onRender={onRender}
      >
        {getStory(context)}
      </Profiler>
    );
  }
});

export default withProfiler;
