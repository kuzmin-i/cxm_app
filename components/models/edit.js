import React, { useMemo, useRef } from "react";
import styled from "styled-components";

import { useControls, button } from "leva";
import { useEffect } from "react";

import { Typography, Input, Row, Col, Button, notification } from "antd";

const Wrapper = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;
  width: 270px;
  background: white;
  border-radius: 30px;
  z-index: 20;
  padding: 15px;

  &&& * {
    font-size: 11px;
  }

  .ant-input[type="text"] {
    height: 24px;
    border-radius: 5px;
    font-size: 11px;
    background: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.7);
  }

  .ant-row {
    margin-bottom: 7px;
  }

  .ant-btn {
    border-radius: 10px;
  }
`;

const waitingNotification = (placement = "bottomRight") => {
  notification.info({
    message: "Ожидайте ответа с сервера",
    description: "Это может занять около 5 секунд",
    placement,
  });
};

const finishedNotification = (placement = "bottomRight") => {
  notification.success({
    message: "Данные обновлены",
    description:
      "Расположены точек и их тип пересечения с коммуникациями обновлены",
    placement,
  });
};

const handlePost = async ({
  data: pointsGridData,
  setPointsGridData,
  setLabelsData,
}) => {
  waitingNotification();

  const response = await fetch(
    "https://mmodel.contextmachine.online:8443/mmodel_method/estimate_plane_collisions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kwargs: {
          pointgrid: pointsGridData,
        },
      }),
    }
  );

  const data = await response.json();

  const { estimate_plane_collisions = {} } = data;
  const { pointgrid = [], labels = [] } = estimate_plane_collisions;

  setPointsGridData(pointgrid);
  setLabelsData(labels);

  finishedNotification();
};

const EditPanel = ({
  showTooltip,
  pointType,
  setPointType = () => {},
  pointPosition,
  setPointPosition = () => {},
  setPointsGridData = () => {},
  pointsGridData = [],
  setLabelsData = () => {},
  labelsData = [],
  pointId,
}) => {
  /*const [{ type, x, y, z }, set] = useControls(() => ({
    type: { options: ["0", "1", "2", "3", "4"] },
    " ": { value: "the text", editable: false },
    x: 0,
    y: 0,
    z: 0,
    "Сохранить точку": button((get) => {
      console.log(get);
    }),
    "Удалить точку": button((get) => console.log("saved")),
    "Закрыть панель": button((get) => showTooltip(false)),
  }));

  useEffect(() => {
    set({
      "Сохранить точку": { hello: "hello" },
    });
  }, [pointsGridData]);

  useEffect(() => {
    setPointsGridData((state) => {
      let data = [...state];
      data[pointId] = [x, y, z];

      return data;
    });
  }, [pointId, x, y, z]);

  useEffect(() => {
    setLabelsData((state) => {
      let data = [...state];
      data[pointId] = parseInt(type);

      return data;
    });
  }, [pointId, type]);

  useEffect(() => {
    const type = pointType.toString();

    let descr;

    switch (type) {
      case "0":
        descr = "точка вне контура коммуникаций и нет ничего в радиусе 450";
        break;
      case "1":
        descr =
          "точка вне контура коммуникаций, но есть коммуникации в радиусе 450";
        break;
      case "2":
        descr = "в радиусе 450 есть свободное место";
        break;
      case "3":
        descr = "в радиусе 1000 есть свободное место";
        break;
      case "4":
        descr = "в радиусе 1000 нет свободного места";
        break;
    }

    set({
      type: pointType.toString(),
      x: pointPosition[0],
      y: pointPosition[1],
      z: pointPosition[2],
      " ": descr,
    });
  }, [pointType, pointPosition]);*/
  const descr = useMemo(() => {
    const type = pointType.toString();

    switch (type) {
      case "0":
        return "точка вне контура коммуникаций и нет ничего в радиусе 450";

      case "1":
        return "точка вне контура коммуникаций, но есть коммуникации в радиусе 450";

      case "2":
        return "в радиусе 450 есть свободное место";

      case "3":
        return "в радиусе 1000 есть свободное место";

      case "4":
        return "в радиусе 1000 нет свободного места";
    }
  }, [pointType]);

  const xValue = useRef();
  const yValue = useRef();
  const zValue = useRef();

  const handleEditing = () => {
    if (pointId && xValue.current && yValue.current && zValue.current) {
      const x = parseFloat(xValue.current.input.value);
      const y = parseFloat(yValue.current.input.value);
      const z = parseFloat(zValue.current.input.value);

      setPointsGridData((state) => {
        let data = [...state];
        data[pointId] = [x, y, z];

        return data;
      });
    }
  };

  return (
    <React.Fragment>
      <Wrapper
        key={`editPanel:${pointId}:${pointPosition[0]}:${pointPosition[1]}:${pointPosition[2]}`}
      >
        <Row justify="end">
          <Col onClick={() => showTooltip(false)}>
            <div style={{ color: "#096dd9" }}>Закрыть</div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>Тип:</Col>
          <Col span={16}>{pointType}</Col>
        </Row>

        <Row>
          <Col span={8} />
          <Col span={16}>{descr}</Col>
        </Row>

        <Row>
          <Col span={8}>x:</Col>
          <Col span={16}>
            <Input
              ref={xValue}
              onChange={handleEditing}
              defaultValue={Math.round(pointPosition[0] * 100) / 100}
            />
          </Col>
        </Row>

        <Row>
          <Col span={8}>y:</Col>
          <Col span={16}>
            <Input
              ref={yValue}
              onChange={handleEditing}
              defaultValue={Math.round(pointPosition[1] * 100) / 100}
            />
          </Col>
        </Row>

        <Row>
          <Col span={8}>z:</Col>
          <Col span={16}>
            <Input
              ref={zValue}
              onChange={handleEditing}
              defaultValue={Math.round(pointPosition[2] * 100) / 100}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              onClick={() => {
                showTooltip(false);
                return handlePost({
                  data: pointsGridData,
                  setPointsGridData,
                  setLabelsData,
                });
              }}
              type="primary"
              style={{ width: "100%" }}
            >
              Сохранить точку
            </Button>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              onClick={() => {
                showTooltip(false);
                return handlePost({
                  data: pointsGridData.filter((_, i) => i !== pointId),
                  setPointsGridData,
                  setLabelsData,
                });
              }}
              type="secondary"
              style={{ width: "100%" }}
            >
              Удалить точку
            </Button>
          </Col>
        </Row>
      </Wrapper>
    </React.Fragment>
  );
};

export default EditPanel;
