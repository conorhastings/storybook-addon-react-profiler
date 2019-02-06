import React, { unstable_Profiler as Profiler } from 'react';
import addons, { makeDecorator } from '@storybook/addons';

const withProfiler = makeDecorator({
  name: 'withProfiler',
  parameterName: 'profiler',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, {parameters}) => {
    const story = getStory(context);
    function onRender() {
      console.log(arguments);
      // const channel = addons.getChannel();
      //     channel.emit('REACTPROFILERADDON/updateProfilerInfo', parameters);
    }
    return <Profiler onRender={onRender}>{getStory(context)}</Profiler>
  }
});

export default withProfiler;