import React, { unstable_Profiler as Profiler } from "react";
import addons, { makeDecorator } from "@storybook/addons";

export const withProfiler = makeDecorator({
  name: "withProfiler",
  parameterName: "profiler",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context) => {
    const channel = addons.getChannel();
    function onRender(id, phase, actualTime, baseTime, startTime, commitTime) {
      channel.emit("REACTPROFILERADDON/updateProfilerInfo", {
        time: actualTime,
        isInitialMount: phase !== 'update',
        timeBetweenStartAndCommit: commitTime - startTime  
      });
    }
    return (
      <Profiler 
        id={context.id} 
        key="profiler" 
        onRender={onRender}>{getStory(context)}
      </Profiler>
    );
  }
});

export default withProfiler;