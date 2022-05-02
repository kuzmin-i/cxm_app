import { React } from "react";
import styled from "styled-components";

import { Checkbox } from "antd";
import { useEffect } from "react";

const Wrapper = styled.div`
  width: 100%;
  max-width: 250px;

  padding: 24px;
  background: white;
  border-radius: 30px;

  font-size: 0.75rem;

  display: flex;
  flex-direction: column;

  z-index: 10;
`;

export const OverlayWrapper = Wrapper;

const LayerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  justify-content: space-between;
`;

const Label = styled.div`
  display: flex;
  align-items: center;

  &&::before {
    content: "";
    min-width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ color }) => (color ? color : "red")};
    margin-right: 8px;
  }
`;

const Layer = ({ name, color, hiddenLayers = [], setHiddenLayers, index }) => {
  const { r = 255, g = 0, b = 0 } = color ? color : {};
  const hexColor = `rgb(${r}, ${g}, ${b})`;

  const handleCheck = (e) => {
    if (!hiddenLayers.includes(index))
      return setHiddenLayers((state) => [...state, index]);

    if (hiddenLayers.includes(index))
      return setHiddenLayers((state) => state.filter((key) => key !== index));
  };

  return (
    <LayerWrapper>
      <Label color={hexColor}>{name}</Label>

      <Checkbox
        checked={hiddenLayers.includes(index) ? false : true}
        onChange={handleCheck}
      />
    </LayerWrapper>
  );
};

const Layers = ({
  data = [],
  hiddenLayers,
  setHiddenLayers = () => {},
  hideLayer = true,
  setHideLayer = () => {},
}) => {
  return (
    <Wrapper>
      {data.map(({ ...props }, i) => {
        return (
          <Layer
            {...props}
            index={i}
            {...{ hiddenLayers, setHiddenLayers, hideLayer, setHideLayer }}
            key={`layer::${i}`}
          />
        );
      })}
    </Wrapper>
  );
};

export default Layers;
