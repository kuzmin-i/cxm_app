import React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";

import { Button, Radio, Spin } from "antd";

const Wrapper = styled.div`
  position: fixed;
  bottom: 40px;
  width: max-content;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 200px;

  padding: 10px;
  background: white;
  z-index: 10;

  && .ant-radio-button-wrapper {
    border-radius: 200px;

    &::before {
      display: none;
    }
  }
`;

const Loading = styled.div`
  position: fixed;
  bottom: 120px;
  background: grey;
  z-index: 10;

  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: white;
  padding: 6px 12px;
  border-radius: 100px;
`;

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 24, color: "black", paddingRight: "12px", marginRight: '12px' }}
    spin
  />
);

const BottomNav = ({
  view,
  setView,
  percentsLoaded,
  loadingObj,
  loadingVisible,
}) => {
  return (
    <>
      {loadingVisible && (
        <Loading>
          <Spin indicator={antIcon} /> {loadingObj}:{" "}
          {Math.round(parseFloat(percentsLoaded))}% loaded
        </Loading>
      )}

      <Wrapper>
        <Radio.Group value={view} size="large" onChange={() => {}}>
          <Radio.Button value="ortho" onClick={() => setView("ortho")}>
            Orthogonal view
          </Radio.Button>
          <Radio.Button value="top" onClick={() => setView("top")}>
            Top view
          </Radio.Button>
        </Radio.Group>
      </Wrapper>
    </>
  );
};

export default BottomNav;
