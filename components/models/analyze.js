import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Html, Row, Col, Edges } from "@react-three/drei";
import { CloseOutlined } from "@ant-design/icons";
import { Line, TransformControls, Extrude, Circle } from "@react-three/drei";
import handleShape from "./utils/handle-shape";
import handleSurfaces from "./utils/handle-surfaces";
import { handleCorrectPosition } from "./utils/handle-correct-position";
import handleColor from "./utils/handle-color";

import useStore from "../../store/store";

const drawCircle = (r, useVector3) => {
  const points = [];
  const segments = 16;

  for (let index = 0; index < segments; index++) {
    const angle = (index / segments) * 2 * Math.PI;
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    if (useVector3) points.push(new THREE.Vector3(x, z, 0));
    if (!useVector3) points.push([x, z, 0]);
  }

  points.push(points[0]);

  return points;
};

const Analyze = ({
  tooltip,
  showTooltip,
  pointType,
  setPointType,
  pointPosition,
  setPointPosition,
  pointsGridData = [],
  setPointsGridData = () => {},
  labelsData = [],
  setLabelsData = () => {},
  pointId = null,
  setPointId = () => {},
  axisGridData = [],
  setAxisGridData = () => {},
  /* */
  verticalData = [],
  setVerticalData = () => {},
  highData = [],
  setHighData = () => {},
  lowData = [],
  setLowData = () => {},
  /* */
  roofSurf_visible,
  points_visible,
  axis_visible,
  base_visible,
  /* */
  setUniqueLabelsStatistics,
  setUniqueRacksStatistics,
}) => {
  const [points, setPoints] = useState([]);
  const [axis, setAxis] = useState([]);

  const [highPolygon, setHighPolygon] = useState([]);
  const [verticalPolygon, setVerticalPolygon] = useState([]);
  const [lowPolygon, setLowPolygon] = useState([]);

  const [tipPosition, setTipPosition] = useState([0, 0, 0]);

  /* */
  const selectedLength = useStore(({ selectedLength }) => selectedLength);
  const selectedAccess = useStore(({ selectedAccess }) => selectedAccess);
  const infoSection = useStore(({ infoSection }) => infoSection);

  const fetchTodos = async () => {
    /* Берет точки */
    const fetched_collisions = await fetch(
      "https://mmodel.contextmachine.online:8443/mmodel_method/estimate_plane_collisions"
    );
    /* Берет оси */
    const fetched_colAxis = await fetch(
      "https://mmodel.contextmachine.online:8443/mmodel_method/get_column_axis"
    );
    const collisions_json = await fetched_collisions.json();
    const colAxis_json = await fetched_colAxis.json();

    const { estimate_plane_collisions: collisions = {} } = collisions_json;
    const {
      bounds = [],
      contour = [],
      labels = [],
      name = "",
      outlines = [],
      pointgrid = [],
    } = collisions;

    const { get_column_axis = {} } = colAxis_json;

    const { column_axis = [], zmask = {} } = get_column_axis;
    const { high = [], vertical = [], low = [] } = zmask;

    setAxisGridData(column_axis);
    setPointsGridData(pointgrid);
    setLabelsData(labels);

    setHighData(high);
    setVerticalData(vertical);
    setLowData(low);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    let used_points = [];
    let axisLengthArr = [];

    /* Оси */
    if (axisGridData.length > 0) {
      const updated_axisGrid = axisGridData.map((points = [], i) => {
        let sPoints = points[0];
        let ePoints = points[1];

        const length = ePoints[2] - sPoints[2];
        axisLengthArr = [...axisLengthArr, length];

        let labelIndex = null;

        pointsGridData.map((gridPoint = [], b) => {
          const x_condition = sPoints[0] === gridPoint[0];
          const y_condition = sPoints[1] === gridPoint[1];

          if (x_condition && y_condition) {
            labelIndex = b;

            used_points = [...used_points, gridPoint];
          }
        });

        /* label */
        const label_type = labelsData[labelIndex];

        const [radius, color] = handleColor(label_type);
        const origin_sPoints = [...sPoints];

        sPoints = handleCorrectPosition(sPoints);
        ePoints = handleCorrectPosition(ePoints);

        const circle = drawCircle(radius, false);

        const circle_obj = (
          <group position={[sPoints[0], sPoints[1], sPoints[2] + 0.05]}>
            <Line
              points={circle}
              color={color}
              lineWidth={1}
              renderOrder={992}
              depthTest
            />
          </group>
        );

        return (
          <React.Fragment key={`axis,${i}:${length}:${label_type}`}>
            <Line points={[sPoints, ePoints]} color={"red"} lineWidth={0.5} />

            {circle_obj}

            <mesh
              position={sPoints}
              scale={[radius * 2, radius * 2, radius * 2]}
              onClick={() => {
                showTooltip(true);
                setPointId(labelIndex);
                setPointType(label_type);
                setPointPosition(origin_sPoints);
              }}
              onPointerOver={() => {
                return (document.body.style.cursor = "pointer");
              }}
              onPointerOut={() => {
                return (document.body.style.cursor = "auto");
              }}
            >
              <planeBufferGeometry />
              <meshStandardMaterial opacity={0} color={color} transparent />
            </mesh>

            <mesh position={sPoints} scale={[0.1, 0.1, 0.1]}>
              <planeBufferGeometry />
              <meshStandardMaterial color={color} />
            </mesh>
          </React.Fragment>
        );
      });

      setAxis(updated_axisGrid);
    }

    /* неиспользованные поинты без осей */
    const unset_points = pointsGridData.filter((x) => !used_points.includes(x));

    /* статистика по количеству типов */
    let labelsStatistics = {};
    let labelsTypes = [];
    labelsData.map((type) => {
      if (!labelsStatistics[`${type}`]) {
        labelsStatistics[`${type}`] = 0;
        labelsTypes = [...labelsTypes, type];
      }

      labelsStatistics[`${type}`] += 1;
    });

    const uniqueLabelsStatistics = labelsTypes.sort().map((type) => {
      return {
        type,
        count: labelsStatistics[type],
      };
    });

    setUniqueLabelsStatistics(uniqueLabelsStatistics);

    /* количество уникальных длин стоек */

    let axisUniqueLengthStatistics = {};
    let axisUniqueLengthTypes = [];
    axisLengthArr.map((length) => {
      if (!axisUniqueLengthStatistics[length]) {
        axisUniqueLengthStatistics[length] = 0;
        axisUniqueLengthTypes = [...axisUniqueLengthTypes, length];
      }

      axisUniqueLengthStatistics[length] += 1;
    });

    const uniqueRacksStatistics = axisUniqueLengthTypes.sort().map((length) => {
      return {
        type: length,
        count: axisUniqueLengthStatistics[length],
      };
    });

    setUniqueRacksStatistics(uniqueRacksStatistics);

    /* оставшиеся points data */
    if (pointsGridData.length > 0 && labelsData.length > 0) {
      const pointgrid = unset_points;
      const labels = labelsData;

      const updated_pointgrid = pointgrid.map((point = [], i) => {
        const label_type = labels[i];

        const [radius, color] = handleColor(label_type);

        const position = handleCorrectPosition(point);

        const circle = drawCircle(radius, false);

        const circle_obj = (
          <group position={position}>
            <Line points={circle} color={color} lineWidth={1} />
          </group>
        );

        return (
          <React.Fragment key={`point,${i}:${label_type}`}>
            {circle_obj}

            <mesh
              position={position}
              scale={[radius * 2, radius * 2, radius * 2]}
              onClick={() => {
                showTooltip(true);
                setPointId(i);
                setPointType(label_type);
                setTipPosition([position[0], position[1], 6]);
                setPointPosition(point);
              }}
              onPointerOver={() => {
                return (document.body.style.cursor = "pointer");
              }}
              onPointerOut={() => {
                return (document.body.style.cursor = "auto");
              }}
            >
              <planeBufferGeometry />
              <meshStandardMaterial opacity={0} color={color} transparent />
            </mesh>

            <mesh position={position} scale={[0.1, 0.1, 0.1]}>
              <planeBufferGeometry />
              <meshStandardMaterial color={color} />
            </mesh>
          </React.Fragment>
        );
      });

      setPoints(updated_pointgrid);
    }
  }, [pointsGridData, labelsData, axisGridData]);

  /* Плоскости */
  useEffect(() => {
    const {
      high = [],
      low = [],
      vertical = [],
    } = handleSurfaces(
      highData,
      lowData,
      verticalData,
      selectedLength,
      selectedAccess,
      infoSection
    );

    setHighPolygon(high);
    setLowPolygon(low);
    setVerticalPolygon(vertical);
  }, [
    highData,
    lowData,
    verticalData,
    selectedLength,
    selectedAccess,
    infoSection,
  ]);

  const if_needsHide =
    (infoSection === "racks" && selectedLength) ||
    (infoSection === "access" && selectedAccess);

  return (
    <group rotation={[(-90 / 180) * Math.PI, 0, 0]}>
      {roofSurf_visible && highPolygon}
      {roofSurf_visible && verticalPolygon}

      {base_visible && lowPolygon}

      {points_visible &&
        points.map((item = {}) => {
          if (if_needsHide) return;

          return item;
        })}

      {axis_visible &&
        axis.map((item = {}) => {
          const { key } = item;

          const length = key.split(":")?.[1];
          const labelIndex = key.split(":")?.[2];

          if (
            infoSection === "racks" &&
            selectedLength &&
            selectedLength !== length
          )
            return;

          if (
            infoSection === "access" &&
            selectedAccess &&
            parseInt(selectedAccess) !== parseInt(labelIndex)
          )
            return;

          return item;
        })}
    </group>
  );
};

export default Analyze;
