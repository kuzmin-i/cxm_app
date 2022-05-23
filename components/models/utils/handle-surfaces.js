import React from "react";
import { Extrude } from "@react-three/drei";

import handleShape from "./handle-shape";

import { handleCorrectPosition } from "./handle-correct-position";

/* ********* */
const handleCorrectVertices = (polygon = []) => {
  return polygon.map((point = []) => {
    const new_p = handleCorrectPosition(point);
    return new_p;
  });
};

/* ********* */
const handleCenter = (polygon = []) => {
  let x = 0;
  let y = 0;
  let z = 0;
  const count = polygon.length;

  polygon.map((point = [], i) => {
    x += point[0];
    y += point[1];
    z += point[2];
  });

  return [x / count, y / count, z / count];
};

/* ********* */
const handleCentralizedPoints = (polygon = [], center = []) => {
  return polygon.map((point = [], i) => {
    return [point[0] - center[0], point[1] - center[1], point[2] - center[2]];
  });
};

/* ********* */
const extrudeCfgs = {
  curveSegments: 1,
  steps: 1,
  depth: 0.01,
  bevelEnabled: false,
};

/* ********* */
const handleSurfaces = (
  highData = [],
  lowData = [],
  verticalData = [],
  selectedLength = null,
  selectedAccess = null,
  infoSection = null
) => {
  let high_pol;
  let low_pol;
  let vert_pol;

  const opacity_ifHalfHidden = 0.2;

  const if_needsHide =
    (infoSection === "racks" && selectedLength) ||
    (infoSection === "access" && selectedAccess);

  if (highData.length > 0) {
    high_pol = highData.map((polygon = [], i) => {
      const vertices = handleCorrectVertices(polygon);
      const center = handleCenter(vertices);

      const centr_verts = handleCentralizedPoints(vertices, center);

      let shape = handleShape(centr_verts);

      return (
        <Extrude
          position={center}
          args={[shape, extrudeCfgs]}
          key={`high:${i}`}
        >
          <meshStandardMaterial
            color="hotpink"
            transparent
            opacity={!if_needsHide ? 0.8 : opacity_ifHalfHidden}
          />
        </Extrude>
      );
    });
  }

  if (lowData.length > 0) {
    low_pol = lowData.map((polygon = [], i) => {
      const vertices = handleCorrectVertices(polygon);
      const center = handleCenter(vertices);
      const centr_verts = handleCentralizedPoints(vertices, center);

      let shape = handleShape(centr_verts);

      return (
        <Extrude position={center} args={[shape, extrudeCfgs]} key={`low${i}`}>
          <meshStandardMaterial
            color="blue"
            transparent
            opacity={!if_needsHide ? 0.6 : opacity_ifHalfHidden}
          />
        </Extrude>
      );
    });
  }

  if (verticalData.length > 0) {
    vert_pol = verticalData.map((polygon = [], i) => {
      const vertices = handleCorrectVertices(polygon);
      const center = handleCenter(vertices);
      const centr_verts = handleCentralizedPoints(vertices, center);

      let shape = handleShape(centr_verts, true);

      return (
        <group
          position={center}
          rotation={[0, (-90 * Math.PI) / 180, 0]}
          key={`vert:${i}`}
        >
          <Extrude args={[shape, extrudeCfgs]}>
            <meshStandardMaterial
              color="green"
              transparent
              opacity={!if_needsHide ? 0.6 : opacity_ifHalfHidden}
            />
          </Extrude>
        </group>
      );
    });
  }

  return {
    high: high_pol,
    low: low_pol,
    vertical: vert_pol,
  };
};

export default handleSurfaces;
