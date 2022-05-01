import React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";

import { Button, Radio, Spin, Space, Grid, Typography, Checkbox } from "antd";
const { useBreakpoint } = Grid;
const { Text } = Typography;

const Bottom = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  display: flex;
  && > * + * {
    margin-left: 10px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: max-content;
  display: flex;
  align-items: center;

  border-radius: 200px;

  padding: 10px;
  background: white;

  && .ant-radio-button-wrapper {
    border-radius: 200px;

    &::before {
      display: none;
    }
  }

  @media (max-width: 576px) {
    &,
    & * {
      font-size: 12px;
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

  @media (max-width: 576px) {
    &,
    & * {
      font-size: 12px;
    }
  }
`;

const Disabling = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: grayscale(1);

  z-index: 11;
`;

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
      color: "black",
      paddingRight: "12px",
      marginRight: "12px",
    }}
    spin
  />
);

const BottomNav = ({
  view,
  setView,
  percentsLoaded,
  loadingObj,
  loadingVisible,
  simpleModel,
  setSimpleModel,
}) => {
  const screens = useBreakpoint();

  return (
    <>
      {loadingVisible && (
        <Loading>
          <Space
            align="center"
            direction={screens.sm ? "horizontal" : "vertical"}
          >
            <Space size={0}>
              <Spin indicator={antIcon} /> {loadingObj}:{" "}
            </Space>
            <Text style={{ color: "white" }}>
              {Math.round(parseFloat(percentsLoaded))}% модели загрузилось
            </Text>
          </Space>
        </Loading>
      )}

      <Bottom>
        <Wrapper>
          <Radio.Group value={view} size="large" onChange={() => {}}>
            <Radio.Button value="ortho" onClick={() => setView("ortho")}>
              Ортогональный вид
            </Radio.Button>
            <Radio.Button value="top" onClick={() => setView("top")}>
              План
            </Radio.Button>
          </Radio.Group>
        </Wrapper>

        <Wrapper>
          {loadingVisible && <Disabling />}

          <Checkbox
            style={{ opacity: loadingVisible ? 0.5 : 1 }}
            checked={simpleModel}
            onChange={(e) => setSimpleModel(!simpleModel)}
          >
            Упростить модель
          </Checkbox>
        </Wrapper>
      </Bottom>
    </>
  );
};

export default BottomNav;
