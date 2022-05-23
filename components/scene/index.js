import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components";

import { Button, Grid } from "antd";

import ObjectM1 from "../models/m1";
import Camera from "../scene-core/camera";

import Layers from "../ui/layers";
import BottomNav from "../ui/bottom-nav";
import ObjectM2 from "../models/m2-common";
import ObjectM3 from "../models/m3-rails";
import ObjectM3Wire from "../models/m3-rails_wire";
import ObjectM4 from "../models/m4-mesh";
import { useEffect } from "react";
import Analyze from "../models/analyze";
import ObjectM4Wire from "../models/m4-mesh_wire";
import ObjectM3Surface from "../models/m3-rails_surface";
import Statistics from "../ui/statistics";

import { TransformControls } from "@react-three/drei";

import { OverlayWrapper } from "../ui/layers";
import EditPanel from "../models/edit";
import InfographicsPanel from "../ui/infographics-panel";

import useStore from "../../store/store";

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

  useEffect(() => {
    const clickOutside = (e) => {
      if (layersRef.current && !layersRef.current.contains(e.target))
        showLayersWindow(false);

      if (pointsRef.current && !pointsRef.current.contains(e.target))
        showPointsWindow(false);
    };

    window.addEventListener("click", clickOutside);

    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, []);

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
      <BottomNav
        {...{
          view,
          setView,
          loadingObj,
          percentsLoaded,
          loadingVisible: !isReady5,
          simpleModel,
          setSimpleModel,
          showLayersWindow,
          showPointsWindow,
          newPointMode,
        }}
      />

      {uniqueLabelsStatistics.length > 0 &&
        uniqueRacksStatistics.length > 0 && (
          <InfographicsPanel
            labels={uniqueLabelsStatistics}
            racks={uniqueRacksStatistics}
          />
        )}

      {pointsWindow && (
        <LayersWrapper ref={pointsRef}>
          <OverlayWrapper>
            <Button
              onClick={() => {
                const x_offset = -70279 - 1270;
                const y_offset = 32342.6 - 67846;

                setPointsGridData((state) => [
                  ...state,
                  [-x_offset, -y_offset, 0],
                ]);
                setLabelsData((state) => [...state, 0]);
                setPointId(pointsGridData.length);
                setPointPosition([-x_offset, -y_offset, 0]);
                setPointType(0);
                showTooltip(true);
              }}
              size="large"
              style={{ border: "0px" }}
            >
              Добавить точку
            </Button>
          </OverlayWrapper>
        </LayersWrapper>
      )}

      {layersWindow && (
        <LayersWrapper ref={layersRef}>
          <Layers
            data={[
              {
                color: { r: 255, g: 0, b: 0, a: 255 },
                name: "Стойки",
                visible: axis_visible,
                setVisible: setAxis_visible,
              },
              {
                color: { r: 0, g: 255, b: 0, a: 255 },
                name: "Неиспользованные точки",
                visible: points_visible,
                setVisible: setPoints_visible,
              },
              {
                color: { r: 0, g: 255, b: 0, a: 255 },
                name: "Плоскости крыши",
                visible: roofSurf_visible,
                setVisible: setRoofSurf_visible,
              },
              {
                color: { r: 0, g: 255, b: 0, a: 255 },
                name: "Основание",
                visible: base_visible,
                setVisible: setBase_visible,
              },
              {
                color: { r: 0, g: 255, b: 0, a: 255 },
                name: "Коммуникации",
                visible: mesh_visible,
                setVisible: setMesh_visible,
              },
            ]}
            fixedData={[
              {
                color: { r: 255, g: 0, b: 0, a: 255 },
                name: "Сетка",
                visible: grid_visible,
                setVisible: setGridVisible,
              },
            ]}
          />
        </LayersWrapper>
      )}

      {null &&
        uniqueLabelsStatistics.length > 0 &&
        uniqueRacksStatistics.length > 0 && (
          <Statistics
            data={[
              {
                type: "labels",
                name: "Уникальные лейблы",
                data: uniqueLabelsStatistics,
              },
              {
                type: "racks",
                name: "Уникальные длины стоек",
                data: uniqueRacksStatistics,
              },
            ]}
          />
        )}

      {tooltip && (
        <EditPanel
          {...{
            showTooltip,
            pointType,
            setPointType,
            pointPosition,
            setPointPosition,
            /* */
            setPointsGridData,
            pointsGridData,
            pointId,
            setLabelsData,
            labelsData,
            /* */
            axisGridData,
            setAxisGridData,
          }}
        />
      )}

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

        <Analyze
          {...{
            tooltip,
            showTooltip,
            pointType,
            setPointType,
            pointPosition,
            setPointPosition,
            /* */
            pointsGridData,
            setPointsGridData,
            labelsData,
            setLabelsData,
            pointId,
            setPointId,
            /* */
            axisGridData,
            setAxisGridData,
            /* */
            verticalData,
            setVerticalData,
            highData,
            setHighData,
            lowData,
            setLowData,
            /* */
            roofSurf_visible,
            base_visible,
            points_visible,
            axis_visible,
            /* */
            setUniqueLabelsStatistics,
            setUniqueRacksStatistics,
          }}
        />
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

/* Черновые рельсы */
/*isReady1 && (
  <ObjectM3Wire
    visible={!isReady4 || simpleModel}
    setLayers={setLayers2}
    hiddenLayers={hiddenLayers2}
    setReady={setReady2}
    setPercentsLoaded={setPercentsLoaded}
    setLoadingObj={() => setLoadingObj("Крыша")}
  />
        )*/

/* Blueprint rails */
/*isReady3 && (
  <ObjectM3
    visible={!simpleModel}
    setLayers={setLayers4}
    hiddenLayers={hiddenLayers4}
    setReady={setReady4}
    setPercentsLoaded={setPercentsLoaded}
    setLoadingObj={() => setLoadingObj("Крыша (высокое качество)")}
  />
)*/
