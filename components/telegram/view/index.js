import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  bottom: 26px;
  height: 26px;
  z-index: 10;

  width: 100%;
  display: flex;
  justify-content: center;

  pointer-events: none;

  && > * {
    pointer-events: visible;
  }
`;

const Panel = styled.div`
  width: max-content;
  display: flex;
  height: 100%;
  border-radius: 100px;
  background: #eeeeee;
  padding: 2px;
`;

const Btn = styled.div`
  width: max-content;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.4px;

  color: #656565;
  border-radius: 100px;
  padding-left: 10px;
  padding-right: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ type }) =>
    type === "active"
      ? `
    background: #262628;
    color: white;
`
      : ``}
`;

const View = () => {
  return (
    <Wrapper>
      <Panel>
        <Btn type="active">Перспектива</Btn>
        <Btn>Орто</Btn>
        <Btn>План</Btn>
      </Panel>
    </Wrapper>
  );
};

export default View;
