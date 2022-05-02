import React from "react";
import { useControls, button } from "leva";
import { useEffect } from "react";

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
  const handlePost = async () => {
    console.log("dddd");

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
            labels: labelsData,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("data", data);
  };

  const [{ type, x, y, z }, set] = useControls(() => ({
    type: { options: ["0", "1", "2", "3", "4"] },
    " ": { value: "the text", editable: false },
    x: 0,
    y: 0,
    z: 0,
    "Сохранить точку": button((get) => handlePost()),
    "Удалить точку": button((get) => console.log("saved")),
    "Закрыть панель": button((get) => showTooltip(false)),
  }));

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
  }, [pointType, pointPosition]);

  return <React.Fragment></React.Fragment>;
};

export default EditPanel;
