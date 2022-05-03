import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Html, Row, Col } from "@react-three/drei";
import { CloseOutlined } from "@ant-design/icons";
import { Line, TransformControls } from "@react-three/drei";

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
}) => {
  const [points, setPoints] = useState([]);

  const [tipPosition, setTipPosition] = useState([0, 0, 0]);

  const fetchTodos = async () => {
    const response = await fetch(
      "https://mmodel.contextmachine.online:8443/mmodel_method/estimate_plane_collisions"
    );
    const todos = await response.json();

    const { estimate_plane_collisions: collisions = {} } = todos;
    const {
      bounds = [],
      contour = [],
      labels = [],
      name = "",
      outlines = [],
      pointgrid = [],
    } = collisions;

    setPointsGridData(pointgrid);
    setLabelsData(labels);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (pointsGridData.length > 0 && labelsData.length > 0) {
      const pointgrid = pointsGridData;
      const labels = labelsData;

      const updated_pointgrid = pointgrid.map((point = [], i) => {
        const label_type = labels[i];

        let radius;
        let color;

        if (label_type === 0) {
          radius = 0.45;
          color = "#00FF85";
        }
        if (label_type === 1) {
          radius = 0.45;
          color = "#EBFF00";
        }
        if (label_type === 2) {
          radius = 0.45;
          color = "#FFB800";
        }
        if (label_type === 3) {
          radius = 1;
          color = "#FF6B00";
        }
        if (label_type === 4) {
          radius = 1;
          color = "#FB0707";
        }

        const x_offset = -70279 - 1270;
        const y_offset = 32342.6 - 67846;

        const [x0, y0, z0] = point;

        const position = [
          (x0 + x_offset) * 0.001,
          (y0 + y_offset) * 0.001,
          z0 * 0.001,
        ];

        const circle = drawCircle(radius, false);

        const circle_obj = (
          <group position={position}>
            <Line points={circle} color={color} lineWidth={1} />
            <Line
              points={[
                [0, 0, 0],
                [0, 0, 5300 * 0.001],
              ]}
              color={color}
              lineWidth={0.5}
            />
          </group>
        );

        return (
          <React.Fragment key={`point:${i}`}>
            {/*i === 175 ? (
              <TransformControls mode="translate">
                {circle_obj}
              </TransformControls>
            ) : (
              circle_obj
            )*/}

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
  }, [pointsGridData, labelsData]);

  return <group rotation={[(-90 / 180) * Math.PI, 0, 0]}>{points}</group>;
};

export default Analyze;
