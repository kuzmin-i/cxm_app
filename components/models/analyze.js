import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Html, Row, Col } from "@react-three/drei";
import { CloseOutlined } from "@ant-design/icons";
import { Line } from "@react-three/drei";

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

const Analyze = () => {
  const [points, setPoints] = useState([]);

  const [tooltip, showTooltip] = useState(false);
  const [tipPosition, setTipPosition] = useState([0, 0, 0]);

  const [pointType, setPointType] = useState(1);

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

    console.log("bounds", bounds);
    console.log("contour", contour);
    console.log("outlines", outlines);

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
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(circle);
      /* const circle_obj = (
        <line geometry={lineGeometry} position={position}>
          <lineBasicMaterial attach="material" color={color} linewidth={100} />
        </line>
      );*/
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
          {circle_obj}

          <mesh
            position={position}
            scale={[radius * 2, radius * 2, radius * 2]}
            onClick={() => {
              showTooltip(true);
              setPointType(label_type);
              setTipPosition([position[0], position[1], 6]);
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
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <group rotation={[(-90 / 180) * Math.PI, 0, 0]}>
      {points}

      {tooltip && (
        <Html as="div" center position={tipPosition}>
          <div
            style={{
              background: "white",
              width: "300px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              padding: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => showTooltip(false)}
              >
                {" "}
                {/*<CloseOutlined />*/}X
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "black",
                  paddingRight: "12px",
                }}
              >
                {pointType}
              </span>

              <span
                style={{ fontSize: "11px", color: "grey", lineHeight: "1.2" }}
              >
                {pointType === 0
                  ? "точка вне контура коммуникаций и нет ничего в радиусе 450"
                  : pointType === 1
                  ? "точка вне контура коммуникаций, но есть коммуникации в радиусе 450"
                  : pointType === 2
                  ? "в радиусе 450 есть свободное место"
                  : pointType === 3
                  ? "в радиусе 1000 есть свободное место"
                  : pointType === 4
                  ? "в радиусе 1000 нет свободного места"
                  : ""}
              </span>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "5px 16px",
                  marginTop: "8px",
                  fontSize: "12px",
                  border: "1px solid black",
                  borderRadius: "20px",
                }}
              >
                Редактировать
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default Analyze;
