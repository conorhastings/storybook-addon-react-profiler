import React from "react";
import addons from "@storybook/addons";
import styled from "@emotion/styled";
import { f } from "core-js/modules/_object-dp";

const ProfilerPanel = styled.div({
  margin: 10,
  width: "100%",
  overflow: "auto"
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
    channel.on(
      "REACTPROFILERADDON/updateProfilerInfo",
      this.onUpdateProfilerInfo
    );

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onUpdateProfilerInfo([]);
    });
  }

  componentWillUnmount() {
    const { channel, api } = this.props;
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }
    channel.removeListener(
      "REACTPROFILERADDON/updateProfilerInfo",
      this.onUpdateProfilerInfo
    );
  }

  onUpdateProfilerInfo(data) {
    console.log(this.node.scrollHeight, this.node.parentNode);
    this.node.parentNode.scrollTop = this.node.scrollHeight;
    this.setState({ data });
  }

  render() {
    const { data: profiles } = this.state;
    return (
      <ProfilerPanel key="profilerPanel">
        <div
          style={{ width: 800, margin: "0 auto" }}
          ref={node => (this.node = node)}
        >
          {profiles.map((data, index) => (
            <div
              key={`${data.id}-${index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 20,
                marginBottom: 10,
                borderRadius: 10,
                width: "80%",
                color: index === 0 ? "white" : "rgb(15,15,15)",
                backgroundColor: index === 0 ? "#B481BB" : "rgb(241, 241, 241)"
              }}
            >
              <div>
                {index === 0 ? (
                  <div style={{ position: "relative", top: -10, left: 0 }}>
                    <strong>Latest</strong>
                  </div>
                ) : null}
                <strong>Is Update Or Initial Mount</strong>:{" "}
                {data.isIniitialMount ? "Initial Mount" : "Update"}
              </div>
              <div>
                <strong>Time To Render</strong>: {`${data.time} ms`}
              </div>
              <div>
                <strong>Difference Between Start Time And Commit Time</strong>
                (can be indicator of lag):{" "}
                {`${data.timeBetweenStartAndCommit} ms`}
              </div>
            </div>
          ))}
        </div>
      </ProfilerPanel>
    );
  }
}
export default function register() {
  // Register the addon with a unique name.
  addons.register("REACTPROFILERADDON", api => {
    // Also need to set a unique name to the panel.
    addons.addPanel("REACTPROFILERADDON/panel", {
      title: "Profiler",
      render: ({ active }) => (
        <ProfilerInfo channel={addons.getChannel()} api={api} active={active} />
      )
    });
  });
}
