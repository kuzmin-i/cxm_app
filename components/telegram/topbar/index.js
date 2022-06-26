import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  motion,
  useMotionValue,
  AnimatePresence,
  AnimateSharedLayout,
} from "framer-motion";

const Bar = styled.div`
  position: absolute;
  z-index: 10;

  width: 100%;
  padding: 0 10px;
  margin-top: 10px;

  display: flex;
  justify-content: space-between;

  height: 50px;
  pointer-events: none;

  && > * {
    pointer-events: visible;

    box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px,
      rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
  }
`;

const LeftSide = styled.div`
  width: max-content;
  height: 50px;

  position: absolute;
  left: 10px;
  top: 10px;

  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;

  display: flex;
`;

LeftSide.Btn = styled.div`
  width: 50px;
  height: 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  &&::before {
    content: "";
    width: 31px;
    height: 31px;

    ${({ section }) =>
      section === "layers"
        ? `
      background: url('/icons/layers-ic.svg');
      `
        : `
      background: url('/icons/history-ic.svg');
      `}
    background-size: cover;
  }
`;

const RightSide = styled.div`
  width: 150px;
  height: 50px;

  transition: all 0.2s ease-in-out;

  background: #262628;
  border-radius: 10px;

  position: absolute;
  right: 10px;
  top: 10px;

  &[data-type="fullsize"] {
    width: 100%;
    right: -0px;
    height: 224px;
  }
`;

const ChartHeader = styled.div`
  width: 100%;
  height: 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  && > * + * {
    margin-left: 8px;
  }

  &&,
  && * {
    color: white;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: -0.4px;
  }
`;

const Arrow = styled.div`
  min-width: 7.18px;
  height: 4.59px;
  background: url("/icons/arrow-bar.svg");
  transition: all 0.3s ease-in-out;

  &[data-rotation="up"] {
    transform: rotate(180deg);
  }
`;

const TopBar = () => {
  const [graphicsPanel, showGraphicsPanel] = useState(false);

  return (
    <>
      <Bar>
        <LeftSide>
          <LeftSide.Btn section="layers" />
          <LeftSide.Btn section="history" />
        </LeftSide>

        <RightSide data-type={graphicsPanel ? "fullsize" : "default"}>
          <ChartHeader onClick={() => showGraphicsPanel((state) => !state)}>
            <Arrow data-rotation={graphicsPanel ? "up" : "down"} />
            <div>Инфографика</div>
          </ChartHeader>
        </RightSide>
      </Bar>
    </>
  );
};

export default TopBar;
