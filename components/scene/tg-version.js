import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";

import { Grid } from "antd";

import Camera from "../scene-core/camera";

import ObjectM2 from "../models/m2-common";
import ObjectM4 from "../models/m4-mesh";
import Analyze from "../models/analyze";
import ObjectM4Wire from "../models/m4-mesh_wire";

import { TransformControls } from "@react-three/drei";

const { useBreakpoint } = Grid;

const LayersWrapper = styled.div`
  position: fixed;
  left: 40px;
  bottom: 140px;
  width: 100%;
  max-width: 250px;

  display: flex;
  flex-direction: column;

  z-index: 10;

  && > * + * {
    margin-top: 10px;
  }
`;

const Scene = () => {
  const screens = useBreakpoint();
  const [tooltip, showTooltip] = useState(false);

  const [newPointMode, openNewPointMode] = useState(false);

  /* Statistics */
  const [uniqueLabelsStatistics, setUniqueLabelsStatistics] = useState([]);
  const [uniqueRacksStatistics, setUniqueRacksStatistics] = useState([]);

  /* */
  const [pointsGridData, setPointsGridData] = useState([]);
  const [axisGridData, setAxisGridData] = useState([]);
  const [labelsData, setLabelsData] = useState([]);

  const [axis_visible, setAxis_visible] = useState(true);
  const [points_visible, setPoints_visible] = useState(true);

  const [highData, setHighData] = useState([]);
  const [verticalData, setVerticalData] = useState([]);
  const [lowData, setLowData] = useState([]);

  const [roofSurf_visible, setRoofSurf_visible] = useState(true);
  const [base_visible, setBase_visible] = useState(true);
  /* */

  /* */
  const [newPointPosition, setNewPointPosition] = useState([0, 0, 0]);
  /* */

  const [pointType, setPointType] = useState(1);
  const [pointPosition, setPointPosition] = useState([0, 0, 0]);
  const [pointId, setPointId] = useState(null);

  /* UI */
  const [layersWindow, showLayersWindow] = useState(false);
  const [pointsWindow, showPointsWindow] = useState(false);

  /* Common */
  const [layers1, setLayers1] = useState(null);
  const [hiddenLayers1, setHiddenLayers1] = useState([]);
  const [isReady1, setReady1] = useState(false);

  const [grid_visible, setGridVisible] = useState(true);

  /* RailsWire */
  const [layers2, setLayers2] = useState(null);
  const [hiddenLayers2, setHiddenLayers2] = useState([]);
  const [isReady2, setReady2] = useState(false);

  /* MeshWire */
  const [layers3, setLayers3] = useState(null);
  const [hiddenLayers3, setHiddenLayers3] = useState([]);
  const [isReady3, setReady3] = useState(false);

  /* Rails */
  const [layers4, setLayers4] = useState(null);
  const [hiddenLayers4, setHiddenLayers4] = useState([]);
  const [isReady4, setReady4] = useState(false);

  /* Mesh */
  const [layers5, setLayers5] = useState(null);
  const [hiddenLayers5, setHiddenLayers5] = useState([]);
  const [isReady5, setReady5] = useState(false);

  const [mesh_visible, setMesh_visible] = useState(true);

  /* */
  const [view, setView] = useState("ortho");

  const [loadingObj, setLoadingObj] = useState(null);
  const [percentsLoaded, setPercentsLoaded] = useState(0);

  const [simpleModel, setSimpleModel] = useState(false);

  /* область закрытия окна со слоями */
  const layersRef = useRef();
  const pointsRef = useRef();

  const handlePoint = (p) => {
    const x_offset = -70279 - 1270;
    const y_offset = 32342.6 - 67846;

    const [x0, y0, z0] = p;

    const position = [
      (x0 + x_offset) * 0.001,
      z0 * 0.001,
      -(y0 + y_offset) * 0.001,
    ];

    return position;
  };

  const transformRef = useRef();

  /* Пересчитать координаты точки при transformControls */
  const handleFinished = (offset = {}) => {
    // x, y, z
    // x, z, -y
    const x_offset = -70279 - 1270;
    const y_offset = 32342.6 - 67846;

    const _x = offset.x * 1000;
    const _y = offset.y * 1000;
    const _z = offset.z * 1000;

    setPointPosition((state) => [state[0] + _x, state[1] - _z, state[2] + _y]);

    setPointsGridData((state) => {
      let data = [...state];
      const state_ = data[pointId];
      data[pointId] = [state_[0] + _x, state_[1] - _z, state_[2] + _y];

      return data;
    });
  };

  return (
    <>
      <Canvas>
        <Camera
          {...{ setNewPointPosition }}
          invalidateFrameloop={true}
          dpr={[1, 2]}
          raycaster={{ enabled: true }}
          colorManagement={false}
          view={view}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
          }}
        />

        <ambientLight />
        <pointLight position={[50, 50, 60]} intensity={8} />

        {tooltip && (
          <TransformControls
            position={handlePoint(pointPosition)}
            key={`pointId${pointId}`}
            mode="translate"
            onMouseUp={(e) => handleFinished(e.target.offset)}
          >
            <mesh ref={transformRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={"orange"} opacity={0} />
            </mesh>
          </TransformControls>
        )}

        {
          <ObjectM2
            visible={grid_visible}
            setLayers={setLayers1}
            hiddenLayers={hiddenLayers1}
            setReady={setReady1}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Размерная сетка")}
          />
        }

        {/* Черновой меш */}
        {isReady1 && (
          <ObjectM4Wire
            visible={mesh_visible && simpleModel}
            setLayers={setLayers3}
            hiddenLayers={hiddenLayers3}
            setReady={setReady3}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Коммуникации")}
          />
        )}

        {/* меш */}
        {isReady3 && (
          <ObjectM4
            visible={mesh_visible && !simpleModel}
            setLayers={setLayers5}
            hiddenLayers={hiddenLayers5}
            setReady={setReady5}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() =>
              setLoadingObj("Комуникации (Высокое качество)")
            }
          />
        )}
      </Canvas>
    </>
  );
};

export default Scene;
