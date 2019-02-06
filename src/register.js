import React from 'react';
import addons from '@storybook/addons';
import styled from '@emotion/styled';

const ProfilerPanel = styled.div({
  margin: 10,
  width: '100%',
  overflow: 'auto',
});

class ProfilerInfo extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
    this.onUpdateProfilerInfo = this.onUpdateProfilerInfo.bind(this);
  }

  componentDidMount() {
    const { channel, api } = this.props;
    // Listen to the notes and render it.
    channel.on('MYADDON/add_notes', this.onAddNotes);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onUpdateProfileInfo([]);
    });
  }

  componentWillUnmount() {
    const { channel, api } = this.props;
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }
    channel.removeListener('REACTPROFILERADDON/updateProfilerInfo', this.onUpdateProfilerInfo);
  }
  
  onUpdateProfilerInfo(data) {
    this.setState({ data });
  }

  render() {
    const { data } = this.state;
    const { active } = this.props;

    return active ? <ProfilerPanel>Profiler</ProfilerPanel> : null;
  }
}

// Register the addon with a unique name.
addons.register('REACTPROFILERADDON', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('REACTPROFILERADDON/panel', {
    title: 'Profiler',
    render: ({ active }) => <ProfilerInfo channel={addons.getChannel()} api={api} active={active} />,
  });
});