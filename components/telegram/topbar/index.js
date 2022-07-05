import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import {
  motion,
  useMotionValue,
  AnimatePresence,
  AnimateSharedLayout,
} from "framer-motion";

import { EyeInvisibleOutlined } from "@ant-design/icons";
import useClickedOutside from "./outside-hook";
import ChartBar from "./chart";

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
  background: #262628;
  border-radius: 10px;
  overflow: hidden;

  position: absolute;
  left: 10px;
  top: 10px;

  display: flex;
`;

LeftSide.Btn = styled.div`
  width: 50px;
  height: 50px;
  background: #262628;
  cursor: pointer;

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
      background: url('/icons/layers-ic-1.svg');
      `
        : `
      background: url('/icons/history-ic-1.svg');
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
    height: 230px;
  }
`;

const ChartHeader = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
  cursor: pointer;

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

const LayersPanel = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 200px;
  height: 200px;
  background: white;
  overflow: scroll;

  top: 70px;
  border-radius: 10px;
  padding-left: 10px;
`;

const LayersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: max-content;
`;

const Layer = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid #eeeeee;
  padding-right: 10px;

  &&,
  && * {
    font-weight: 400;
    font-size: 13px;
    line-height: 22px;
    letter-spacing: -0.4px;
  }
`;

const VisIcon = styled(EyeInvisibleOutlined)`
  &&,
  && * {
    font-size: 16px;
  }
`;

const LabelLayer = styled.div`
  display: flex;
  align-items: center;

  &&::before {
    content: "";
    width: 15px;
    height: 15px;
    margin-right: 10px;
    border-radius: 8px;
    background: lightgrey;
  }

  && > * + * {
    margin-left: 10px;
  }
`;

const TopBar = ({ fullsize }) => {
  const [graphicsPanel, showGraphicsPanel] = useState(false);
  const [graphicsAreReady, setGraphicsReady] = useState(false);

  useEffect(() => {
    if (graphicsPanel) {
      const timer = setTimeout(() => setGraphicsReady(true), 400);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setGraphicsReady(false);
    }
  }, [graphicsPanel]);

  const [layersPanel, setLayersPanel] = useState(false);

  const graphicsRef = useRef();
  const layersRef = useRef();

  useClickedOutside(graphicsRef, showGraphicsPanel);
  useClickedOutside(layersRef, setLayersPanel);

  return (
    <>
      <Bar>
        {layersPanel && (
          <LayersPanel ref={layersRef}>
            <LayersWrapper>
              {Array(10)
                .fill(1)
                .map((_, i) => {
                  return (
                    <Layer key={`layer${i}`}>
                      <LabelLayer>
                        <div>Слой {i + 1}</div>
                      </LabelLayer>
                      <VisIcon />
                    </Layer>
                  );
                })}
            </LayersWrapper>
          </LayersPanel>
        )}

        <LeftSide>
          <LeftSide.Btn
            section="layers"
            onClick={(e) => {
              e.stopPropagation();
              return setLayersPanel((state) => !state);
            }}
          />
          <LeftSide.Btn section="history" />
        </LeftSide>

        <RightSide
          ref={graphicsRef}
          data-type={graphicsPanel ? "fullsize" : "default"}
        >
          <ChartHeader
            onClick={(e) => {
              e.stopPropagation();
              return showGraphicsPanel((state) => !state);
            }}
          >
            <Arrow data-rotation={graphicsPanel ? "up" : "down"} />
            <div>Инфографика</div>
          </ChartHeader>

          {graphicsAreReady && <ChartBar />}
        </RightSide>
      </Bar>
    </>
  );
};

export default TopBar;
