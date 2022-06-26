import React from "react";
import styled from "styled-components";

const Panel = styled.div`
  width: 100%;
  height: 207px;
  background: white;
  border-radius: 20px 20px 0 0;

  position: absolute;
  bottom: 0;
  transition: 0.3s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.1);

  box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px,
    rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px;

  padding: 10px;

  &[data-type="opened"] {
    transform: translateY(0%);
  }

  &[data-type="closed"] {
    transform: translateY(100%);
  }
`;

const ToolsPanel = ({ enabled = false }) => {
  return <Panel data-type={enabled ? "opened" : "closed"}>sdfs</Panel>;
};

export default ToolsPanel;
