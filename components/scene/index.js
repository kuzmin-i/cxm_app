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

import { TransformControls } from "@react-three/drei";

import { OverlayWrapper } from "../ui/layers";
import EditPanel from "../models/edit";

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

  /* */
  const [pointsGridData, setPointsGridData] = useState([]);
  const [labelsData, setLabelsData] = useState([]);
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

  /* Surface */
  const [layers6, setLayers6] = useState(null);
  const [hiddenLayers6, setHiddenLayers6] = useState([]);
  const [isReady6, setReady6] = useState(false);

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
          {layers1 && (
            <Layers
              data={layers1}
              {...{
                hiddenLayers: hiddenLayers1,
                setHiddenLayers: setHiddenLayers1,
              }}
            />
          )}
          {layers2 && isReady1 && (!layers4 || simpleModel) && (
            <Layers
              one
              data={layers2}
              {...{
                hiddenLayers: hiddenLayers2,
                setHiddenLayers: setHiddenLayers2,
              }}
            />
          )}
          {layers3 && isReady2 && (!layers5 || simpleModel) && (
            <Layers
              data={layers3}
              {...{
                hiddenLayers: hiddenLayers3,
                setHiddenLayers: setHiddenLayers3,
              }}
            />
          )}
          {layers4 && isReady3 && !simpleModel && (
            <Layers
              data={layers4}
              {...{
                hiddenLayers: hiddenLayers4,
                setHiddenLayers: setHiddenLayers4,
              }}
            />
          )}
          {layers5 && isReady4 && !simpleModel && (
            <Layers
              data={layers5}
              {...{
                hiddenLayers: hiddenLayers5,
                setHiddenLayers: setHiddenLayers5,
              }}
            />
          )}
        </LayersWrapper>
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
        {/*<mesh position={[50, 50, 60]} scale={[10, 10, 10]}>
          <planeBufferGeometry />
          <meshStandardMaterial color={"red"} />
        </mesh>*/}
        {/*null && (
          <ObjectM1
            {...{ setActiveLayers, objects, setObjects, hiddenLayers }}
          />
        )*/}

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
          }}
        />
        {
          <ObjectM2
            setLayers={setLayers1}
            hiddenLayers={hiddenLayers1}
            setReady={setReady1}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Размерная сетка")}
          />
        }

        {/* Черновые рельсы */}
        {isReady1 && (
          <ObjectM3Wire
            visible={!isReady4 || simpleModel}
            setLayers={setLayers2}
            hiddenLayers={hiddenLayers2}
            setReady={setReady2}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Крыша")}
          />
        )}

        {/* Черновой меш */}
        {isReady2 && (
          <ObjectM4Wire
            visible={!isReady5 || simpleModel}
            setLayers={setLayers3}
            hiddenLayers={hiddenLayers3}
            setReady={setReady3}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Коммуникации")}
          />
        )}

        {/* Blueprint rails */}
        {isReady3 && (
          <ObjectM3
            visible={!simpleModel}
            setLayers={setLayers4}
            hiddenLayers={hiddenLayers4}
            setReady={setReady4}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Крыша (высокое качество)")}
          />
        )}
        {/* Плоскость */}
        {null && isReady2 && (
          <ObjectM3Surface
            visible={true}
            setLayers={setLayers6}
            hiddenLayers={hiddenLayers6}
            setReady={setReady6}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Плоскость крыши")}
          />
        )}

        {/* меш */}
        {isReady4 && (
          <ObjectM4
            visible={!simpleModel}
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
